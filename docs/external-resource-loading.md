# External Resource Loading & Chart Loader Strategy

## CDN Usage

- All third-party libraries (e.g., ApexCharts, Leaflet) are loaded via CDN using `<script src="..."></script>` tags.
- This ensures no npm dependencies are bundled for these libraries, reducing build complexity and avoiding hydration issues.

## Loader Scripts in `public/`

- Custom loader scripts (e.g., `apexchart-loader.js`, `choropleth-map-loader.js`) are placed in the `public/scripts/` directory.
- These scripts are referenced with `<script src="/scripts/your-loader.js"></script>` so they are served statically and not bundled by Astro.

## ApexCharts Loader & Hydration Note

- The `apexchart-loader.js` script is included in the main `<Head>` component so it is only loaded once per page.
- This prevents multiple executions and duplicate chart hydration, which can occur if the loader is included in every chart component instance.
- ApexCharts itself is loaded only on pages that need it (e.g., via MDX `<Head>` block or per-page `<script>` tag), minimizing bandwidth usage.

## Summary

- **Loader scripts:** Always in `public/scripts/`, referenced statically.
- **CDN libraries:** Only loaded where needed, not globally.
- **No hydration bugs:** Loader script is only loaded once per page, preventing duplicate charts.

---

_This approach ensures reliable, efficient, and bug-free loading of external resources and custom loaders for all visualizations._
