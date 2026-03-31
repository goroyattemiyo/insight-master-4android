# Design System Document: The Insight Editorial

## 1. Overview & Creative North Star: "The Digital Curator"
This design system moves beyond the utility of a standard analytics tool, transforming complex data into a curated, editorial experience. Our Creative North Star is **"The Digital Curator"**—a philosophy that treats every data point as a piece of high-end content. 

We break the "template" look by rejecting the rigid, boxed-in grids typical of SaaS platforms. Instead, we use **intentional asymmetry**, **luxurious white space**, and **tonal layering** to guide the user’s eye. The goal is to make SNS optimization feel less like "work" and more like "strategy," providing a professional yet approachable environment for mid-level social media managers.

## 2. Colors: Depth Through Tone
We leverage a sophisticated palette that prioritizes clarity and visual "breathing room."

### The "No-Line" Rule
**Strict Mandate:** 1px solid borders are prohibited for sectioning. Boundaries must be defined solely through background color shifts. Use `surface-container-low` sections against a `background` base to define areas. This creates a seamless, high-end feel that feels integrated, not fragmented.

### Surface Hierarchy & Nesting
Treat the UI as a series of physical layers—like stacked sheets of fine paper.
- **Base Level:** `background` (#f8f9fa)
- **Secondary Level:** `surface-container-low` (#f3f4f5) for large content areas.
- **Elevated Level:** `surface-container-lowest` (#ffffff) for primary interactive cards.
- **Highlight Level:** `surface-bright` for critical emphasis.

### The "Glass & Gradient" Rule
To elevate the experience above a generic Material 3 implementation:
- **Glassmorphism:** Use `surface-container-lowest` with a 70-80% opacity and a `20px` backdrop-blur for floating overlays or navigation bars.
- **Signature Textures:** For primary CTAs and hero headers, utilize a subtle linear gradient from `primary` (#00488d) to `primary-container` (#005fb8) at a 135-degree angle. This adds "soul" and a premium finish.

## 3. Typography: Editorial Authority
We use a dual-font approach to balance personality with precision.

- **Display & Headlines (Manrope):** Chosen for its modern, geometric character. The wide stance of Manrope adds an authoritative, "magazine header" feel to data summaries.
- **Body & Labels (Inter):** A high-legibility sans-serif that ensures data remains the hero. Inter provides a neutral, professional tone that handles dense information with ease.

**The Scale of Importance:**
- **Display-LG (3.5rem):** Use for "Big Numbers" (e.g., Total Follower Count).
- **Headline-MD (1.75rem):** Use for section titles.
- **Title-SM (1rem):** Use for card headers.
- **Body-MD (0.875rem):** The workhorse for all insight descriptions.

## 4. Elevation & Depth: Tonal Layering
Traditional shadows are too "heavy" for this system. We convey hierarchy through **Tonal Layering**.

- **The Layering Principle:** Instead of shadows, place a `surface-container-lowest` (#ffffff) card onto a `surface-container-low` (#f3f4f5) background. The subtle shift in hex value is enough to signify depth to the eye.
- **Ambient Shadows:** If a floating effect is required (e.g., for the central FAB), use a highly diffused shadow: `box-shadow: 0 12px 32px rgba(0, 72, 141, 0.08)`. This uses a tinted version of the `primary` color to mimic natural light.
- **The "Ghost Border" Fallback:** For accessibility in high-glare environments, use a "Ghost Border": `outline-variant` (#c2c6d4) at **15% opacity**. Never use a 100% opaque border.

## 5. Components: The Insight Primitives

### Cards (The Hero Component)
- **Styling:** Large corner radius (`xl`: 3rem for top-level cards, `lg`: 2rem for nested cards).
- **Layout:** Strictly no dividers. Use `Spacing 6` (2rem) or `Spacing 8` (2.75rem) to separate content sections within the card.

### The "Pulse" CTA (Central FAB)
- **Concept:** A massive, centrally-anchored Floating Action Button.
- **Style:** Uses the signature gradient (`primary` to `primary-container`).
- **Shape:** `full` (pill-shaped) or `xl` (rounded square).
- **Interaction:** On hover/press, increase the blur of the Ambient Shadow rather than changing the color brightness.

### Buttons
- **Primary:** High-contrast `primary` container, no border, `DEFAULT` (1rem) corner radius.
- **Secondary:** `surface-container-highest` background with `on-surface` text. No border.
- **Tertiary:** Text-only using `primary` color, strictly for low-priority actions.

### Progress & Data Indicators
- **Style:** Use thick stroke widths (8px+) with `full` rounded caps. 
- **Color:** Use `primary` for progress and `secondary-fixed` for the track background. This ensures the track "recedes" while the progress "pops."

### Input Fields
- **Style:** "Filled" style only, using `surface-container-high`. 
- **Focus State:** Instead of a thick border, use a 2px `primary` underline or a subtle glow effect.

## 6. Do's and Don'ts

### Do
- **DO** use the `16` (5.5rem) spacing token for top-level section margins to create an "Editorial" feel.
- **DO** overlap elements slightly (e.g., a card bleeding into a header gradient) to create visual interest.
- **DO** use `display-lg` typography for the most important "Insight of the Day."

### Don't
- **DON'T** use 1px dividers to separate list items. Use vertical padding (`Spacing 4`) and a background shift on hover.
- **DON'T** use pure black (#000000) for text. Always use `on-surface` (#191c1d) to maintain the soft, premium aesthetic.
- **DON'T** crowd the screen. If you have more than 5 cards, move the secondary ones to a horizontal scroll (Carousel) to preserve white space.

---
*Note to Junior Designers: This system is about what you leave out as much as what you put in. Respect the white space—it is not "empty," it is "luxury."*