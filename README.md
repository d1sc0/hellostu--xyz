# Hello Stu v2.0

- Astro v6 with Content Layer API for posts and pages (supports .md and .mdx)
- Sveltia CMS (Netlify CMS compatible) for easy editing of posts, pages, navigation, and social links
- Automated Open Graph (OG) image generation (Node + Puppeteer)
- Modular CSS with PostCSS (postcss-preset-env, autoprefixer)
- Inter font used everywhere for a clean, modern look
- Robust static asset/image handling for reliable deployment
- Fixes image paths in Markdown/MDX files (uploaded via Sveltia CMS)
- Ensures image filenames in Markdown/MDX end with \_RIGHT, \_LEFT, or \_FULL (adds \_FULL if missing) and renames the actual image file to match. These are used for CSS styling of images in markdown.
- Renames Markdown/MDX files to match their `slug` frontmatter (if present)
- Generates OG images for all posts (Puppeteer)
- Preview image generation is available but not run by default

1. **Install dependencies:**
   npm install

   ```

   ```

2. **Start the dev server:**
   Use `/admin/` (Sveltia CMS) to add/edit posts, pages (including MDX), navigation, and social/footer links.
   All Markdown/MDX and image path corrections are automated (see below).
   npm run dev
   - This runs all prebuild automation, then starts Astro.

- **No manual Markdown/MDX or asset path edits needed after CMS use**

3. **Edit content:**
   - All Markdown and image path corrections are automated (see below).
4. **Build for production:**

- Full MDX support for posts and pages (including component imports)
- Social links, navigation, and footer links managed via CMS and JSON
- Modular, mobile-first CSS with a single desktop breakpoint
- Automated migration scripts for content and images
- Improved content structure: Work, Rest, Play categories
- All content and config files are CMS-editable where possible

  ```
  npm run build
  ```

  - Runs Astro production build.
  - If you want to regenerate OG/preview images first, run `npm run prebuild` (or `npm run prebuild:clean`) before `npm run build`.

---

## Requirements

- Node.js 24.x (see .nvmrc)

---

## Automation & Workflow

- **Prebuild script** (`npm run prebuild`) runs before `npm run dev` and automates all content and image normalization:
  - Fixes image paths in Markdown files (uploaded via Sveltia CMS)
  - Ensures image filenames in Markdown end with \_RIGHT, \_LEFT, or \_FULL (adds \_FULL if missing) and renames the actual image file to match. These are used for CSS stlying of images in markdown.
  - Renames Markdown files to match their `slug` frontmatter (if present)
  - Generates OG and preview images for all posts (Puppeteer)
- **No manual Markdown or asset path edits needed after CMS use**
- **Image templates** use the Inter font (Google Fonts) for consistent, modern rendering
- **Astro build** (`npm run build`) copies all public assets to dist/ for deployment

## Styling & Naming Conventions

See [docs/styling-naming-conventions.md](docs/styling-naming-conventions.md) for a detailed explanation of the project's CSS methodology, BEM naming, and design choices.

---

## Useful Scripts

- `npm run dev` — runs prebuild, then Astro dev server
- `npm run build` — runs Astro build only
- `npm run prebuild` — run all pre-deployment/preview automation
- `npm run prebuild:clean` — clear generated image directories, then run prebuild automation
- `npm run generate:og` / `npm run generate:preview` — manual image generation

---

## Image Generation Configuration

All OG and preview image generation settings (template path, fallback background, output directory, site title, style, and site URL) are managed in:

src/scripts/image-generation/image-config.json

This makes it easy to update image generation parameters in one place for both scripts.

### Image Background Logic

- The scripts use the first image in the post body as the background (with opacity applied). If no image is found, the fallback background is used.
- Output directories are auto-created if missing.

---

## Docs

See the [docs/](docs/) folder for:

- [Project setup](docs/setup.md)
- [CMS/content editing](docs/cms.md)
- [OG image generation](docs/og-image-generation.md)
- [Preview image generation](docs/preview-image-generation.md)
- [Astro v6 migration notes](docs/astro-v6-migration.md)

---

## Sveltia CMS Prebuild Automation

Image path corrections and Markdown file renaming are handled automatically by the prebuild script:

    src/scripts/pre-build-sveltia-cms-catches.js

This script:

- Fixes image paths in Markdown files (uploaded via Sveltia CMS) to ensure static build compatibility
- Renames Markdown files to match their `slug` frontmatter (if present)

No manual changes are needed after uploading images or creating new posts in the CMS.

---

## Agent & Onboarding Notes

See [agent.md](agent.md) for co-pilot/agent onboarding, automation gotchas, and troubleshooting tips.

---

## Site Features

- **Responsive hamburger navigation** for mobile and desktop
- **Multi-page blog post lists** with image previews
- **Individual post pages** with next and previous navigation buttons
- **Latest post component** highlights the newest content
- **Accessible, semantic HTML** and ARIA attributes for navigation
- **Modern, modular CSS** with theme variables
- **Image preview and Open Graph generation** for social sharing
- **Admin UI** for content management (Sveltia CMS)
- **Automatic image and Markdown path correction**
- **Pagination** for post lists and tag pages
- **Customizable site title and palette**

---

## Cleaning Generated Images

By default, the deployment workflow runs the prebuild script with the `--clean` flag, which deletes all images in `/public/generated_preview_images` and `/public/generated_social_images` before generating new ones. This ensures that only up-to-date images are present after each build.

- To manually trigger this cleanup, use:
  ```
  npm run prebuild:clean
  ```
- The regular prebuild (without `--clean`) does not delete any images:
  ```
  npm run prebuild
  ```

**Note:** If build times become excessive, you can remove the `--clean` flag from your deployment workflow to skip this step and retain previously generated images. This may speed up builds, especially for large sites.
