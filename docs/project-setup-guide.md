---

## Styling & Naming Conventions

See [css-naming-conventions.md](css-naming-conventions.md) for details on the CSS methodology, BEM naming, and design choices used throughout the project.

# Project Setup

## Requirements

- Node.js 24 (see .nvmrc)
- npm

## Install dependencies

```
npm install
```

## Development server

```
npm run dev
```

## Build for production

```
npm run build
```

This runs the Astro production build.

To regenerate Open Graph (OG) images before building, run:

```
npm run prebuild
```

Preview image generation is currently manual:

```bash
npm run generate:preview
```

For a clean regeneration that deletes existing generated images first, run:

```
npm run prebuild:clean
```

You can also run the image generators manually. See:

- [OG image generation details](og-image-generation-guide.md)
- [Preview image generation details](preview-image-generation-guide.md)

### Image Generation Configuration

All OG and preview image generation settings (template path, fallback background, output directory, site title, style, and site URL) are managed in:

    src/scripts/image-generation/image-config.json

This makes it easy to update image generation parameters in one place for both scripts.

### Image Template Previews

The OG and preview image templates include a fallback background image so you can see a realistic preview when opening the HTML files in your browser. During image generation, the script injects the correct background automatically.

### Log Output

When generating images, only the generated filename is shown in the logs for clarity.

## Sveltia CMS Prebuild Automation

Image path corrections and Markdown file renaming are now handled automatically by the prebuild script:

    src/scripts/pre-build-sveltia-cms-catches.js

This script:

- Fixes image paths in Markdown files (uploaded via Sveltia CMS) to ensure static build compatibility
- Ensures image filenames in Markdown end with \_RIGHT, \_LEFT, or \_FULL (adds \_FULL if missing)
- Renames Markdown files to match their `slug` frontmatter (if present)

No manual changes are needed after uploading images or creating new posts in the CMS.
