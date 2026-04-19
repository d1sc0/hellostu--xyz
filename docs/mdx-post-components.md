# MDX Post Component Structure & Conventions (2026)

This project uses Astro's MDX support to enable rich, interactive posts with reusable components. These are the latest conventions and structure guidelines for using components in MDX posts:

## Component & Loader Organization

- **All post-specific components** (maps, charts, etc.) are located in `src/components/for_posts/`.
- **Each visualization type** (e.g., Choropleth, VisitorMap, ApexCharts) has its own subfolder:
  - `src/components/for_posts/Choropleth/ChoroplethMap.astro`
  - `src/components/for_posts/VisitorMap/VisitorMap.astro`
  - `src/components/for_posts/ApexCharts/ApexChart.astro`
- **Loader scripts** for browser-side rendering are placed in `public/scripts/` (e.g., `public/scripts/apexchart-loader.js`).
- **Loader scripts are NOT imported in MDX or components.** They are loaded globally (e.g., in the main Head component) or per-page as needed.
- **Data/config files** for maps/charts are in `src/data/` (e.g., `fire-map-config.js`, `apex-chart-data.js`).

## Importing Components in MDX

- Always import components using their subfolder path. Example:
  ```js
  import ApexChart from '../../components/for_posts/ApexCharts/ApexChart.astro';
  import ChoroplethMap from '../../components/for_posts/Choropleth/ChoroplethMap.astro';
  ```
- Import any required config/data from `src/data/`.

## Usage Example

```mdx
import ApexChart from '../../components/for_posts/ApexCharts/ApexChart.astro';
import {
  bloggingChartOptions,
  bloggingChartSeries,
} from '../../data/apex-chart-data.js';

<ApexChart
  id="blogging-chart"
  chartConfig={{ ...bloggingChartOptions, series: bloggingChartSeries }}
  chartAlign="pieFull"
/>
```

**Note:**

- The `ApexChart` component expects a single `chartConfig` prop (object with options and series), not separate `options` and `series` props.

## Conventions

- **Component files** must be in their type-named subfolder (e.g., `ApexCharts/`, `Choropleth/`).
- **Loader scripts** are placed in `public/scripts/` and referenced globally or per-page, never imported in MDX/components.
- **All imports in MDX** must use the correct subfolder path.
- **Data/config** is always imported from `src/data/`.
- **Mobile-first CSS**: All component styles are mobile-first, with a single desktop media query at the end of the file.
- **Leaflet-injected elements** (for maps) use `:global` in `<style>` blocks for proper scoping.

## Loader Script & CDN Library Loading

- **Loader scripts** (e.g., `apexchart-loader.js`) are included in the main `<Head>` component so they are only loaded once per page. This prevents multiple executions and duplicate chart hydration.
- **ApexCharts CDN** is only loaded on pages that need it (e.g., via MDX `<Head>` block or per-page `<script>` tag), minimizing bandwidth usage.

## Why This Structure?

- Keeps components modular and maintainable.
- Makes it easy to update or swap out visualizations.
- Ensures all MDX posts use the latest, refactored components.
- Keeps loader scripts and styles close to their components (except for public/scripts/ for loaders).
- Centralizes data/config for easier editing and reuse.

---

For more, see the README, styling-naming-conventions, and external-resource-loading docs.
