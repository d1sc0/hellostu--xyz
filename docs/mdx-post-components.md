# MDX Post Component Structure & Conventions

This project uses Astro's MDX support to enable rich, interactive posts with reusable components. Here are the conventions and structure guidelines for using components in MDX posts:

## Component Organization

- **All post-specific components** (maps, charts, etc.) are located in `src/components/for_posts/`.
- **Each visualization type** (e.g., Choropleth, VisitorMap, ApexCharts) has its own subfolder:
  - `src/components/for_posts/Choropleth/ChoroplethMap.astro`
  - `src/components/for_posts/Choropleth/choropleth-map-loader.js`
  - `src/components/for_posts/VisitorMap/VisitorMap.astro`
  - `src/components/for_posts/VisitorMap/visitor-map-loader.js`
  - `src/components/for_posts/ApexCharts/ApexChart.astro`
  - `src/components/for_posts/ApexCharts/apexchart-loader.js`
- **Loader scripts** for browser-side rendering are always in the same subfolder as their component.
- **Data/config files** for maps/charts are in `src/data/` (e.g., `fire-map-config.js`, `tgf-visitors-map-data.js`).

## Importing Components in MDX

- Always import components using their subfolder path. Example:
  ```js
  import ApexChart from '/src/components/for_posts/ApexCharts/ApexChart.astro';
  import ChoroplethMap from '/src/components/for_posts/Choropleth/ChoroplethMap.astro';
  ```
- Import any required config/data from `src/data/`.

## Usage Example

```mdx
import ApexChart from '/src/components/for_posts/ApexCharts/ApexChart.astro';
import {
  bloggingChartOptions,
  bloggingChartSeries,
} from '/src/data/apex-chart-data.js';

<ApexChart
  id="blogging-chart"
  type="pie"
  options={bloggingChartOptions}
  series={bloggingChartSeries}
  chartClass="pieFull"
/>
```

## Conventions

- **Component files** must be in their type-named subfolder (e.g., `ApexCharts/`, `Choropleth/`).
- **Loader scripts** must be colocated with their component.
- **All imports in MDX** must use the correct subfolder path.
- **Data/config** is always imported from `src/data/`.
- **Mobile-first CSS**: All component styles are mobile-first, with a single desktop media query at the end of the file.
- **Leaflet-injected elements** (for maps) use `:global` in `<style>` blocks for proper scoping.

## Why This Structure?

- Keeps components modular and maintainable.
- Makes it easy to update or swap out visualizations.
- Ensures all MDX posts use the latest, refactored components.
- Keeps loader scripts and styles close to their components.
- Centralizes data/config for easier editing and reuse.

---

For more, see the README and styling-naming-conventions docs.
