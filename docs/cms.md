---

## Styling & Naming Conventions

For details on how styles and class names are structured in this project, see [styling-naming-conventions.md](styling-naming-conventions.md).

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
- Post fields: title, slug, draft, pubDate, body, description, tags
- Sortable by: title, pubDate
- Default sort: pubDate descending

To access the CMS, open `/admin/` in your deployed site.


## Prebuild Automation for Sveltia CMS

Image path corrections and Markdown file renaming are now handled automatically by the prebuild script:

    src/scripts/pre-build-sveltia-cms-catches.js

This script:

- Fixes image paths in Markdown files (uploaded via Sveltia CMS) to ensure static build compatibility
- Ensures image filenames in Markdown end with _RIGHT, _LEFT, or _FULL (adds _FULL if missing) and renames the image file to match
- Renames Markdown files to match their `slug` frontmatter (if present)

No manual changes are needed after uploading images or creating new posts in the CMS.

---

## Image Generation Configuration

All OG and preview image generation settings (template path, fallback background, output directory, site title, style, and site URL) are managed in:

    src/scripts/image-generation/image-config.json

This makes it easy to update image generation parameters in one place for both scripts.
