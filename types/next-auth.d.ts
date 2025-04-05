import NextAuth, { DefaultSession, DefaultUser } from "next-auth";
import { JWT, DefaultJWT } from "next-auth/jwt";

// Extend the built-in session/user types to include 'id' and 'isAdmin'
declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: {
      /** The user's unique ID from the database. */
      id?: string | null; // Usually string from adapter/token sub
      /** The user's admin status. */
      isAdmin?: boolean | null;
    } & DefaultSession["user"]; // Keep existing properties like name, email, image
  }

  /** Extends the default User type */
  interface User extends DefaultUser {
     /** The user's admin status. */
    isAdmin?: boolean | null;
  }
}

// Extend the built-in JWT type
declare module "next-auth/jwt" {
  /** Returned by the `jwt` callback and `getToken`, when using JWT sessions */
  interface JWT extends DefaultJWT {
    /** The user's admin status. */
    isAdmin?: boolean | null;
    // 'sub' is already part of DefaultJWT for user ID
  }
}