# Prisma Integration Execution Plan (Revised)

This plan outlines the steps to integrate Prisma ORM into the Next.js project using Yarn.

**Phase A: Setup & Configuration**

1.  **Switch Package Manager to Yarn:**
    *   Remove `pnpm-lock.yaml`.
    *   Remove `node_modules` directory.
    *   Remove `packageManager` field from `package.json`.
    *   Run `yarn install` to generate `yarn.lock` and install dependencies.
2.  **Install Prisma CLI:** Add Prisma CLI as a development dependency using Yarn (`yarn add -D prisma`).
3.  **Initialize Prisma:** Set up Prisma configuration, specifying PostgreSQL as the datasource provider (`yarn prisma init --datasource-provider postgresql`).
4.  **Configure Database Connection:** Define the `DATABASE_URL` environment variable in the `.env` file (create `.env` from `.env.example` if it doesn't exist).
5.  **Define Schema Model:** Add a simple model (e.g., `User`) to the `prisma/schema.prisma` file.

**Phase B: Database Migration & Client Generation**

6.  **Run Initial Migration:** Create the initial database migration and apply it to the database (`yarn prisma migrate dev --name init`).
7.  **Generate Prisma Client:** Generate the Prisma Client library based on the schema (`yarn prisma generate`).

**Phase C: Implementation & Testing**

8.  **Create Prisma Client Singleton:** Implement a reusable Prisma Client instance in `lib/prisma.ts`.
9.  **Create Test API Route:** Build a basic Next.js API route (`app/api/test-db/route.ts`) to demonstrate a simple database interaction (e.g., creating or fetching a user).
10. **Test API Route:** Verify the API route functions correctly.

**Phase D: Future UI Enhancements (TODO)**

11. **Integrate User Photo:** Implement subtle background integration for user photo (Option B from discussion). Requires photo file and styling details.

**Phase E: UI Updates & Fixes (Completed - April 8, 2025)**

12. **Update Logo References:**
    *   Searched for `/logo.png` usage.
    *   Replaced `/logo.png` with `/llogo.png` in `app/opengraph-image.tsx`.
13. **Fix TypeScript Errors:**
    *   Installed `@types/node` to resolve `process` error.
    *   Updated `tsconfig.json` (`target: "esnext"`, `moduleResolution: "bundler"`) to resolve module and JSX errors in `app/opengraph-image.tsx`.
14. **Update Favicon:**
    *   Removed `app/favicon.ico`.
    *   Copied `public/llogo.png` to `app/icon.png` (Next.js convention).

**Phase F: Blog Post Readability Enhancement (Planned)**

15. **Goal:** Improve readability of the individual blog post page (`app/(default)/blog/[slug]/page.tsx`).
16. **Step 1: Optimize Line Length:**
    *   **File:** `app/(default)/blog/[slug]/page.tsx`
    *   **Change:** Modify content container class from `max-w-3xl` to `max-w-2xl`.
17. **Step 2: Refine Typography Styles:**
    *   **File:** `tailwind.config.js`
    *   **Change:** Add customizations under `theme.extend.typography` for the default `prose` class.
    *   **Focus Areas:** Link styling (color, hover), paragraph spacing (margins, line-height), heading margins.
18. **Step 3: Add Syntax Highlighting (Decision Pending):**
    *   **Action:** Integrate a library (e.g., `rehype-highlight`) with `ReactMarkdown` if code blocks are frequently used.
    *   **Requires:** User confirmation, package installation, component update.