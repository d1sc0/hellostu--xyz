# Agent Notes for hellostu--xyz

## Markdown Frontmatter Convention

- Always preserve both opening and closing --- lines in markdown frontmatter. Never remove or alter them when editing content files.
- When adding fields to frontmatter, insert them in the correct YAML position (e.g., after slug) and maintain indentation and structure.

## Project Overview

- Modern Astro v6 starter for quickly creating new static sites
- Sveltia CMS integration for content management (config and schemas updated for general use)
- Automated OG and preview image generation (Puppeteer)
- Modular CSS with PostCSS (postcss-preset-env, autoprefixer)
- Static asset and Markdown content workflow
- Deploys to Firebase Hosting via GitHub Actions

## Sveltia CMS Integration

- Sveltia CMS is pre-configured for managing content collections and pages.
- The CMS config and content schemas are updated for flexible, non-podcast use.
- Markdown and asset workflows are compatible with Sveltia CMS output.
- If you update content schemas, ensure the CMS config and prebuild scripts are kept in sync.

## Key Automation/Workflow

- `prebuild` script (`src/scripts/pre-build-sveltia-cms-catches.js`): normalizes CMS-inserted image paths to `../../assets/images/` and syncs Markdown filenames to match post slugs.
- Image assets are stored cleanly in `src/assets/images/` (portfolio master photos in `src/assets/images/portfolio/`).
- Markdown image alignment is handled by `src/plugins/remark-image-align.mjs` using URL hashes (`#left`, `#right`, `#full`) or query parameters (`?align=left`).
- **Photo Portfolio (`/photos`)**:
  - Reusable component: `src/components/PhotoGallery.astro`.
  - Manifest: `src/content/photos.yaml`.
  - Page: `src/content/pages/photos.mdx` rendered via `src/pages/photos.astro`.
  - Categories: `Self`, `People`, `Animals`, `Places`, `Other`.
  - Build-time EXIF extraction: `exifr` automatically parses `date` (Month Year) and `camera` gear at build time when fields are left blank in `photos.yaml` / Sveltia CMS.
  - Image accessibility `alt` automatically falls back to `title`.
- `npm run build` runs Astro build only and copies all public/ assets to `dist/` for deployment.

## Best Practices

- Use `#left`, `#right`, or `#full` URL fragments when embedding images in Markdown.
- Always run `npm run prebuild` before committing new/edited Markdown or images.
- If you change the folder structure for media or content, update the prebuild script accordingly.
- For troubleshooting image generation, check Puppeteer logs and template files.

## Deployment

- GitHub Actions workflow runs `npm run prebuild:clean`, then `npm run build`
- Only files in `dist/` are deployed to Firebase
- Any file renames or fixes during CI are NOT committed back to the repo (run prebuild locally and commit for repo sync)

## Useful Scripts

- `npm run dev` — runs prebuild, then Astro dev server
- `npm run build` — runs Astro build only
- `npm run prebuild` — run all pre-deployment/preview automation
- `npm run prebuild:clean` — clear generated image directories, then run prebuild automation
- `npm run generate:og` / `npm run generate:preview` — manual image generation

## Troubleshooting

- If images are missing in generated images, check template and script logic
- If Markdown files are not renamed, check slug frontmatter and prebuild script
- If images are missing on deployed site, ensure they exist in public/ before build

## User CSS/Media Query Preferences

- All CSS must be mobile-first (default styles for mobile).
- Only use @media (min-width: 768px) and (orientation: landscape) for desktop/landscape overrides.
- Place all media queries at the end of the CSS file.
- Do not use other media queries.

---

## Content & Writing Tone Guidelines

- **Writing Style and Tone of Voice**: Before writing or drafting new blog posts, the agent must read existing posts in `src/content/posts/` and pages in `src/content/pages/` (both `.md` and `.mdx` formats) to understand and match the author's unique voice (conversational, personal, reflective, candid, with public sector design context and creative/active hobbies).
- **Post Ideas & Inspiration**: Refine and build upon the active brainstormed post ideas list stored in the scratchpad's README:
  - Path: [src/content/scratchpad/README.md](file:///Users/d1sc0/Projects/hellostu--xyz/src/content/scratchpad/README.md)
  - Purpose: Tracks content ideas across *Work*, *Rest*, and *Play* based on the author's priorities.
  - Updates: Always update the `*Last updated:*` date in the "Blog Post Ideas & Inspiration" section of the README when modifying this list.
  - **Important Reference Rule for Agents**: Always refer to this backlog file explicitly as `src/content/scratchpad/README.md` or `scratchpad/README.md` (never say "the README" or `README.md`, which is reserved for the root project README to avoid confusing the author).
- **Scratchpad Directory**: A private playground is located at [src/content/scratchpad/](file:///Users/d1sc0/Projects/hellostu--xyz/src/content/scratchpad/) for drafting posts and brainstorming ideas locally with the user. Astro ignores this folder. When a draft is ready to be published, move it to `src/content/posts/` and run `npm run prebuild`.

---

## Documentation Quick Links

- [Astro Markdown Guide](docs/astro-markdown-guide.md)
- [CSS Naming Conventions](docs/css-naming-conventions.md)
- [Sveltia CMS Guide](docs/sveltia-cms.md)
- [OG Image Generation Guide](docs/og-image-generation-guide.md)
- [Preview Image Generation Guide](docs/preview-image-generation-guide.md)
- [Project Plan](docs/project-plan.md)
- [Post Ideas List](file:///Users/d1sc0/Projects/hellostu--xyz/src/content/scratchpad/README.md)
