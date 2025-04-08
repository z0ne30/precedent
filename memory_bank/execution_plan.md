# Project Execution Plan

**Phase A: Setup & Configuration (Completed)**

1.  **Switch Package Manager to Yarn:** (Completed)
2.  **Install Prisma CLI:** (Completed)
3.  **Initialize Prisma:** (Completed)
4.  **Configure Database Connection:** (Completed)
5.  **Define Schema Model:** (Completed)

**Phase B: Database Migration & Client Generation (Completed)**

6.  **Run Initial Migration:** (Completed)
7.  **Generate Prisma Client:** (Completed)

**Phase C: Implementation & Testing (Completed)**

8.  **Create Prisma Client Singleton:** (Completed)
9.  **Create Test API Route:** (Completed)
10. **Test API Route:** (Completed)

**Phase D: Future UI Enhancements (TODO)**

11. **Integrate User Photo:** Implement subtle background integration for user photo (Option B from discussion). Requires photo file and styling details.

**Phase E: UI Updates & Fixes (Completed - April 8, 2025)**

12. **Update Logo References:** (Completed)
    *   Searched for `/logo.png` usage.
    *   Replaced `/logo.png` with `/llogo.png` in `app/opengraph-image.tsx`.
13. **Fix TypeScript Errors:** (Completed)
    *   Installed `@types/node` to resolve `process` error.
    *   Updated `tsconfig.json` (`target: "esnext"`, `moduleResolution: "bundler"`) to resolve module and JSX errors in `app/opengraph-image.tsx`.
14. **Update Favicon:** (Completed)
    *   Removed `app/favicon.ico`.
    *   Copied `public/llogo.png` to `app/icon.png` (Next.js convention).

**Phase F: Blog Post Readability Enhancement (Planned - Paused)**

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

**Phase G: Contact Page Redesign (Planned)**

19. **Goal:** Redesign `app/contact/page.tsx` for better flow.
20. **Step 1: Update Cal.com Button Text:**
    *   **File:** `app/contact/page.tsx`
    *   **Change:** Modify button text from "Book a Meeting" to "Let's chat :)".
21. **Step 2: Create Reusable Modal Component:**
    *   **File:** `app/components/Modal.tsx` (New File)
    *   **Implementation:** Use `@radix-ui/react-dialog` for accessibility. Component accepts `isOpen`, `onClose`, `children`.
22. **Step 3: Implement Contact Form Modal Logic:**
    *   **File:** `app/contact/page.tsx`
    *   **Changes:**
        *   Import `Modal` component.
        *   Add state `isContactModalOpen`.
        *   Remove direct `<ContactForm />` render.
        *   Add "Send me a message" button to trigger modal (`setIsContactModalOpen(true)`).
        *   Conditionally render `<Modal>` containing `<ContactForm />`.
        *   Ensure modal close sets state to `false`.