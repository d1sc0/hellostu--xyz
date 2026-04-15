# Agent Notes for disco-astro-starter

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

- `prebuild` script runs before `npm run dev`: fixes image paths, renames Markdown files to match slug, generates OG/preview images
- `npm run build` runs Astro build only and copies all public/ assets to `dist/` for deployment

## Best Practices

- Always run `npm run prebuild` before committing new/edited Markdown or images to ensure filenames and paths are correct
- If you change the folder structure for media or content, update the prebuild script accordingly
- For troubleshooting image generation, check Puppeteer logs and template files

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
