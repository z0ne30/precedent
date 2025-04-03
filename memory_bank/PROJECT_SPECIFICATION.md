# Final Project Specification: Personal Website & Blog (v4)

1.  **Project Goal:** Develop and deploy a personal website featuring a landing page (with contact form storing submissions) and an integrated blog (with tagging, filtering, and search) within a 5-hour time constraint.
2.  **Technology Stack:** (Likely Next.js, Tailwind CSS, Vercel KV or similar for contact form/blog storage, Google Auth library, serverless functions).
3.  **Landing Page:**
    *   **Design:** Visually impactful, simple, modern, tech-focused aesthetic.
    *   **Visual Element:** Abstract, minimalist vector graphic (interconnected nodes), used as a **subtle background element**.
    *   **Color Scheme:** Dark grey, teal, white.
    *   **Navigation (External):** Links to GitHub, Personal Project Site, Twitter.
    *   **Navigation (Internal):** Link to the Personal Blog.
    *   **Contact Form:** Fields for Name, Email, Message.
        *   **Submission Handling:** Serverless function stores submission data (Name, Email, Message) in a simple database (e.g., Vercel KV).
4.  **Personal Blog:**
    *   **Functionality:** Create, manage, display posts. Includes tagging, filtering by tags, and basic keyword search.
    *   **Supported Media:** Text, images, code snippets, embedded videos.
    *   **Tagging & Filtering:** Add/manage tags per post; filter posts by tag on the blog page.
    *   **Search:** Basic keyword search (title/content) on the blog page.
    *   **Admin View (`/admin`):**
        *   **Access:** Secured via Google Authentication.
        *   **Features:** CRUD operations for posts (including tags), publish/unpublish control. (Blog data likely stored alongside contact submissions in Vercel KV or similar).
5.  **Development Environment:** GitHub Codespace.
6.  **Testing:** Rigorous local testing (Responsiveness, Navigation, Contact Form Submission/Storage, Blog CRUD, Media, Tags, Search, Admin Auth/Functions, Security).
7.  **Deployment:** Vercel.
8.  **Timeline:** 5 hours for the entire lifecycle.

## Site Structure Diagram

```mermaid
graph TD
    A[Landing Page] --> B(External: GitHub);
    A --> C(External: Personal Project Site);
    A --> D(External: Twitter);
    A --> E{Personal Blog};
    A --> M{Contact Form};

    M -- Submit --> Q[Serverless Function];
    Q -- Store --> R[(Database / Vercel KV)];

    subgraph Blog Features
        direction LR
        E --> F[Blog Post Display];
        E --> N[Tag Filtering];
        E --> O[Keyword Search];
    end

    F --> G[Blog Post 1];
    F --> H[Blog Post 2];
    F --> P[...];


    I{Admin Login /admin} -- Google Auth --> J[Admin Dashboard];
    J --> K(Create/Edit/Delete Posts + Tags);
    J --> L(Publish/Unpublish Posts);
    K -- Store/Retrieve --> R;
    L -- Update --> R;
    F -- Retrieve --> R;


    subgraph Website
        A
        E
        M
        N
        O
        F
        G
        H
        P
    end

    subgraph Admin Area
        I
        J
        K
        L
    end

    subgraph Backend
        Q
        R
    end