# Agent Notes for hellostu--xyz

## Markdown Frontmatter Convention

- Always preserve both opening and closing --- lines in markdown frontmatter. Never remove or alter them when editing content files.
- When adding fields to frontmatter, insert them in the correct YAML position (e.g., after slug) and maintain indentation and structure.
- **Discussion Fields**: Optional `blueskyUrl` and `linkedinUrl` fields can be added to post frontmatter to display discussion thread links alongside Like & Share.
- **Tag Conventions**: Always use lowercase kebab-case for tags (e.g., `learning-design`, `systems-thinking`). Avoid camelCase (e.g., `learningDesign`) or irregular casing, as Astro generates separate tag route URLs based on the exact tag strings.

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
- **Recommendation Engine (`src/scripts/recommendations.mjs`)**:
  - Computes semantic embeddings via `gemini-embedding-2` (cached by SHA-256 hash in `src/data/embeddings-cache.json`).
  - Balances relevance and diversity using Maximal Marginal Relevance (MMR).
  - Generates conversational first-person justifications and pirate easter egg justifications using `gemini-3.5-flash`.
  - Saves output to `src/data/recommendations.json`. By default reuses cached justifications; run with `--force` to regenerate all from scratch.
- **Raindrop.io Bookmarks Integration (`src/scripts/raindrop.mjs` & `src/components/for_posts/RaindropBookmarks/RaindropBookmarks.astro`)**:
  - Whitelist-based collection sync configured in `src/scripts/raindrop.config.mjs`.
  - Pulls bookmarks, personal Markdown notes, lowercase kebab-case tags, and text highlights at build time into `src/data/raindrop.json` using `RAINDROP_TOKEN`.
  - Gracefully falls back to cached `src/data/raindrop.json` when `RAINDROP_TOKEN` is absent.
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

- `npm run dev` — runs prebuild, syncs Raindrop bookmarks, generates recommendations for any new posts, then starts Astro dev server
- `npm run build` — runs Astro build only
- `npm run prebuild` — run all pre-deployment/preview automation
- `npm run prebuild:clean` — clear generated image directories, then run prebuild automation
- `npm run generate:og` / `npm run generate:preview` — manual image generation
- `npm run generate:recommendations` — generate recommendations for new or uncached posts
- `npm run generate:recommendations:force` — bypass cache and regenerate all recommendations from scratch
- `npm run generate:recommendations:test` — dry-run test on 5 random posts with console preview
- `npm run sync:raindrop` — sync whitelisted Raindrop.io collections to `src/data/raindrop.json`
- `npm run raindrop:collections` — list all Raindrop.io collections/folders with their IDs and sync status
- `npm run raindrop:list` — list or search synced bookmarks in `src/data/raindrop.json` (e.g. `npm run raindrop:list -- agile`)

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

- **Writing Style and Tone of Voice**: Before writing or drafting new blog posts, the agent must read existing posts in `src/content/posts/` and pages in `src/content/pages/` (both `.md` and `.mdx` formats) to understand and match the author's unique voice:
  - **Conversational, grounded, and British**: Use natural British phrasing and vernacular (*"bloke"*, *"chuffed"*, *"a fair few"*, *"rut"*, *"tends to"*, *"bloody hell"*, *"proper"*, *"sack off"*, *"faff"*, *"wicked"*, *"bin off"*, *"mates"*).
  - **First-person and personal**: Ground reflections in personal experience, work, and hobbies rather than preaching or lecturing the reader about what "society" or "we" should do.
  - **Self-aware and quietly humorous**: Self-deprecating without self-pity (*"I'm a nerd but a lazy one"*, *"I've never been much of a writer but I'd like to get better"*).
  - **Nuanced rather than absolutist**: Acknowledge complexity (*"Don't get me wrong, they often don't do a bad job..."*); focus on friction, cognitive load, and finding signal over noise.

- **Anti-AI Writing Rules (Eliminate on sight)**:
  - **Never use em dashes (`—`)**: Always use spaced hyphens (` - `), commas, colons, or parentheses instead.
  - **No faux-profound LinkedIn/TED aphorisms**: Avoid balanced antithetical soundbites (e.g. *"X is just data; Y is an invitation"*, *"It's not about the destination, it's about the journey"*).
  - **No false rhetorical binaries**: Never use the *"It's not about [strawman], it's about [buzzword]"* formula.
  - **No inflated tech-reviewer hyperbole**: Ban phrases like *"masterclass in calm software design"*, *"sacred quiet ritual"*, *"frictionless tapestry"*, *"delve into"*, *"testament to"*, *"game changer"*. Describe software simply and accurately (*"It's just really well made"*, *"It gets the basics right"*).
  - **Keep metaphors earthy and relatable**: Avoid over-dramatic or cartoonish metaphors; stick to real-world observations (*"high fructose, low in fibre diet"*, *"an old-school record shop"*).
  - **Natural, spoken sentence cadence**: Vary sentence lengths naturally; mix short punchy lines (*"Simple."*, *"That's it."*) with loose, conversational clauses.
- **Post Ideas & Inspiration**: Refine and build upon the active brainstormed post ideas list stored in the scratchpad's README:
  - Path: [src/content/scratchpad/README.md](file:///Users/d1sc0/Projects/hellostu--xyz/src/content/scratchpad/README.md)
  - Purpose: Tracks content ideas across *Work*, *Rest*, and *Play* based on the author's priorities.
  - Updates: Always update the `*Last updated:*` date in the "Blog Post Ideas & Inspiration" section of the README when modifying this list.
  - **Important Reference Rule for Agents**: Always refer to this backlog file explicitly as `src/content/scratchpad/README.md` or `scratchpad/README.md` (never say "the README" or `README.md`, which is reserved for the root project README to avoid confusing the author).
- **Scratchpad Directory**: A private playground is located at [src/content/scratchpad/](file:///Users/d1sc0/Projects/hellostu--xyz/src/content/scratchpad/) for drafting posts and brainstorming ideas locally with the user. Astro ignores this folder. When a draft is ready to be published, move it to `src/content/posts/` and run `npm run prebuild`.

---

## Documentation Quick Links

- [Recommendations Guide](docs/recommendations-guide.md)
- [Raindrop.io Guide](docs/raindrop-guide.md)
- [Astro Markdown Guide](docs/astro-markdown-guide.md)
- [CSS Naming Conventions](docs/css-naming-conventions.md)
- [Sveltia CMS Guide](docs/sveltia-cms.md)
- [OG Image Generation Guide](docs/og-image-generation-guide.md)
- [Preview Image Generation Guide](docs/preview-image-generation-guide.md)
- [Project Plan](docs/project-plan.md)
- [Post Ideas List](file:///Users/d1sc0/Projects/hellostu--xyz/src/content/scratchpad/README.md)
