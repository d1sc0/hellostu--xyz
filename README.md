# Hello Stu v2.0

A modern Astro v6 static site with Sveltia CMS, automated image generation, and strict mobile-first CSS.

## Quick Start

1. **Install dependencies:**
   npm install
2. **Start the dev server:**
   npm run dev
3. **Build for production:**
   npm run build

## Key Features

- Astro v6 with Content Layer API for Markdown/MDX
- Sveltia CMS for content editing
- Automated OG and preview image generation (Node + Puppeteer)
- Modular, mobile-first CSS with a single desktop breakpoint
- Strict 5-variable color palette
- Robust static asset/image handling
- Automated migration and normalization scripts

## Docs

See the [docs/](docs/) folder for full guides and details:

- [Project setup](docs/project-setup-guide.md)
- [Sveltia CMS guide](docs/sveltia-cms.md)
- [OG image generation](docs/og-image-generation-guide.md)
- [Preview image generation](docs/preview-image-generation-guide.md)
- [Astro Markdown guide](docs/astro-markdown-guide.md)
- [Astro v6 migration notes](docs/astro-v6-migration.md)
- [CSS naming conventions](docs/css-naming-conventions.md)
- [Component overview](docs/component-overview.md)
- [MDX image gallery guide](docs/mdx-image-gallery-guide.md)
- [To-do & project plan](docs/_to-do.md)

## Automation & Workflow

- See [OG image generation guide](docs/og-image-generation-guide.md) and [Preview image generation guide](docs/preview-image-generation-guide.md) for automation details.
- See [Sveltia CMS guide](docs/sveltia-cms.md) for content workflow and prebuild automation.

## Optional `featureImage` Frontmatter

Posts and pages can now define an optional `featureImage` field in frontmatter.

- Supported on: markdown posts, MDX posts, and MDX pages.
- Recommended path format: `/src/assets/uploaded_images/your-image.jpg`
- Used by:
   - home page image stream component (`PostImageScroller`)
   - social OG image generation script
   - preview image generation script

Selection precedence is:

1. `featureImage` (if present and resolvable)
2. first markdown image in the body
3. script fallback background image

Example frontmatter:

```yaml
---
title: Example post
slug: example-post
pubDate: 2026-04-20T10:00:00
description: Example
featureImage: /src/assets/uploaded_images/example-FULL.jpg
---
```

## Agent & Onboarding Notes

See [agent.md](agent.md) for co-pilot/agent onboarding, automation gotchas, and troubleshooting tips.

## Requirements

- Node.js 24.x (see .nvmrc)

---

For migration, automation, and style system details, see [docs/\_to-do.md](docs/_to-do.md) and [docs/](docs/).
