# Raindrop.io Integration Guide

This site integrates with [Raindrop.io](https://raindrop.io) at build time to pull curated bookmarks, personal notes, tags, and saved text highlights from specific whitelisted collections into `src/data/raindrop.json`, which can then be rendered in `.mdx` posts and pages using `<RaindropBookmarks />`.

---

## 1. Setup & Authentication

1. Open [Raindrop.io Integrations Settings](https://app.raindrop.io/settings/integrations).
2. Under **For Developers**, click **+ Create new app** (e.g., `hellostu.xyz`).
3. Open your newly created app and click **Create test token**, then copy the token.
4. Add it to your local `.env` file:
   ```env
   RAINDROP_TOKEN="your-test-token-here"
   ```
5. Add `RAINDROP_TOKEN` to your GitHub repository's **Settings > Secrets and variables > Actions** so GitHub Actions can sync bookmarks during deployment.

---

## 2. Configuring Whitelisted Collections

To keep your general bookmarks private, only folders explicitly listed in [`src/scripts/raindrop.config.mjs`](../src/scripts/raindrop.config.mjs) are synced.

To inspect all collections in your Raindrop account (along with their paths, numeric IDs, and item counts), run:

```bash
npm run raindrop:collections
```

Then add the collection names, nested paths (e.g. `"Work / Learning Design"`), or numeric IDs to `collections` in `src/scripts/raindrop.config.mjs`. By default, `includeSubcollections: true` ensures any child folders inside a whitelisted parent folder are synced automatically.

---

## 3. Syncing & Searching Bookmarks Locally

- **Sync bookmarks from Raindrop API to `src/data/raindrop.json`:**
  ```bash
  npm run sync:raindrop
  ```
- **List all synced bookmarks (with their URLs, IDs, collections, tags, and highlights):**
  ```bash
  npm run raindrop:list
  ```
- **Search synced bookmarks by keyword, tag, or domain:**
  ```bash
  npm run raindrop:list -- agile
  ```

---

## 4. Using `<RaindropBookmarks />` in MDX Posts & Pages

Import the component inside any `.mdx` post or page:

```mdx
import RaindropBookmarks from '../../components/for_posts/RaindropBookmarks/RaindropBookmarks.astro';
```

### Filter by Collection (Folder)
```mdx
<RaindropBookmarks
  collection="Agile & Systems"
  title="Further Reading & Sources"
/>
```

### Filter by Tag(s)
```mdx
<RaindropBookmarks
  tag="learning-design"
  limit={5}
  title="Learning Design Rabbit Holes"
/>
```

### Pick Specific Bookmarks by URL (or ID)
You don't need to look up numeric IDs—you can pass the article URL(s) directly:
```mdx
<RaindropBookmarks
  urls={[
    "https://www.gov.uk/service-manual/agile-delivery",
    "https://wenger-trayner.com/introduction-to-communities-of-practice/"
  ]}
  showHighlights="expanded"
/>
```
*(If you prefer numeric IDs from `npm run raindrop:list`, you can also use `id={900001}` or `ids={[900001, 900003]}`.)*

### Component Props Reference

| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `collection` | `string \| number \| Array` | — | Filter by collection name, nested path, slug, or numeric ID. |
| `tag` / `tags` | `string \| string[]` | — | Filter by one or more tags (normalized to lowercase kebab-case). |
| `matchAllTags` | `boolean` | `false` | When `true`, requires items to have *all* specified tags instead of *any*. |
| `url` / `urls` | `string \| string[]` | — | Match specific bookmark(s) by URL (preserves array order). |
| `id` / `ids` | `number \| string \| Array` | — | Match specific bookmark(s) by Raindrop numeric ID (preserves array order). |
| `search` | `string` | — | Filter bookmarks matching a search string across title, note, excerpt, and highlights. |
| `favoritesOnly` | `boolean` | `false` | When `true`, only shows bookmarks marked ❤️ (`important`) in Raindrop. |
| `before` | `string \| Date` | — | Only include bookmarks created on or before this date (e.g. `"2026-10-17"`). Great for archiving `/now` entries. |
| `after` | `string \| Date` | — | Only include bookmarks created on or after this date (e.g. `"2026-09-01"`). |
| `limit` | `number` | — | Maximum number of bookmarks to display. |
| `sort` | `'newest' \| 'oldest' \| 'title'` | `'newest'` | Sort order (unless `urls` or `ids` array order is being preserved). |
| `title` | `string` | — | Optional heading displayed at the top of the widget. |
| `subtitle` | `string` | — | Optional subtitle displayed beside/below the heading. |
| `showNotes` | `boolean` | `true` | Render your personal Raindrop notes (supports Markdown). |
| `showExcerpt` | `'fallback' \| boolean` | `'fallback'` | Shows page excerpt when no personal note exists (`'fallback'`), always (`true`), or never (`false`). |
| `showHighlights` | `'collapsed' \| 'expanded' \| 'none' \| boolean` | `'collapsed'` | Controls how saved text highlights are shown (`'collapsed'` renders a collapsible `<details>` toggle, `'expanded'` opens them by default). |
| `showTags` | `boolean` | `true` | Show lowercase kebab-case tag pills on each card. |
| `showCollection` | `boolean` | `false` | Show the folder badge next to the domain name. |
| `showCover` | `boolean` | `false` (`true` for `'masonry'`) | Show the bookmark's cover/thumbnail image when available. |
| `variant` | `'cards' \| 'compact' \| 'masonry'` | `'cards'` | Layout style (`'compact'` for tight link lists, `'masonry'` for multi-column poster/visual grids like `/movies`). |
