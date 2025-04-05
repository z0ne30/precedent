# Project Plan: Admin Dashboard Overhaul & Blog Enhancement

**Goal:** Create a Notion/Obsidian-inspired admin dashboard for seamless post management and improve the public blog page with interactive card previews.

---

## Phase 1: Admin Dashboard (`/admin`) Transformation

*   **Objective:** Replace the current `/admin` UI with a two-panel layout: a left sidebar listing posts (with timestamps) and a main content area for editing the selected post.

*   **Steps:**

    1.  **UI/UX Design & Mockup (Conceptual):**
        *   **Layout:** Implement a responsive two-column layout.
            *   **Left Panel (Sidebar):** Fixed-width, scrollable list of all blog posts. Each item should show the post title and `updatedAt` timestamp (formatted like "Edited 5 hours ago"). Consider adding a search/filter bar at the top.
            *   **Main Content Area:** Takes the remaining width. Displays the editor for the currently selected post. If no post is selected, show a placeholder message or instructions.
        *   **Interaction:** Clicking a post in the sidebar loads its content into the editor in the main area *without* a full page reload (client-side navigation/state update).
        *   **Styling:** Use Tailwind CSS and potentially leverage existing Radix components (or add new ones like `Resizable` panels if desired) for a clean, modern aesthetic inspired by Notion/Obsidian.

    2.  **Backend API Adjustments (`/app/api/admin/posts/...`):**
        *   **Verify/Update GET `/api/admin/posts`:** Ensure this endpoint efficiently fetches *all* posts, returning `id`, `title`, and `updatedAt` for the sidebar list. Consider pagination if the number of posts could become very large.
        *   **Verify/Update GET `/api/admin/posts/[id]`:** Ensure this fetches the full content (`id`, `title`, `content`, `slug`, `published`, `createdAt`, `updatedAt`, `tags`) for the selected post to populate the editor.
        *   **Verify/Update PUT/PATCH `/api/admin/posts/[id]`:** Ensure this endpoint handles updates to `title`, `content`, `slug`, `published`, and `tags`. Prisma automatically handles `updatedAt`.

    3.  **Frontend Component Structure (`/app/admin/...`):**
        *   **`/app/admin/page.tsx` (Main Layout):**
            *   Fetch the initial list of posts (IDs, titles, updated timestamps) using a Server Component or client-side fetch.
            *   Implement the two-panel layout (e.g., using CSS Grid/Flexbox).
            *   Manage the state for the `selectedPostId`.
        *   **`components/admin/PostList.tsx` (Left Panel):**
            *   Receives the list of posts as props.
            *   Renders the scrollable list.
            *   Handles post selection, updating the `selectedPostId` state in the parent (`/app/admin/page.tsx`).
            *   Displays titles and formatted `updatedAt` timestamps.
        *   **`components/admin/PostEditor.tsx` (Main Content Area):**
            *   Receives the `selectedPostId` as a prop.
            *   Conditionally renders:
                *   Placeholder if `selectedPostId` is null.
                *   An editor form if `selectedPostId` is set.
            *   Fetches the full post data for the `selectedPostId` when it changes.
            *   **Editor Choice:**
                *   *Option A (Simple):* Use a standard `<textarea>` with `react-markdown` for preview (if content is Markdown).
                *   *Option B (Rich):* Integrate a dedicated rich text editor library (e.g., Tiptap, Lexical, TinyMCE, Editor.js) for a more Notion-like editing experience. This is a bigger integration effort but yields a more "impressive" result. Consider compatibility with storing content as a string (or JSON if the editor requires it, which would need a schema change).
            *   Handles form state, input changes, and saving (calling the PUT/PATCH API endpoint). Debounce save operations to avoid excessive API calls.
            *   Display `createdAt` and `updatedAt` timestamps prominently within the editor view.
        *   **Mermaid Diagram:**
            ```mermaid
            graph TD
                A[AdminPage /app/admin/page.tsx] -- Fetches Post List --> B(PostList /components/admin/PostList.tsx);
                A -- Manages selectedPostId --> B;
                A -- Manages selectedPostId --> C(PostEditor /components/admin/PostEditor.tsx);
                B -- OnClick Sets selectedPostId --> A;
                C -- Fetches Post Details based on selectedPostId --> D{API /api/admin/posts/[id]};
                C -- Saves Post --> D;
            ```

    4.  **State Management:**
        *   Use React's `useState` in `/app/admin/page.tsx` to manage `selectedPostId`.
        *   Use `useState` or `useReducer` within `PostEditor.tsx` for form state.
        *   Leverage Next.js App Router's client-side navigation (`useRouter` or `<Link>`) for updating the selected post without full reloads, potentially using query parameters or dynamic route segments if preferred over simple state management.
        *   Use a library like `SWR` or `React Query` (or Next.js built-in caching) for efficient data fetching, caching, and mutation handling (updating the post list after save).

    5.  **Timestamp Formatting:**
        *   Use a library like `date-fns` or `dayjs` (or native Intl API) to format the `createdAt` and `updatedAt` timestamps into user-friendly relative strings (e.g., "Created yesterday", "Edited 2 hours ago").

---

## Phase 2: Public Blog Page (`/blog`) Enhancement

*   **Objective:** Display blog posts in a card format on the main `/blog` listing page, with each card showing a preview (e.g., excerpt or metadata) on hover.

*   **Steps:**

    1.  **UI/UX Design & Mockup (Conceptual):**
        *   **Layout:** Arrange posts in a grid or list of cards.
        *   **Card Content:** Each card should display the post title, maybe tags, and the `createdAt` or `updatedAt` date.
        *   **Hover Interaction:** When hovering over a card:
            *   Animate the card slightly (e.g., scale up, shadow).
            *   Display a preview overlay or tooltip containing a short excerpt of the post content or other metadata (e.g., full date, author if added later). Use Framer Motion for smooth animations.

    2.  **Backend API Adjustments (`/app/api/blog/...`):**
        *   **Verify/Update GET `/api/blog`:** Ensure this endpoint returns the necessary data for each post card: `title`, `slug`, `createdAt`/`updatedAt`, `tags`, and potentially a short `excerpt` (either pre-generated and stored in the DB or generated on the fly from `content`).

    3.  **Frontend Component Structure (`/app/blog/...`):**
        *   **`/app/blog/page.tsx` (Main Blog List):**
            *   Fetch the list of published posts with data needed for cards.
            *   Render the grid/list layout.
            *   Map over posts and render a `PostCard` component for each.
        *   **`components/blog/PostCard.tsx`:**
            *   Receives individual post data as props.
            *   Renders the card structure (title, date, etc.).
            *   Wraps the card content in a `motion` component from Framer Motion for hover animations.
            *   Integrates a hover preview mechanism:
                *   *Option A (Tooltip):* Use Radix UI Tooltip to show the excerpt/metadata on hover. Simple and clean.
                *   *Option B (Custom Overlay):* Create a custom absolutely positioned overlay component that appears on hover, styled as desired. More flexible but more complex.
            *   Manages hover state (`useState`).
        *   **Mermaid Diagram:**
            ```mermaid
            graph TD
                E[BlogPage /app/blog/page.tsx] -- Fetches Published Posts --> F{API /api/blog};
                E -- Renders List of --> G(PostCard /components/blog/PostCard.tsx);
                G -- On Hover --> H(HoverPreview [Tooltip or Custom Component]);
                G -- Contains Link to --> I[PostPage /app/blog/[slug]];
            ```

    4.  **State Management:**
        *   Minimal client-side state needed, primarily for hover effects within `PostCard.tsx` (`useState`).

    5.  **Excerpt Generation (If needed):**
        *   If storing a dedicated `excerpt` field isn't desired, create a utility function (`lib/utils.ts`) to truncate the `content` string to a suitable length for the preview. Be mindful of not cutting off in the middle of Markdown syntax if applicable.

---

## Technology/Library Suggestions

*   **Admin Editor:**
    *   **Tiptap:** Modern, headless, framework-agnostic, good for customizability. Might require storing content as JSON.
    *   **Lexical (by Meta):** Extensible, framework-agnostic, powerful. Also might lean towards JSON state.
    *   **Keep Simple:** Stick with `<textarea>` and `react-markdown` if a full rich-text experience isn't strictly necessary initially.
*   **UI Components:** Continue leveraging Radix UI primitives and Tailwind CSS. Consider `shadcn/ui` if you want pre-built, accessible components based on Radix/Tailwind.
*   **Animations:** Framer Motion (already included) is excellent for the hover effects.
*   **Data Fetching/State:** SWR or React Query can simplify data fetching, caching, and mutations, especially for the admin dashboard's dynamic updates.
*   **Date Formatting:** `date-fns` is lightweight and effective.

---

## Potential Challenges

*   **Rich Text Editor Integration:** Choosing, integrating, and potentially adapting the database schema/API for a rich text editor can be complex.
*   **Performance:** Ensure efficient data fetching, especially for the admin post list and blog page, potentially using pagination or infinite scrolling if lists become very long.
*   **Seamless Editing:** Achieving a truly seamless editing experience without page reloads requires careful state management and client-side data handling.