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
      if (token) {
        session.user.id = token.sub;
      }
      return session;
    },
    async jwt({ token, user }: { token: any, user: any }) {
      if (user) {
        token.sub = user.id;
      }
      return token;
    },
  },
  // debug: process.env.NODE_ENV === 'development', // Uncomment for debugging if needed
};