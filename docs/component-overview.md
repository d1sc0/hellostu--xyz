# Component Overview

This document gives a quick reference for all components in `src/components/` and `src/components/for_posts/`.

## Component Index

- `src/components/Breadcrumbs.astro`
- `src/components/CategoryCards.astro`
- `src/components/Footer.astro`
- `src/components/Head.astro`
- `src/components/LatestPosts.astro`
- `src/components/Navigation.astro`
- `src/components/MdxImageGallery.astro`
- `src/components/PostImageScroller.astro`
- `src/components/PostsLists.astro`
- `src/components/SocialLinks.astro`
- `src/components/TagList.astro`
- `src/components/for_posts/ApexCharts/ApexChart.astro`
- `src/components/for_posts/Choropleth/ChoroplethMap.astro`
- `src/components/for_posts/VisitorMap/VisitorMap.astro`

---

## `Breadcrumbs.astro`

### Purpose

Builds path-based breadcrumbs (Home > section > page) using `Astro.url.pathname`.

### Core logic

- Normalizes the URL path.
- Splits path into segments.
- Applies friendly labels for known segments (`tags`, `posts`).
- Uses `frontmatter.title` for the final crumb where appropriate.

### Props

- `frontmatter?`
  - `title?` (string)

### Example

```astro
<Breadcrumbs frontmatter={frontmatter} />
```

### Verified from source

- Path: `src/components/Breadcrumbs.astro`
- Last verified: 2026-04-20

---

## `CategoryCards.astro`

### Purpose

Renders home-page cards for Work, Rest, and Play.

### Core logic

- Fetches page entries (`work`, `rest`, `play`) from the pages collection for descriptions.
- Counts post totals by category from the posts collection.
- Uses local page image assets for each card.

### Internal card fields (computed in-component)

- `label`
- `slug`
- `description`
- `href`
- `count`
- `color`
- `restColor`

### Props

- No external Astro props currently.
- This component is data-driven internally (via content collections and local assets), not configured via `Astro.props`.

### Example

```astro
<CategoryCards />
```

### Verified from source

- Path: `src/components/CategoryCards.astro`
- Last verified: 2026-04-20

---

## `Footer.astro`

### Purpose

Renders footer navigation and license text.

### Core logic

- Reads links from `src/content/footer-nav.json`.
- Skips links where labels begin with `#`.

### Props

- No external Astro props currently.

### Example

```astro
<Footer />
```

### Verified from source

- Path: `src/components/Footer.astro`
- Last verified: 2026-04-20

---

## `Head.astro`

### Purpose

Builds SEO/meta head output, JSON-LD, canonical URL, social tags, fonts, and OG image fallback behavior.

### Core logic

- Resolves page title/description from `frontmatter` or `pageMeta`.
- Checks whether a generated OG image exists in `public/generated_social_images`.
- Falls back to `default_social.png` when no generated image exists.
- Injects schema JSON-LD and SEO metadata.
- Loads Lexend + Gochi Hand via `astro-font`.
- Loads `/scripts/apexchart-loader.js` globally.

### Props

- `frontmatter?` (object)
- `pageMeta?` (object)

### Example

```astro
<Head frontmatter={frontmatter} pageMeta={pageMeta} />
```

### Verified from source

- Path: `src/components/Head.astro`
- Last verified: 2026-04-20

---

## `LatestPosts.astro`

### Purpose

Shows a table of the most recent posts.

### Core logic

- Gets posts collection.
- Excludes drafts in production.
- Sorts by `pubDate` descending.
- Slices to `count`.

### Props

- `count?` (number, default `3`)

### Example

```astro
<LatestPosts count={4} />
```

### Verified from source

- Path: `src/components/LatestPosts.astro`
- Last verified: 2026-04-20

---

## `Navigation.astro`

### Purpose

Main site header/nav including burger menu and icon links.

### Core logic

- Reads nav items from `src/content/main-nav.json`.
- Splits links into text links and icon links.
- Uses `astro-icon` icons.
- Applies `id="darkmode-toggle"` for the moon icon link.

### Props

- No external Astro props currently.

### Example

```astro
<Navigation />
```

### Verified from source

- Path: `src/components/Navigation.astro`
- Last verified: 2026-04-20

---

## `PostImageScroller.astro`

### Purpose

Horizontally scrollable image strip sourced from images found in post bodies.

### Core logic

- Loads all uploaded images via `import.meta.glob` from `src/assets/uploaded_images`.
- Parses markdown image syntax and `<img>` tags from each post body.
- Resolves image references to local image modules.
- Sorts posts newest first.
- Supports optional category filtering.
- Provides mobile/desktop scroll buttons and keyboard arrow support.
- Uses scroll state attributes for fade-edge affordances.
- Uses Astro `Image` with explicit responsive `widths` and `sizes`.

### Props

- `heading?` (string, default `Post Images`)
- `category?` (`Work` | `Rest` | `Play`)
- `categories?` (array of `Work` | `Rest` | `Play`)

### Example

```astro
<PostImageScroller />
<PostImageScroller category="Work" />
<PostImageScroller categories={["Work", "Play"]} />
<PostImageScroller heading="Photo stream" categories={["Work", "Play"]} />
```

### Verified from source

- Path: `src/components/PostImageScroller.astro`
- Last verified: 2026-04-20

---

## `MdxImageGallery.astro`

### Purpose

Provides an MDX-embeddable image gallery sourced from a YAML manifest at build time.

### Core logic

- Reads gallery data from `src/content/galleries.yaml` at build time.
- Selects a gallery by `id` passed via props.
- Resolves image references to local uploaded assets, including CMS-written paths such as `/src/assets/uploaded_images/...` and older relative refs.
- Uses Astro `Image` optimization with responsive `widths` and `sizes`.
- Implements horizontal swipe/scroll, arrow buttons, keyboard arrow support, and fade-edge affordances.
- Can optionally render image captions.
- Supports either inline image cards or linked full-image output.

### Props

- `gallery` (string, required)
- `heading?` (string)
- `showHeading?` (boolean, default `true`)
- `showCaptions?` (boolean, default `false`)
- `linkMode?` (`none` | `full-image`, default `none`)
- `imageHeight?` (string, default `10rem`)
- `imageHeightMobile?` (string)
- `imageHeightDesktop?` (string)

### Example

```astro
<MdxImageGallery gallery="clean-and-rebuild" />
<MdxImageGallery gallery="clean-and-rebuild" heading="Project gallery" showCaptions={true} />
<MdxImageGallery gallery="clean-and-rebuild" linkMode="full-image" imageHeightMobile="8rem" imageHeightDesktop="12rem" />
```

### Verified from source

- Path: `src/components/MdxImageGallery.astro`
- Last verified: 2026-04-20

---

## `PostsLists.astro`

### Purpose

Renders posts grouped by year, optionally filtered by category.

### Core logic

- Fetches posts, excludes drafts in production.
- Optional `category` filtering.
- Groups posts by year and sorts years descending.
- Within each year, sorts posts newest first.
- Renders date, title, and tags.

### Props

- `category?` (string)

### Example

```astro
<PostsLists />
<PostsLists category="Work" />
```

### Verified from source

- Path: `src/components/PostsLists.astro`
- Last verified: 2026-04-20

---

## `SocialLinks.astro`

### Purpose

Renders social icon links from CMS JSON with configurable sizing/spacing/filtering and optional wrapper.

### Core logic

- Reads links from `src/content/social-links.json`.
- Optional icon-name filtering via `icons` prop.
- Supports wrapped and inline rendering modes.
- Uses CSS custom properties for icon size/gap/edge spacing.

### Props

- `iconSize?` (string, default `1.1rem`)
- `spacing?` (string, default `0.5rem`)
- `edgeSpacing?` (`none` | `before` | `after` | `both`, default `none`)
- `edgeSpacingAmount?` (string, default mirrors `spacing`)
- `icons?` (string array, default `[]`)
- `wrapped?` (boolean, default `false`)

### Example

```astro
<SocialLinks />
<SocialLinks iconSize="1.15rem" spacing="0.6rem" icons={["linkedin", "instagram", "github"]} />
<SocialLinks wrapped={true} edgeSpacing="both" edgeSpacingAmount="0.75rem" />
```

### Verified from source

- Path: `src/components/SocialLinks.astro`
- Last verified: 2026-04-20

---

## `TagList.astro`

### Purpose

Renders a full list of tags with usage counts.

### Core logic

- Reads posts collection.
- Builds a case-insensitive tag map with counts.
- Tracks latest post date per tag.
- Supports client-side filter input.
- Supports client-side sorting by A-Z or count, with ascending/descending toggles.
- Renders links to each tag route.
- Shows an inline no-results message when a filter matches zero tags.

### Props

- No external Astro props currently.

### Example

```astro
<TagList />
```

### Verified from source

- Path: `src/components/TagList.astro`
- Last verified: 2026-04-20

---

## `for_posts/ApexCharts/ApexChart.astro`

### Purpose

Embeds an ApexCharts container in MDX posts.

### Core logic

- Outputs container with `id` and JSON config in `data-config`.
- Loads ApexCharts via CDN script.
- Loader behavior is handled separately by `/scripts/apexchart-loader.js`.

### Props

- `id?` (string, default `apexchart`)
- `chartAlign?` (string, default `''`)
- `chartConfig` (object, required)

### Example

```astro
<ApexChart id="chart-1" chartAlign="pieFull" chartConfig={config} />
```

### Verified from source

- Path: `src/components/for_posts/ApexCharts/ApexChart.astro`
- Last verified: 2026-04-20

---

## `for_posts/Choropleth/ChoroplethMap.astro`

### Purpose

Embeds a Leaflet choropleth map in posts.

### Core logic

- Outputs map container with `id` and JSON config in `data-config`.
- Loads Leaflet CSS/JS via CDN.
- Loads `/scripts/choropleth-map-loader.js` to initialize map behavior.

### Props

- `id?` (string, default `map`)
- `mapAlign?` (string, default `''`)
- `mapConfig` (object, required)

### Example

```astro
<ChoroplethMap id="climate-map" mapAlign="mapFull" mapConfig={mapConfig} />
```

### Verified from source

- Path: `src/components/for_posts/Choropleth/ChoroplethMap.astro`
- Last verified: 2026-04-20

---

## `for_posts/VisitorMap/VisitorMap.astro`

### Purpose

Embeds a Leaflet visitors map with territory shortcut buttons.

### Core logic

- Outputs map container with config payload.
- Includes territory navigation buttons (UK, Ireland, USA, etc.).
- Loads Leaflet CSS/JS via CDN.
- Loads `/scripts/visitor-map-loader.js` as module script.

### Props

- `id?` (string, default `TGFmap`)
- `mapAlign?` (string, default `''`)
- `mapConfig` (object, required)

### Example

```astro
<VisitorMap id="tgf-visitors" mapAlign="mapFull" mapConfig={visitorMapConfig} />
```

### Verified from source

- Path: `src/components/for_posts/VisitorMap/VisitorMap.astro`
- Last verified: 2026-04-20

---

## Notes

- Most components source data from Astro content collections (`posts`, `pages`) or JSON content files in `src/content/`.
- Draft filtering commonly uses this rule: include all in dev, exclude `draft: true` in production.
- The post visualization components in `for_posts/` rely on corresponding loader scripts in `public/scripts/`.
