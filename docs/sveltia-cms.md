---

## Styling & Naming Conventions

For details on how styles and class names are structured in this project, see [css-naming-conventions.md](css-naming-conventions.md).

# CMS & Content Editing

This project uses Sveltia CMS (Netlify CMS compatible) for content editing.

- CMS config: `public/admin/config.yaml`
- Media folder: `src/assets/images`
- Main content folder: `src/content/posts`
- Additional editable content:
    - `src/content/pages`
    - `src/content/main-nav.json`
    - `src/content/footer-nav.json`
    - `src/content/social-links.json`
    - `src/content/galleries.yaml`
- Post fields: title, slug, draft, pubDate, category, featureImage, body, description, tags
- Sortable by: title, pubDate
- Default sort: pubDate descending

Notes:

- There is no manual `lastUpdated` frontmatter field for posts.
- Last-updated timestamps are derived automatically from Git history (with filesystem modified-time fallback).
- RSS feed output is generated from `src/pages/rss.xml.js` and includes a `Post last updated:` line per item.

To access the CMS, open `/admin/` in your deployed site.

## Prebuild Automation for Sveltia CMS

Image path corrections and Markdown file renaming are now handled automatically by the prebuild script:

    src/scripts/pre-build-sveltia-cms-catches.js

This script:

- Fixes image paths in Markdown files (uploaded via Sveltia CMS) to ensure static build compatibility
- Renames Markdown files to match their `slug` frontmatter (if present)

Image alignment is controlled via URL hash/query in Markdown (`#left`, `#right`, `#full` or `?align=left`) via the remark image alignment plugin without modifying filenames on disk.

## Optional Feature Image Frontmatter

An optional `featureImage` field is available in:

- Posts (`.md`)
- MDX Posts (`.mdx`)
- Pages (`.mdx`)

Use it when you want an explicit image override instead of relying on the first markdown image in the body.

Recommended value format:

- `/src/assets/images/your-image.jpg`

This field is used by:

- Home page image stream (`PostImageScroller`)
- OG social image generator
- Preview image generator

Selection precedence:

1. `featureImage`
2. first markdown image in body
3. configured fallback background

## Gallery Manifest (In-Post Galleries)

The gallery component reads image data from `src/content/galleries.yaml`.

- Each gallery entry uses an `id` that matches the `gallery` prop passed to `MdxImageGallery`.
- The CMS stores each image path as `/src/assets/images/...`.
- The component resolves those CMS paths at build time, so editors do not need to rewrite them manually.
- Captions and alt text are optional, but alt text is recommended for accessibility.

Example structure:

```yaml
galleries:
    - id: clean-and-rebuild
        title: Clean and rebuild gallery
        images:
            - src: /src/assets/images/example.jpg
                alt: Example image
                caption: Optional caption text
```

---

## Photo Portfolio (`/photos`)

The standalone photography stream uses `src/content/photos.yaml` and is managed in Sveltia CMS under **Photo Portfolio**:

- **Media Folder**: `src/assets/images/portfolio`
- **Fields**:
  - `Image` (`src`): Master photo asset.
  - `Title` (`title`): Photo name (also used as automatic fallback for `alt` accessibility text).
  - `Caption / Location` (`caption`): Optional location / context.
  - `Category` (`category`): Select dropdown (`Self`, `People`, `Animals`, `Places`, `Other`).
  - `Camera / Gear` (`camera`): Optional gear override (e.g. `Olympus E-M1 Mark III • 12-40mm F2.8 Pro`).
  - `Year / Date` (`date`): Optional capture date override (e.g. `Aug 2025`).
- **Dynamic Build-Time EXIF Extraction**: If `date` or `camera` are left blank in the CMS, Astro uses `exifr` during build to automatically parse capture dates and camera bodies/lenses from the image files.

---

## Image Generation Configuration

All OG and preview image generation settings (template path, fallback background, output directory, site title, style, and site URL) are managed in:

    src/scripts/image-generation/image-config.json

This makes it easy to update image generation parameters in one place for both scripts.
