# Personal Site & Digital Garden Plan

## Migration & Content

- [x] Migrate all markdown (.md) content from old site
- [x] Replace placeholder content with migrated content

## Content Structure

- [x] Add 3 new post categories: Work, Rest, Play
  - Work: weeknotes, learning design
  - Rest: reading, listening, watching, playlists, houseplants
  - Play: data/code experiments, photography, podcasts, drumming, exercise
- [x] Add category to post frontmatter & CMS config
- [x] Add CMS filters for categories
- [x] Update CMS config (public/admin/config.yaml) to support new categories
- [x] Add a collection in CMS for managing MDX files (for future migration)

## Home Page

- [x] Short about excerpt + link to full about page (markdown)
- [x] Latest 3 posts (baked into index.astro)
- [x] 3 category excerpts linking to category pages (baked into index.astro)

## Category Pages

- [x] Structure completed so leading content can be written (mdx)
- [x] Paginated post list component (reusable)
- [x] Show tags, published date (MMM YY), title (no excerpt)
- [x] Tag page in footer nav

## Features

- [x] Implement dark mode

## Navigation

- [x] MainNav: Work, Rest, Play, Photos (external), RSS (icon), Dark mode (icon)
- [x] FooterNav: About Me (md), Tags, Get in touch (md), Creative Commons

## Styles

- [x] 3-4 color palette (soft pastel backgrounds, good contrast)
- [x] Gochi Hand for site title, Lexend for body
- [x] Rounded corners on images
- [x] Simple, less framed look
- [x] Main width ~960px desktop
- [x] Dates in MMM YY format for lists

## Pre-Cutover Tasks

- [ ] Add images to the about page and re-write content to be more personal and current (consider a "now" style page)
- [ ] Redesign OG image template and re-generate images
- [ ] Test code and additional styles for markdown

## Post-Cutover Tasks

- [ ] Add a small like (heart) button to posts alongside social share component (check if social share is still maintained)
- [ ] Implement comments again
- [ ] (Optional) Consider an image navigation component—scan posts for images and provide a sliding carousel for navigation
- [ ] (Optional) Create a recommended posts component for post pages
- [ ] (Optional) Revisit webmentions and see if they're useful
- [ ] (Optional) Refactor latest posts to use same styling method as posts page (remove table)

---

Add new tasks as needed. Check off items as you go!
