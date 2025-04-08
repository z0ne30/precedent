# Product Strategy & Development Plan: Vibetest Digital Garden (Apr 2025 - Oct 2025)

**Context:** This plan analyzes the "Vibetest Digital Garden" (Enyu Rao's personal site) and proposes prioritized improvements and features for the next 6 months.

*   **Core Function:** Personal website serving as a digital garden, blog, and portfolio showcase.
*   **Target Audience:** Visitors interested in Enyu Rao's technical work, thoughts on AI/development, projects, and potentially recruiters or collaborators.
*   **Tech Stack:** Next.js (v14), React, TypeScript, Tailwind CSS, Prisma, PostgreSQL, NextAuth (Google Provider), Framer Motion, Vercel hosting.
*   **Inferred Objectives:** Increase visitor engagement, effectively showcase technical skills/portfolio, establish/grow personal brand.

---

**1. Core Improvements (Prioritized)**

| Priority | Improvement Area          | Problem                                                                 | Proposed Solution                                                                                                | User/Business Benefit                                       | High-Level Technical Approach                                                                                                                               | Est. Effort |
| :------- | :------------------------ | :---------------------------------------------------------------------- | :--------------------------------------------------------------------------------------------------------------- | :---------------------------------------------------------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------- | :---------- |
| **1**    | **Global Navigation**     | Lack of persistent header/footer makes site navigation disjointed.        | Implement fixed/sticky `Header` and `Footer` components in `app/layout.tsx`. Include key links (Home, Blog, Projects, Contact, Socials). | Improved UX, easier content discovery, consistent branding. | Create React components, style with Tailwind, integrate into root layout. Ensure responsiveness.                                                              | Medium      |
| **2**    | **Performance Tuning**    | Vanta.js background and potentially large images/JS bundles impact load time. | 1. Analyze bundle size (`@next/bundle-analyzer`). 2. Lazy-load Vanta.js or consider conditional loading. 3. Optimize images (Next/Image already helps). 4. Review component code splitting. | Faster load times, better user retention, improved SEO scores. | Use bundle analyzer, dynamic imports (`next/dynamic`), image optimization review, potentially defer non-critical scripts.                                      | Medium      |
| **3**    | **Accessibility Audit**   | No formal accessibility review has been conducted.                      | Perform an audit using tools (Axe DevTools, Lighthouse) and manual checks (keyboard nav, screen reader). Address WCAG AA compliance issues. | Increased usability for all users, broader audience reach.   | Use automated tools, manual testing (tab navigation, screen reader), update semantic HTML, ARIA attributes, focus management, color contrast adjustments. | Medium      |
| **4**    | **Admin UX Polish**       | The admin dashboard is functional but could be more intuitive.          | Enhance `PostEditor`: Add Markdown preview, improve tag management UI, consider bulk actions (publish/unpublish/delete) in `PostList`. | Improved content management efficiency for the admin (Enyu). | Update React components (`PostEditor`, `PostList`), potentially add a Markdown preview library, implement bulk action API logic and UI controls.             | Medium      |
| **5**    | **Code Health & Refactor** | Some areas might have technical debt from rapid development/refactoring. | Review API route logic, component complexity, error handling, and test coverage. Refactor complex components or brittle logic.          | Improved maintainability, reduced bugs, easier future development. | Code reviews, add more unit/integration tests (Jest), potentially restructure components or API handlers based on findings.                               | High        |

---

**2. New Feature Proposals (Prioritized)**

| Priority | Feature                     | Concept Overview                                                                                                | User Value Proposition                                                                 | Impact on Metrics                                                               | Key Technical Considerations                                                                                                                                                              | Est. Effort |
| :------- | :-------------------------- | :-------------------------------------------------------------------------------------------------------------- | :------------------------------------------------------------------------------------- | :------------------------------------------------------------------------------ | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :---------- |
| **1**    | **Dedicated Project Showcase** | A new section/page to visually present projects (like Launch Yard) with descriptions, links, tech stacks, images/videos. | Clearly highlights skills and accomplishments, provides context beyond blog posts. | Increased engagement, better portfolio demonstration, potential leads/interest. | New data model (Prisma) for Projects, new API routes, new frontend page/components, image/media handling.                                                                               | Medium      |
| **2**    | **"Working Notes" Section** | Implement a true "digital garden" feature: short, potentially interconnected notes/thoughts separate from formal blog posts. | Offers more frequent, less formal updates; showcases evolving ideas; encourages exploration. | Increased content volume, higher return visit potential, unique site value.     | New data model (Notes, potentially with relations), new API routes, new UI for browsing/viewing notes (potentially graph visualization?), update admin section to manage notes.             | Medium-High |
| **3**    | **Newsletter Signup**       | Integrate a simple newsletter signup form (e.g., using ConvertKit, Mailchimp, or Resend for backend).           | Allows interested visitors to stay updated on new content/projects.                  | Audience building, direct communication channel, increased return visits.       | Choose provider, add signup component, create backend API endpoint (or use provider's direct integration), manage list/sending.                                                              | Low-Medium  |
| **4**    | **Enhanced Search**         | Implement site-wide search across blog posts, projects, and potentially "Working Notes".                          | Improves content discoverability significantly as the site grows.                    | Increased page views, reduced bounce rate, improved user satisfaction.          | Requires backend search logic spanning multiple Prisma models, potentially integrating a dedicated search service (e.g., Algolia) for better performance/features, update UI.                 | Medium-High |
| **5**    | **Interactive Content/Viz** | Add interactive elements like data visualizations related to blog posts, or small creative coding demos.          | Showcases advanced technical skills, makes content more engaging and memorable.      | Increased time on site, enhanced brand perception, potential viral sharing.     | Requires specific libraries (e.g., D3.js, Three.js), potentially significant development time per piece, integration with content.                                                        | High        |

---

**Prioritization Rationale:**

1.  **Core Navigation & Performance:** Essential for usability and retention.
2.  **Project Showcase:** High strategic value for portfolio demonstration.
3.  **Working Notes:** Aligns with "digital garden" concept, encourages return visits.
4.  **Accessibility & Newsletter:** Important for inclusivity and audience building.
5.  **Enhanced Search & Admin Polish:** Value increases with content volume.
6.  **Code Health & Interactive Content:** Important long-term/high-effort.

---

**Next Steps:**

1.  Review and discuss this plan.
2.  Refine priorities if needed.
3.  Break down top items into actionable tasks.
4.  Begin implementation.