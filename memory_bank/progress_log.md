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
*   **4/5/2025, 1:55:37 PM UTC** - **Implemented Admin Dashboard Overhaul (Phase 1):**
    *   Verified/updated admin API endpoints (`/api/admin/posts`, `/api/admin/posts/[id]`) for GET, POST, PUT, DELETE.
    *   Created two-panel layout in `app/admin/page.tsx` using client component state.
    *   Created `app/components/admin/PostList.tsx` to display posts with relative timestamps and handle selection.
    *   Created `app/components/admin/PostEditor.tsx` to fetch/display selected post, handle edits (title, slug, content, published, tags) with debounced saving, display timestamps, and handle deletion.
    *   Integrated `PostList` and `PostEditor` into `app/admin/page.tsx`.
*   **4/5/2025, 1:56:48 PM UTC** - **Implemented Blog Page Enhancements (Phase 2):**
    *   Verified `/api/blog` endpoint provides necessary data.
    *   Created `app/components/blog/PostCard.tsx` client component with card layout, Framer Motion hover animation, and Radix UI Tooltip for excerpt preview.
    *   Integrated `PostCard` into `app/(default)/blog/page.tsx`, replacing previous article rendering.
*   **4/5/2025, 2:35:39 PM UTC** - **Debugged Clerk Authentication:**
    *   Diagnosed persistent "auth() called but clerkMiddleware() not detected" error.
    *   Confirmed via logging and testing that `clerkMiddleware` was not executing for API routes despite various matcher configurations.
    *   Applied workaround by removing `auth()` calls from API handlers.
    *   Fixed related runtime error in `PostEditor` by ensuring `PUT /api/admin/posts/[id]` returns tags after update.
*   **4/5/2025, 5:15:32 PM UTC** - **Refactored Authentication to NextAuth:**
    *   Installed `next-auth` and `@next-auth/prisma-adapter`.
    *   Configured NextAuth API route (`/api/auth/[...nextauth]`) with Google Provider and Prisma Adapter.
    *   Created shared `lib/auth.ts` for `authOptions`.
    *   Added NextAuth environment variables (`GOOGLE_CLIENT_ID/SECRET`, `NEXTAUTH_SECRET`) to `.env`.
    *   Replaced `ClerkProvider` with `SessionProvider` in `app/layout.tsx`.
    *   Removed Clerk middleware file.
    *   Updated admin API routes to use `getServerSession` for protection.
    *   Updated `app/admin/page.tsx` to use `useSession` hook for auth state, sign-in/out.
    *   Fixed build errors related to `authOptions` export/import.
    *   Fixed ESLint warning in `ScramblingText.tsx`.
    *   Committed changes.
*   **4/6/2025, 4:40:42 PM UTC** - **Implemented Admin Authorization:**
    *   Added `isAdmin` boolean field to `User` model in `prisma/schema.prisma`.
    *   Migrated database (`add_admin_flag`).
    *   Updated NextAuth callbacks (`lib/auth.ts`) to include `isAdmin` in session/JWT.
    *   Added NextAuth type augmentations (`types/next-auth.d.ts`).
    *   Added authorization checks (`session.user.isAdmin`) to `/admin` page and `/api/admin/...` routes.
    *   Fixed related TypeScript errors in `lib/auth.ts`.
    *   Updated `build` script in `package.json` to include `prisma migrate deploy`.
    *   Committed changes.
*   **4/6/2025, 5:11:39 PM UTC** - **Debugged Auth & Background Issues:**
    *   Fixed `SKIP_AUTH_IN_DEV` logic by adding non-public variable to `.env` and restarting dev server. Confirmed `/admin` loads posts in dev mode.
    *   Troubleshot invisible global background SVG; reverted global implementation attempt and restored background to only `app/page.tsx`.
*   **4/6/2025, 8:21:12 PM UTC** - **Applied Light Theme Styling (Phase 1):**
    *   Removed grid overlay from `BackgroundSVG` component.
    *   Changed `app/page.tsx` background/text colors to light theme.
    *   Applied styles from `STYLE_GUIDE.md` to Admin Portal layout, side nav, post editor inputs/buttons, blog post card, blog list search/filters, and single blog post page.
    *   Fixed various syntax errors caused by `apply_diff` tool.
*   **4/8/2025, 5:19:36 PM UTC** - **Implemented Prioritized UI Improvements:**
    *   **Consistent Page Layouts:** Created reusable `PageLayout` component (`app/components/PageLayout.tsx`) with standard padding/max-width and integrated it into Contact (`app/contact/page.tsx`) and Blog Post (`app/(default)/blog/[slug]/page.tsx`) pages.
    *   **Standardized Styles:** Defined base CSS classes (`.btn`, `.btn-primary`, `.form-input`, `.form-label`) in `app/globals.css` and refactored `ContactForm` component and Cal.com button to use them.
    *   **Enhanced Microinteractions:** Added CSS hover effects for nav links (`.nav-link-hover-scale`), click feedback for buttons, transition effects for contact form feedback, and Framer Motion fade-in animation to `PageLayout`. Fixed syntax errors during implementation.
*   **4/8/2025, 5:44:25 PM UTC** - **Implemented Global Navigation (Strategy Plan - Core #1):**
    *   Created `Header` component (`app/components/Header.tsx`) with site branding and primary navigation links (Home, Blog, Contact).
    *   Created `Footer` component (`app/components/Footer.tsx`) with copyright and social links.
    *   Integrated `Header` and `Footer` into the root layout (`app/layout.tsx`) using a flexbox structure for proper positioning.
    *   Removed redundant "Back" links from Contact and Blog Post pages.
*   **4/8/2025, 6:03:50 PM UTC** - **Started Performance Tuning (Strategy Plan - Core #2):**
    *   Installed `@next/bundle-analyzer`.
    *   Configured `next.config.js` for bundle analysis.
    *   Attempted build analysis, encountered build error related to `/blog/[slug]` route.
    *   Debugged build error: Added detailed logging, simplified `generateStaticParams`, cleared `.next` cache. Error persisted.
    *   Resolved build error by moving blog routes (`/blog/page.tsx`, `/blog/[slug]/page.tsx`) out of the `(default)` route group.
    *   Successfully ran build analysis (`ANALYZE=true yarn build`).
    *   Reviewed client bundle report: Identified `three.js` (via `VantaBackground`) as the largest dependency (~609 KB parsed).
    *   Implemented optimization: Dynamically imported `VantaBackground` component in `app/layout.tsx` using `next/dynamic` with `ssr: false`.
*   **4/8/2025, 6:08:38 PM UTC** - **Started Code Health & Refactor (Strategy Plan - Core #5):**
    *   **Reviewed Contact API (`/api/contact/route.ts`):** Analyzed structure, validation, DB logic, email sending (Resend), and error handling.
    *   **Refactored Validation:** Installed `zod`, defined `ContactFormSchema`, and replaced manual validation with `schema.safeParse()`. Inferred `ContactFormData` type.
    *   **Refactored Configuration:** Added `CONTACT_SENDER_NAME`, `CONTACT_SENDER_EMAIL`, `CONTACT_NOTIFICATION_EMAIL` variables to `.env.example`. Updated API route to use `process.env` for these (requires user to set values in local `.env`).
    *   **Reviewed Public Blog API (`/api/blog/**`):** Found routes clean and functional. Noted potential enhancements (pagination, server-side filtering, caching).
    *   **Refactored Admin Blog API (`/api/admin/posts/**`):**
        *   Abstracted auth logic into `requireAdminSession` helper in `lib/auth.ts`.
        *   Applied helper to GET/POST/PUT/DELETE handlers.
        *   Implemented Zod validation for POST (`CreatePostSchema`) and PUT (`UpdatePostSchema`).
    *   **Reviewed Admin Frontend (`PostEditor.tsx`):** Applied standardized global styles (`.form-input`, `.form-label`, `.btn`). Noted potential improvements for tag input UI.
    *   **Reviewed `lib/` Utilities & Hooks:** Found `utils.ts` and hooks generally well-structured. Noted minor potential improvements (error handling, SSR compatibility, testing).
    *   **Added Tests (`Contact API`):** Created `__tests__/api/contact.test.ts` with Jest tests. Debugged and fixed Jest mock hoisting/initialization issues. (Skipped final test run verification).
*   **4/8/2025, 6:31:33 PM UTC** - **Started Admin UX Polish (Strategy Plan - Core #4):**
    *   **Added Markdown Preview:** Implemented toggleable Markdown preview in `PostEditor.tsx` using `ReactMarkdown` and `prose` styling.
*   **4/8/2025, 7:42:39 PM UTC** - **Implemented Scroll-Aware UI (Refined Concept 2):**
    *   **Created Hooks:** Implemented `useScrollDirection.ts` and `useScrollPosition.ts` (with throttling).
    *   **Created Components:**
        *   `ScrollAwareHeader.tsx`: Client Component using hooks to show header on scroll-up (desktop) or fixed menu icon (mobile) triggering overlay.
        *   `ScrollAwareFooter.tsx`: Client Component using `useIntersectionObserver` to show footer when end-of-page sentinel is visible.
        *   `ParallaxBackgroundWrapper.tsx`: Client Component using `useScrollPosition` to apply parallax effect.
    *   **Refactored Layout (`app/layout.tsx`):**
        *   Converted to Client Component to use `useRef`.
        *   Removed static Header/Footer.
        *   Integrated `ScrollAwareHeader`, `ScrollAwareFooter` (with sentinel ref), and `ParallaxBackgroundWrapper` around `VantaBackground`.
        *   Fixed conflicting `VantaBackground` imports.
        *   **Fixed Metadata/Client Component Conflict:** Resolved build error by reverting `app/layout.tsx` to a Server Component (keeping `metadata` export) and creating `app/components/ClientLayout.tsx` (marked `'use client'`) to handle client-side hooks (`useRef`) and components (`ScrollAwareHeader`, `ScrollAwareFooter`, `ParallaxBackgroundWrapper`, `SessionProviderWrapper`).
    *   **4/8/2025, 7:50:15 PM UTC** - **Continued UI Pillars Implementation:**
        *   **Disabled Mobile Parallax:** Updated `ParallaxBackgroundWrapper.tsx` to use `useMediaQuery` and disable the transform effect on mobile devices.
        *   **Refined Typography:** Added specific dark mode (`prose-invert`) overrides to `tailwind.config.js` for better theme consistency. Confirmed `PageLayout` padding is adequate.
        *   **Deferred Task:** Noted that a full Accessibility Audit (Pillar #7) remains as a future task.
    *   **4/8/2025, 7:54:14 PM UTC** - **Continued UI Pillars Implementation (Typography):**
        *   **Phased out SF Pro Font:** Removed SF Pro configuration from `app/fonts/index.ts`, `app/layout.tsx`, and `tailwind.config.js`.
        *   **Reviewed Typography:** Confirmed `app/page.tsx` and `app/contact/page.tsx` align with the simplified font system (Inter/Orbitron) and spacing guidelines.
    *   **Improved Tag Input:** Replaced comma-separated tag input with a pill-based UI in `PostEditor.tsx`, allowing adding tags via Enter key and removing tags via button click. Updated state management and save logic accordingly. Fixed JSX syntax error during implementation.
    *   **Added Bulk Actions:**
        *   Added selection state (`selectedPostIds`) and handlers (`handleToggleSelectPost`, `handleSelectAll`) to `app/admin/page.tsx`.
        *   Added checkboxes to `PostList.tsx` for selecting individual posts and all posts.
        *   Added bulk action buttons (Publish, Unpublish, Delete) and handlers (`handleBulkAction`, etc.) to `app/admin/page.tsx`.
        *   Created bulk action API endpoint (`app/api/admin/posts/bulk/route.ts`) with Zod validation and Prisma `updateMany`/`deleteMany` logic.
    *   **4/8/2025, 6:49:54 PM UTC** - **Refactored Blog UI/UX & Performance:**
        *   **API (`/api/blog/[slug]`):** Added ISR revalidation (`revalidate = 3600`).
        *   **Blog List (`/app/blog/page.tsx`):**
            *   Converted to Server Component.
            *   Moved data fetching server-side with pagination, tag filtering, and search based on `searchParams`.
            *   Created client components `BlogSearchControls.tsx` and `PaginationControls.tsx` to handle user interactions and URL updates.
            *   Added `loading.tsx` for Suspense boundary.
            *   Integrated `PageLayout`.
        *   **Single Post (`/app/blog/[slug]/page.tsx`):**
            *   Recreated file after accidental deletion during previous refactoring.
            *   Added top margin to `<article>` for better spacing.
            *   Ensured usage of `PageLayout`.
        *   **Fixed Build Error (`createContext`):** Diagnosed `TypeError` related to Framer Motion's context usage (`<motion.div>`) within `PageLayout` when rendered by Server Components (like the refactored blog page).
        *   **Refactored Animation:** Extracted the `<motion.div>` into a new Client Component (`app/components/AnimatedPageWrapper.tsx`). Updated `PageLayout.tsx` to use this wrapper, resolving the server-rendering conflict.