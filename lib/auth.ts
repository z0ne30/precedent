import { AuthOptions, SessionStrategy } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';

// Conditionally import Prisma and adapter only if DATABASE_URL is available
let PrismaAdapter: any = null;
let prisma: any = null;

try {
  if (process.env.DATABASE_URL) {
    const { PrismaAdapter: PrismaAdapterImport } = require("@next-auth/prisma-adapter");
    const { prisma: prismaClient } = require('@/lib/prisma');
    PrismaAdapter = PrismaAdapterImport;
    prisma = prismaClient;
  }
} catch (error) {
  console.warn("Prisma not available for NextAuth, using JWT-only mode.");
}

// Basic validation for environment variables - only check if they're needed
const hasGoogleConfig = process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET;

// Define and EXPORT authOptions from this shared file
export const authOptions: AuthOptions = {
  // Only use PrismaAdapter if available, otherwise rely on JWT
  ...(PrismaAdapter && prisma ? { adapter: PrismaAdapter(prisma) } : {}),
  providers: [
    // Only add Google provider if credentials are available
    ...(hasGoogleConfig ? [
      GoogleProvider({
        clientId: process.env.GOOGLE_CLIENT_ID!,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      })
    ] : [])
  ],
  session: {
    strategy: "jwt" as SessionStrategy, // Always use JWT strategy for compatibility
  },
  secret: process.env.NEXTAUTH_SECRET || "fallback-secret-for-build",
  callbacks: {
    async session({ session, token }: { session: any, token: any }) {
      // Add properties from token to session object
      if (token?.sub) {
        session.user.id = token.sub;
      }
      if (token?.isAdmin !== undefined) {
        session.user.isAdmin = token.isAdmin;
      }
      return session;
    },
    async jwt({ token, user, account, profile }: { token: any, user?: any, account?: any, profile?: any }) {
      // On initial sign in, 'user' object is passed (from adapter)
      if (account && user) {
        token.sub = user.id;
        // Only try to fetch isAdmin status if prisma is available
        if (prisma) {
          try {
            const dbUser = await prisma.user.findUnique({
              where: { id: user.id },
            });
            if (dbUser && typeof dbUser.isAdmin === 'boolean') {
              token.isAdmin = dbUser.isAdmin;
            } else {
              token.isAdmin = false;
            }
          } catch (error) {
            console.error("Error fetching user isAdmin status in JWT callback:", error);
            token.isAdmin = false;
          }
        } else {
          // Default to false when no database is available
          token.isAdmin = false;
        }
      }
      return token;
    },
  },
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
