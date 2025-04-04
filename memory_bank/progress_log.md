# Progress Log

*   **[Timestamp]** - Initialized memory bank system by creating `execution_plan.md`, `progress_log.md`, and `decision_log.md`.
*   **[Timestamp]** - **Analyzed Project:** Reviewed `package.json` and project structure. Identified `pnpm` as the current package manager, conflicting with the requirement to use `yarn`.
*   **[Timestamp]** - **Completed Step A.1 (Switch Package Manager to Yarn):** Removed `pnpm-lock.yaml`, `node_modules`, removed `packageManager` field from `package.json`, and successfully ran `yarn install`. Lockfile `yarn.lock` created. Noted peer dependency warnings for `focus-trap-react` and `next`.
*   **[Timestamp]** - **Completed Step A.2 (Install Prisma CLI):** Successfully added `prisma` (v6.5.0) as a dev dependency using `yarn add -D prisma`.
*   **[Timestamp]** - **Completed Step A.3 (Initialize Prisma):** Successfully ran `yarn prisma init --datasource-provider postgresql`. Created `prisma/schema.prisma` and added `DATABASE_URL` placeholder to `.env`. Verified `.env` is already in `.gitignore`.
*   **[Timestamp]** - **Completed Step A.4 (Configure Database Connection):** Updated `DATABASE_URL` in `.env` with the non-pooling connection string found in the existing `POSTGRES_URL_NONPOOLING` variable.
*   **[Timestamp]** - **Completed Step A.5 (Define Schema Model):** Added a basic `User` model (id, email, name) to `prisma/schema.prisma`.
*   **[Timestamp]** - **Completed Step B.6 & B.7 (Run Initial Migration & Generate Prisma Client):** Successfully ran `yarn prisma migrate dev --name init`. Migration `20250403160816_init` created and applied. Prisma Client (v6.5.0) generated automatically.
*   **[Timestamp]** - **Completed Step C.8 (Create Prisma Client Singleton):** Created `lib/prisma.ts` with the recommended singleton pattern for Prisma Client instantiation in Next.js.
*   **[Timestamp]** - **Completed Step C.9 (Create Test API Route):** Created `app/api/test-db/route.ts` with a GET handler to fetch users using the Prisma Client singleton.
*   **[Timestamp]** - **Completed Step C.10 (Test API Route):** Successfully tested the `/api/test-db` endpoint using `curl http://localhost:3000/api/test-db`. Received `{"users":[]}` response, confirming database connection and Prisma setup.
*   **[Timestamp]** - **Completed Prisma Integration:** All steps in `memory_bank/execution_plan.md` are complete.
*   **[Timestamp]** - **Completed Landing Page / Contact Form Implementation:**
    *   Added `ContactSubmission` model to `prisma/schema.prisma`.
    *   Attempted migration with non-pooling URL (failed P1001).
    *   Switched `DATABASE_URL` in `.env` to use direct connection string (`POSTGRES_URL`).
    *   Successfully ran `yarn prisma migrate dev --name add_contact_submission`. Migration `20250403162453_add_contact_submission` created and applied.
    *   Created contact form API route handler at `app/api/contact/route.ts`.
    *   Ran `yarn prisma generate` explicitly to resolve TS error and update Prisma Client types.
    *   Updated `app/page.tsx` to be a client component with state management and form submission logic targeting `/api/contact`.
    *   Tested contact form submission using `curl` POST request to `/api/contact`; received success message.
    *   Verified database entry by temporarily modifying `/api/test-db` to fetch submissions and confirming via `curl`; reverted `/api/test-db` afterwards.
*   **[Timestamp]** - **Refined Landing Page UI:**
    *   Generated abstract SVG background and saved as `app/components/background.tsx` after `write_to_file` issues with `public/` directory.
    *   Imported and rendered `BackgroundSVG` component in `app/page.tsx`.
    *   Updated placeholder text (Brand Name, Tagline) and navigation links (GitHub, Project Site, Twitter) in `app/page.tsx` with provided details.
    *   Corrected background component import path in `app/page.tsx` to use relative path.
*   **4/3/2025, 4:37:47 PM UTC** - **Meta:** Discussed timestamp issue in progress log. Switched logging method to use `apply_diff` for appending entries with actual timestamps.
*   **4/3/2025, 4:40:05 PM UTC** - **Started Blog Implementation (Backend):**
    *   Defined `Post` and `Tag` models with many-to-many relationship in `prisma/schema.prisma`.
    *   Successfully ran `yarn prisma migrate dev --name add_blog_models`. Migration `20250403163930_add_blog_models` created and applied. Prisma Client regenerated.
    *   Created API route `app/api/blog/route.ts` to fetch published posts.
    *   Created dynamic API route `app/api/blog/[slug]/route.ts` to fetch a single published post by slug.
    *   Ran `yarn prisma generate` again to attempt resolving persistent TS errors (likely editor/cache issue).
*   **4/3/2025, 4:41:18 PM UTC** - **Continued Blog Implementation (Frontend):**
    *   Created blog listing page component `app/blog/page.tsx` to fetch and display published posts.
    *   Created dynamic single post page component `app/blog/[slug]/page.tsx` to fetch and display a post by slug. Noted persistent TS errors, likely editor/cache related.
*   **4/3/2025, 4:54:40 PM UTC** - **Continued Blog Implementation (Seeding & Rendering):**
    *   Confirmed `react-markdown` dependency exists.
    *   Created Prisma seed script `prisma/seed.ts` with sample tags and posts.
    *   Configured `package.json` for `prisma db seed` using `ts-node`.
    *   Installed `ts-node` and `tsconfig-paths` dev dependencies.
    *   Successfully executed `yarn prisma db seed`.
    *   Added filter/search UI placeholders to `app/blog/page.tsx`.
    *   Updated `app/blog/[slug]/page.tsx` to import and use `ReactMarkdown` for rendering post content.
*   **4/3/2025, 4:57:21 PM UTC** - **Verified Blog Implementation (Basic):**
    *   Attempted to fix server-side Prisma client resolution in `app/blog/page.tsx` by moving import into `getPosts` function.
    *   Restarted `yarn dev` after `curl` connection refused.
    *   Verified `/blog` page renders seeded post correctly using `curl`.
    *   Verified `/blog/first-post` page renders seeded post content (via `ReactMarkdown`) correctly using `curl`.
*   **4/3/2025, 5:02:27 PM UTC** - **Implemented Blog Tag Filtering:**
    *   Updated `app/blog/page.tsx` to fetch all tags, modify `getPosts` to accept a tag filter, and render tag links for filtering via URL search params.
    *   Verified filtering works correctly using `curl` with `/blog?tag=Technology`.
*   **4/3/2025, 5:04:38 PM UTC** - **Implemented Blog Search (Basic):**
    *   Updated `getPosts` in `app/blog/page.tsx` to accept `searchQuery` and filter by title/content using Prisma `contains`.
    *   Updated `BlogPage` component to read `q` search param and pass to `getPosts`.
    *   Wrapped search/filter UI in a `<form>` for basic submission.
    *   Verified search works correctly using `curl` with `/blog?q=Markdown`.
*   **4/3/2025, 5:07:42 PM UTC** - **Started Admin Section Setup (Auth):**
    *   Reviewed Clerk setup in `app/layout.tsx` (ClerkProvider exists).
    *   Updated `app/middleware.ts` to protect `/admin/**` routes using `auth().protect()`.
    *   Noted Google provider needs configuration in Clerk dashboard (User Task).
    *   Confirmed Sign-in/User buttons exist in `components/layout/navbar.tsx`.
    *   Created basic placeholder page `app/admin/page.tsx`.
*   **4/3/2025, 5:11:43 PM UTC** - **Continued Admin Section Setup (UI):**
    *   Updated `app/admin/page.tsx` to fetch and display all posts (drafts and published) in a table.
    *   Skipped manual verification of admin page access/display upon user request.
*   **4/3/2025, 5:13:13 PM UTC** - **Implemented Admin Blog CRUD API:**
    *   Created POST endpoint `app/api/admin/posts/route.ts` for creating posts (protected by Clerk auth).
    *   Created dynamic route `app/api/admin/posts/[id]/route.ts` with PUT (update) and DELETE handlers (protected by Clerk auth).
    *   Noted persistent Prisma Client TS errors.
*   **4/3/2025, 5:14:58 PM UTC** - **Implemented Admin Create Post UI:**
    *   Created client component `app/admin/posts/new/page.tsx` with form fields (title, slug, content, tags, published) and submission logic targeting `/api/admin/posts`.
    *   Added "Create New Post" button/link to `app/admin/page.tsx`.
*   **4/3/2025, 5:17:20 PM UTC** - **Implemented Admin Edit Post UI:**
    *   Created server component `app/admin/posts/[id]/edit/page.tsx` to fetch post data.
    *   Created client component `app/admin/posts/[id]/edit/EditPostForm.tsx` pre-filled with post data and logic to submit PUT requests.
    *   Added "Edit" links to the post list table in `app/admin/page.tsx`.
    *   Fixed/adjusted import paths and noted persistent TS errors.
*   **4/3/2025, 5:18:31 PM UTC** - **Implemented Admin Delete Post UI:**
    *   Created client component `app/admin/DeletePostButton.tsx` with confirmation dialog and DELETE request logic.
    *   Integrated `DeletePostButton` into the post list table in `app/admin/page.tsx`.
    *   Corrected import path for `DeletePostButton`.
*   **4/3/2025, 5:29:45 PM UTC** - **Implemented API Testing (Jest):**
    *   Installed Jest, ts-jest, and related dev dependencies.
    *   Configured Jest using `jest.config.js` and `jest.setup.js`.
    *   Added `test` script to `package.json` (corrected comment syntax error).
    *   Wrote basic Jest test suite `__tests__/api/blog.test.ts` for the public GET `/api/blog` endpoint, mocking Prisma client.
    *   Fixed test assertion for error message logging.
    *   Successfully ran tests using `yarn jest`.
*   **4/3/2025, 5:46:15 PM UTC** - **Fixed Vercel Build Error & Ran Pre-deploy Checks:**
    *   Updated `generateStaticParams` in `app/blog/[slug]/page.tsx` to dynamically import prisma client and explicitly disconnect, attempting to fix Vercel build error.
    *   Successfully ran `yarn build` locally (noted unusual terminal output markers).
    *   Successfully ran `yarn lint`. Pre-deployment checks passed.
*   **4/3/2025, 5:51:20 PM UTC** - **Prepared for Deployment Retry:** Updated build script, fixed `generateStaticParams`, passed local build and lint checks.
*   **4/3/2025, 6:01:48 PM UTC** - **Deployed to Production:** Successfully deployed project to Vercel using `vercel --prod`. Production URL: https://vibetest-gcnn02bhu-z0ne30-projects.vercel.app
*   **4/3/2025, 6:24:41 PM UTC** - **Fixed Landing Page Layout:** Identified landing page content being constrained by default layout. Attempted route group fix (failed due to `mv` issues). Reverted `app/layout.tsx` and implemented conditional rendering of Navbar/Footer/main wrapper based on pathname using `usePathname`. Removed unused `app/(default)` directory attempt.
*   **4/3/2025, 6:27:31 PM UTC** - **Prepared for Deployment Retry (Attempt 2):** User confirmed Vercel environment variables (incl. direct DB URL) are correct and Vercel build command override set to `prisma generate && yarn build`.
*   **4/3/2025, 7:01:59 PM UTC** - **Cleaned Up Template Files:** Identified template files vs custom additions using timestamps. Removed unused template directories (`components/home`, `components/layout`, `components/shared`) and assets (`public/clerk.svg`, `next.svg`, etc.), and `app/sitemap.ts`. Fixed resulting import errors for Navbar/Footer in `app/(default)/layout.tsx`. Updated metadata placeholders in `app/layout.tsx`.
*   **4/3/2025, 7:05:27 PM UTC** - **Fixed Admin Layout:** Resolved issue where `/admin` page content was obscured/centered by removing the fixed background div and centering styles from the `<main>` wrapper in `app/(default)/layout.tsx`.
*   **4/5/2025, 1:30:12 AM UTC** - **Completed Application Testing & Bug Fixes:**
    *   Performed comprehensive `curl` testing of landing page, blog (list, single, filter, search, edge cases), APIs (blog, contact, test-db), and admin access.
    *   Identified and fixed bug in blog filtering/search logic (`app/(default)/blog/page.tsx`) where "no results" cases incorrectly showed all posts. Confirmed fix via logs.
    *   Identified and fixed bug in contact form API (`app/api/contact/route.ts`) where the success message didn't match test expectations. Confirmed fix via `curl`.
    *   Identified critical issue: Clerk middleware (`app/middleware.ts`) is not protecting `/admin` routes despite extensive debugging attempts (multiple configurations, env checks, restarts, logging). Admin protection remains unresolved.
*   **4/5/2025, 1:35:01 AM UTC** - **Refactored Contact Form:**
    *   Extracted contact form from `app/page.tsx` into `app/components/ContactForm.tsx`.
    *   Created new contact page `app/contact/page.tsx` using the component.
    *   Updated `app/page.tsx` to remove form and link to `/contact`.
*   **4/5/2025, 1:43:30 AM UTC** - **Enhanced Landing Page Visuals:**
    *   Increased opacity in `app/components/background.tsx` to make background SVG visible.
    *   Added Tailwind hover effects (scale, shadow) to links/button in `app/page.tsx`.
    *   Added Framer Motion entrance animations (staggered fade-in/slide-up) to content in `app/page.tsx`.
*   **4/5/2025, 2:15:19 AM UTC** - **Removed Magnetic Cursor Effect:** Removed magnetic dot snapping logic and element from `app/components/CustomCursor.tsx` and associated `data-cursor-magnetic` attributes from `app/page.tsx` per user request.
*   **4/5/2025, 2:31:39 AM UTC** - **Updated Landing Page Font & Spacing:**
    *   Configured Orbitron font (`app/fonts/index.ts`, `app/layout.tsx`, `tailwind.config.js`).
    *   Applied Orbitron font to main heading (`h1`) in `app/page.tsx`.
    *   Increased vertical margins between elements in `app/page.tsx`.
*   **4/5/2025, 2:48:35 AM UTC** - **Implemented Manual Text Scramble Animation:**
    *   Attempted to use `react-text-scramble` and `use-scramble` libraries, but encountered runtime errors/incompatibilities. Uninstalled both.
    *   Implemented a manual character scramble effect for the subtitle in `app/page.tsx` using React state and `useEffect`/`setInterval`.
*   **4/5/2025, 2:45:14 AM UTC** - **Diagnosed Build Error:** Traced persistent build error (`Unexpected token 'div'`) to an issue likely caused by text animation libraries (`react-scramble`/`use-scramble`) interacting poorly with the build process. Initially resolved by removing the library and implementing animation manually. (Note: Initial error message was misleading).
*   **4/5/2025, 2:59:00 AM UTC** - **Re-implemented Text Scramble with `use-scramble`:** Reverted manual scramble implementation and re-implemented using the `use-scramble` hook per user request, including installing the dependency and creating the `ScramblingText.tsx` component. Build errors persisted, likely due to build cache/tooling issues.
*   **4/5/2025, 2:55:55 AM UTC** - **Adjusted Landing Page Layout:** Increased heading font size, increased vertical margins, and widened max content width on `app/page.tsx` for better use of landscape space.
*   **4/5/2025, 2:50:40 AM UTC** - **Added Deploy Script:** Added `"deploy:prod": "vercel --prod"` script to `package.json`.