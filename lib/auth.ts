import { AuthOptions, SessionStrategy } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from '@/lib/prisma'; // Reuse existing prisma client

// Basic validation for environment variables - moved here for clarity
if (!process.env.GOOGLE_CLIENT_ID) {
  throw new Error("Missing GOOGLE_CLIENT_ID environment variable");
}
if (!process.env.GOOGLE_CLIENT_SECRET) {
  throw new Error("Missing GOOGLE_CLIENT_SECRET environment variable");
}
if (!process.env.NEXTAUTH_SECRET) {
  // Allow missing secret in development for easier setup, but warn.
  if (process.env.NODE_ENV !== 'production') {
    console.warn("Missing NEXTAUTH_SECRET environment variable. Using a generated secret for development is highly discouraged for security reasons.");
  } else {
     throw new Error("Missing NEXTAUTH_SECRET environment variable. This is required for production.");
  }
  // Note: NextAuth might use a default insecure secret if missing in dev, which is not ideal.
}

// Define and EXPORT authOptions from this shared file
export const authOptions: AuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  session: {
    strategy: "jwt" as SessionStrategy, // Use JWT strategy
  },
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async session({ session, token }: { session: any, token: any }) {
      // Add properties from token to session object
      if (token?.sub) {
        session.user.id = token.sub;
      }
      if (token?.isAdmin !== undefined) { // Check if isAdmin exists on token
        session.user.isAdmin = token.isAdmin;
      }
      return session;
    },
    async jwt({ token, user, account, profile }: { token: any, user?: any, account?: any, profile?: any }) {
      // On initial sign in, 'user' object is passed (from adapter)
      if (account && user) {
        token.sub = user.id; // Persist user.id from adapter into token
        // Fetch isAdmin status from DB using user.id
        try {
          // Fetch the full user object instead of selecting only isAdmin
          const dbUser = await prisma.user.findUnique({
            where: { id: user.id },
            // select: { isAdmin: true }, // Remove select
          });
          // Explicitly check if dbUser and isAdmin exist and are boolean
          if (dbUser && typeof dbUser.isAdmin === 'boolean') {
            token.isAdmin = dbUser.isAdmin;
          } else {
            // Default to false if user not found or isAdmin is not boolean
            token.isAdmin = false;
          }
        } catch (error) {
          console.error("Error fetching user isAdmin status in JWT callback:", error);
          token.isAdmin = false; // Default to false on error
        }
      }
      // Subsequent calls only have 'token'. The isAdmin value is already in the token.
      return token;
    },
  },
  // debug: process.env.NODE_ENV === 'development', // Uncomment for debugging if needed
};

// Helper function to require admin session in API routes
import { getServerSession } from "next-auth/next";
import { NextResponse } from 'next/server';

export async function requireAdminSession() {
  const skipAuth = process.env.NODE_ENV === 'development' && process.env.SKIP_AUTH_IN_DEV === 'true';

  if (skipAuth) {
    console.log("⚠️ Skipping auth check in DEV mode.");
    return null; // Indicate auth was skipped
  }

  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (session.user.isAdmin !== true) {
     return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  // If checks pass, return the session object
  return session;
}