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