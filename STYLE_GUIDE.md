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

---

## Background Effects

### UI Effect Specification: Ambient Fluid Orb Background

1.  **Effect Name:** Ambient Fluid Orb Background

2.  **Goal/Intent:** To create a subtle, dynamic, and visually engaging background layer that adds depth and ambient interest. This effect should remain secondary to the primary foreground content and the existing SVG node network design, enhancing the modern aesthetic without causing distraction.

3.  **Visual Description:**
    *   **Elements:** Features 1 to 3 large, amorphous, blob-like shapes (orbs).
    *   **Edges:** Orbs possess very soft, heavily blurred edges (like a significant Gaussian blur or smooth radial gradients fading to full transparency). No hard outlines.
    *   **Glow:** Each orb emits a soft, subtle internal glow. The glow intensity should be noticeable but not overpowering, creating a gentle luminosity rather than a harsh light source effect. The intensity should remain relatively constant throughout the animation, avoiding distracting pulsing or flashing. The glow is brightest at the orb's core and feathers out smoothly towards the blurred edges.
    *   **Shape & Form:** Organic, slightly irregular, potentially undulating subtly over time.
    *   **Opacity:** Low overall opacity (e.g., 15-30%) to remain behind foreground elements and the node network.

4.  **Animation Behavior:**
    *   **Movement:** Slow, continuous, fluid drifting across the viewport.
    *   **Path:** Non-linear, organic/pseudo-random, evoking a lava lamp feel. Avoid straight lines or repetitive patterns.
    *   **Speed:** Consistently slow and relaxed; individual orbs may vary slightly.
    *   **Interaction (Multiple Orbs):** Independent paths; orbs pass through each other (unless advanced merging/splitting is implemented).
    *   **Boundary Interaction:** Graceful animation in/out of view or smooth reflection off boundaries.

5.  **Layering & Positioning:**
    *   **Stacking Order:** Positioned absolutely behind all primary content and the SVG node network (lowest visual layer, e.g., `z-index: -10`).
    *   **Coverage:** Spans the entire background viewport area.

6.  **Color Palette & Transitions:**
    *   **Orb Base Colors:** Orbs should utilize soft, desaturated colors derived from or complementary to the application's primary theme (e.g., soft teals, blues, potentially purples like `#A5F3FC`, `#A7F3D0`, `#C7D2FE` used at low opacity). Each orb maintains its distinct base color throughout its lifecycle.
    *   **Color Transitions:** There are **no abrupt color changes** within an orb. Any internal color variation comes solely from the central glow effect.
    *   **Overlap Blending:** When orbs overlap, their semi-transparent colors should blend naturally based on standard alpha compositing (like layers of colored glass). The overlapping area will appear as a mix of the two orb colors, potentially becoming slightly more opaque or resulting in a new intermediate color depending on the specific base colors and opacities used. Avoid specific blend modes like "screen," "multiply," or "overlay" unless explicitly desired for a particular artistic effect; the default alpha blending is preferred for subtlety.
    *   **Glow Color:** The inner glow effect should be a slightly lighter tint or pure white (`#FFFFFF`) version of the orb's base color, also at low opacity, contributing to the overall orb color but brightest at the center.

7.  **Performance Considerations:**
    *   Must be highly performant. Utilize hardware acceleration (CSS `transform`, `opacity`). Avoid expensive animations.

8.  **Implementation Notes (for Developers):**
    *   Consider CSS animations with complex `@keyframes` for simpler path variations.
    *   JavaScript animation libraries (e.g., GSAP) can provide more control over complex, non-linear paths but require careful performance management.
    *   HTML Canvas 2D API offers flexibility for drawing blurred shapes and managing more complex pathfinding or interactions.
    *   WebGL shaders provide the highest potential for performance and visual fidelity (e.g., using noise functions like Perlin or Simplex for organic movement, implementing blur/glow effects efficiently) but come with increased implementation complexity.

9.  **Advanced Features (Optional):**
    *   Fluid merging/splitting of orbs for enhanced effect (likely requires Canvas/WebGL).