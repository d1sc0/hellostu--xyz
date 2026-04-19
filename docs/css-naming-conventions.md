# Styling & Naming Conventions

This project uses a modern, modular approach to CSS and component naming to ensure maintainability, scalability, and clarity. Below are the key styling choices and conventions used throughout the codebase.

## CSS Methodology

- **Modular CSS:**
  - Each major component or layout has its own CSS file in `src/styles/`.
  - Styles are imported only where needed, reducing global scope pollution.
- **BEM Naming:**
  - Classes follow the [BEM (Block\_\_Element--Modifier)](http://getbem.com/) convention for clarity and predictability.
  - Example: `.post-list__card--featured`.
- **Variables & Custom Properties:**
  - CSS custom properties (variables) are used for colors, spacing, and font sizes for easy theming and updates.
- **Neutral Palette:**
  - The color scheme is intentionally neutral and soft, supporting white-labeling and easy customization.
- **Font:**
  - The Inter font is used everywhere for a clean, modern look. All legacy font references (Jersey, Manrope) have been removed.

## File & Folder Structure

- **Component Styles:**
  - `src/styles/[component].css` for each major component (e.g., `post-list.css`, `footer.css`).
- **Layout Styles:**
  - `src/styles/[layout].css` for page or layout-level styles (e.g., `md-page-layout.css`).
- **Global Styles:**
  - `src/styles/global.css` for resets, base typography, and variables.

## Class Naming Examples

- `.post-list` — Block for the post grid
- `.post-list__card` — Card element within the grid
- `.post-list__card--featured` — Modifier for a featured card
- `.footer__links` — Links section in the footer

## Best Practices

- **No global class overrides**; always scope styles to components or layouts.
- **Use variables** for all colors, spacing, and font sizes.
- **Keep selectors flat** (avoid deep nesting).
- **Prefer utility classes** for spacing/margin when possible.

## Media Query & Responsive CSS Guidelines

- All CSS should be mobile-first: default styles are for mobile.
- For desktop and landscape layouts, always use:
  ```css
  @media (min-width: 768px) and (orientation: landscape) { ... }
  ```
- Place all media queries at the end of the CSS file.
- Do not use other media queries (e.g., max-width, portrait-only, or scattered queries).
- This ensures consistency and makes responsive overrides easy to find and maintain.

---

For more details, see the individual CSS files in `src/styles/` and component usage in `src/components/`.
