# UI Pillars: Vibetest Digital Garden

## 1. Core User Feeling & Experience

The primary goal of the UI/UX is to evoke a feeling of **focused calm and effortless exploration**. Visitors should feel immersed in the content, intrigued by the subtle technological aesthetic, and guided intuitively without intrusive interface elements. The experience should feel modern, clean, and uniquely personal, reflecting a thoughtful approach to both design and technology.

## 2. Guiding Principles

*   **Content-First:** Maximize focus on the primary content (blog posts, project details, personal notes). Interface elements should recede or appear only when contextually relevant.
*   **Minimalist Aesthetic:** Embrace simplicity and avoid unnecessary visual clutter. Every element present should serve a clear purpose.
*   **Generous Negative Space:** Utilize whitespace actively as a design element to create breathing room, improve focus, and enhance the clean, modern feel.
*   **Subtle Dynamism:** Incorporate smooth, non-jarring animations and microinteractions to provide feedback, guide attention, and add a layer of sophisticated polish without being distracting. The dynamic background (Vanta) should complement, not overwhelm.
*   **Intuitive Interaction:** While moving away from standard UI patterns (like persistent headers), interactions (like scroll-aware triggers) must feel natural and easily discoverable.
*   **Consistency:** Apply design principles, typography, spacing, and interaction patterns uniformly across the site for a cohesive experience.

## 3. Typography

*   **Font System:**
    *   **Body/UI:** Inter (clean, legible, modern sans-serif).
    *   **Display/Titles:** Orbitron (used sparingly for impact on major titles).
    *   *(Consider phasing out SF Pro for simplicity).*
*   **Hierarchy:** Establish clear visual hierarchy using a defined type scale (size, weight). Use `text-base` or `text-lg` for body text.
*   **Readability:** Prioritize readability for long-form content through appropriate font choices and spacing.

## 4. Spacing

*   **Leading (Line Height):** Generous line height for body text (`1.7` - `1.8` or `leading-relaxed`/`leading-loose`).
*   **Margins:** Consistent vertical spacing between paragraphs (`my-4` or `my-6`). More space above headings than below.
*   **Padding:** Sufficient internal padding within content containers.
*   **Line Length:** Maintain optimal line length (50-75 characters) for body text via container `max-width`.

## 5. Interaction & UI Elements

*   **Scroll-Awareness:** Key UI elements (navigation, footer) should appear contextually based on scroll position (e.g., scroll-up for header, scroll-to-bottom for footer) rather than being persistently visible.
*   **Animation:** Use smooth fade/translate animations with gentle easing (`easeOut`) for appearing/disappearing elements. Consider subtle parallax for the background.
*   **Minimal Elements:** Appearing UI (header/footer) should be clean, minimal, and use established typography/colors. Avoid heavy bars or complex components.
*   **Responsiveness:** Adapt interaction patterns for mobile (e.g., replace scroll-up header with a fixed menu icon triggering an overlay). Disable performance-intensive animations like parallax on mobile.

## 6. Color & Visuals

*   **Palette:** Adhere to the existing palette (white background, teal accents, grays). Use color purposefully for interaction states (hovers, active links) and accents.
*   **Contrast:** Ensure all text meets WCAG AA contrast requirements against its background.
*   **Background:** The Vanta background provides the primary visual dynamism. UI elements appearing over it should use subtle effects like semi-transparency and `backdrop-blur` for legibility and depth.

## 7. Accessibility

*   Incorporate WCAG guidelines throughout: semantic HTML, sufficient color contrast, keyboard navigability, clear focus states, ARIA attributes where necessary.