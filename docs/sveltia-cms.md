---

## Styling & Naming Conventions

For details on how styles and class names are structured in this project, see [css-naming-conventions.md](css-naming-conventions.md).

# CMS & Content Editing

This project uses Sveltia CMS (Netlify CMS compatible) for content editing.

- CMS config: `public/admin/config.yaml`
- Media folder: `src/assets/uploaded_images`
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
- Ensures image filenames in Markdown end with _RIGHT, _LEFT, or _FULL (adds _FULL if missing) and renames the image file to match
- Renames Markdown files to match their `slug` frontmatter (if present)

No manual changes are needed after uploading images or creating new posts in the CMS.

## Optional Feature Image Frontmatter

An optional `featureImage` field is available in:

- Posts (`.md`)
- MDX Posts (`.mdx`)
- Pages (`.mdx`)

Use it when you want an explicit image override instead of relying on the first markdown image in the body.

Recommended value format:

- `/src/assets/uploaded_images/your-image.jpg`

This field is used by:

- Home page image stream (`PostImageScroller`)
- OG social image generator
- Preview image generator

Selection precedence:

1. `featureImage`
2. first markdown image in body
3. configured fallback background

## Gallery Manifest

The gallery component reads image data from `src/content/galleries.yaml`.

- Each gallery entry uses an `id` that matches the `gallery` prop passed to `MdxImageGallery`.
- The CMS stores each image path as `/src/assets/uploaded_images/...`.
- The component resolves those CMS paths at build time, so editors do not need to rewrite them manually.
- Captions and alt text are optional, but alt text is recommended for accessibility.

Example structure:

```yaml
galleries:
    - id: clean-and-rebuild
        title: Clean and rebuild gallery
        images:
            - src: /src/assets/uploaded_images/example.jpg
                alt: Example image
                caption: Optional caption text
```

---

## Image Generation Configuration

All OG and preview image generation settings (template path, fallback background, output directory, site title, style, and site URL) are managed in:

    src/scripts/image-generation/image-config.json

This makes it easy to update image generation parameters in one place for both scripts.
