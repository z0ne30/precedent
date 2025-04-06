# Style Guide: Light Theme

## Core Principles

*   **Base:** Utilize white (`#FFFFFF`) and very light grays (e.g., `#F9FAFB` - Gray 50, `#F3F4F6` - Gray 100) extensively for backgrounds.
*   **Text:** Employ dark grays/near-blacks for primary content (`#111827` - Gray 900, `#374151` - Gray 700) for maximum readability. Use medium grays (`#6B7280` - Gray 500) for secondary information.
*   **Accent:** Use Teal as the primary accent color (`#14B8A6` - Teal 500, `#0D9488` - Teal 600, `#0F766E` - Teal 700) sparingly for key actions, links, and highlights.
*   **Contrast:** Ensure text meets WCAG AA contrast ratio (4.5:1 minimum) against its background.

---

## Color Palettes (Hex Codes)

### 1. Blog Post Display Components

*   **Page Background:** `#FFFFFF` (White) / `#F9FAFB` (Gray 50)
*   **Post Title (`h1`, `h2`):** `#111827` (Gray 900)
*   **Meta-data (Date, Tags Text):** `#6B7280` (Gray 500)
*   **Body Text (`p`):** `#374151` (Gray 700)
*   **Links (`a`):** `#0D9488` (Teal 600)
    *   *Hover/Focus:* `#0F766E` (Teal 700)
*   **Blockquotes (`blockquote`):**
    *   *Background:* `#F3F4F6` (Gray 100)
    *   *Border (Left):* `#5EEAD4` (Teal 300)
    *   *Text:* `#374151` (Gray 700)
*   **Code Blocks (`pre`, `code`):**
    *   *Background:* `#1F2937` (Gray 800)
    *   *Text:* `#F3F4F6` (Gray 100)
*   **Tags/Categories (Badges):**
    *   *Background:* `#CCFBF1` (Teal 100)
    *   *Text:* `#134E4A` (Teal 900)

### 2. Admin Portal Interface Components

*   **Page Background:** `#F9FAFB` (Gray 50)
*   **Side Navigation:**
    *   *Background:* `#FFFFFF` (White) / `#F3F4F6` (Gray 100)
    *   *Item Text (Inactive):* `#6B7280` (Gray 500)
    *   *Item Text (Active):* `#0F766E` (Teal 700)
    *   *Item Background (Hover):* `#F9FAFB` (Gray 50)
    *   *Item Background (Active):* `#CCFBF1` (Teal 100)
    *   *Icons:* `#6B7280` (Gray 500), Active: `#0F766E` (Teal 700)
*   **Main Content Area Background:** `#FFFFFF` (White)
*   **Data Tables:**
    *   *Header Background:* `#F9FAFB` (Gray 50)
    *   *Header Text:* `#374151` (Gray 700)
    *   *Row Background (Odd):* `#FFFFFF` (White)
    *   *Row Background (Even/Hover):* `#F9FAFB` (Gray 50)
    *   *Cell Text:* `#374151` (Gray 700)
    *   *Borders:* `#E5E7EB` (Gray 200)
*   **Action Buttons (Primary):**
    *   *Background:* `#14B8A6` (Teal 500)
    *   *Text:* `#FFFFFF` (White)
    *   *Hover Background:* `#0D9488` (Teal 600)
    *   *Focus Ring:* `#5EEAD4` (Teal 300)
*   **Action Buttons (Secondary):**
    *   *Background:* `#FFFFFF` (White)
    *   *Text:* `#374151` (Gray 700)
    *   *Border:* `#D1D5DB` (Gray 300)
    *   *Hover Background:* `#F9FAFB` (Gray 50)
    *   *Focus Ring:* `#A5F3FC` (Cyan 200 / Light Teal)
*   **Action Buttons (Destructive):**
    *   *Background:* `#F87171` (Red 400)
    *   *Text:* `#FFFFFF` (White)
    *   *Hover Background:* `#EF4444` (Red 500)
    *   *Focus Ring:* `#FCA5A5` (Red 300)
*   **Status Indicators (Pills/Badges):**
    *   *Published (Green):* Bg `#ECFDF5` (Green 50), Text `#065F46` (Green 800)
    *   *Draft (Gray):* Bg `#F3F4F6` (Gray 100), Text `#4B5563` (Gray 600)
    *   *Error (Red):* Bg `#FEF2F2` (Red 50), Text `#991B1B` (Red 800)
*   **Input Fields:**
    *   *Background:* `#FFFFFF` (White)
    *   *Border:* `#D1D5DB` (Gray 300)
    *   *Text:* `#111827` (Gray 900)
    *   *Focus Border:* `#14B8A6` (Teal 500)
    *   *Focus Ring:* `#5EEAD4` (Teal 300) (Optional)

---

## UI Design Patterns & Principles

1.  **Generous Whitespace & Controlled Density:** Increase padding/margins; avoid clutter.
2.  **Minimalist Forms & Inputs:** Simple fields, clear labels, clear focus states, consistent button styles.
3.  **Subtle Microinteractions & Animations:** Use Framer Motion for non-jarring hover, focus, loading, and click feedback.
4.  **Consistent & Purposeful Iconography:** Use a single clean set (e.g., Lucide Icons) consistently and meaningfully.
5.  **Clear Visual Hierarchy through Typography:** Establish and adhere to a clear typographic scale (size, weight).