# Personal Site & Digital Garden Plan

## Migration & Content

### All posts migrated (MDX)

- [x] Migrate existing markdown (.md) content from old site
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

- [x] Implement Darkmode

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

## Things left to do before cutover

- [ ] Add some images to the about page and and re-write content, make it a bit more personal and current (maybe more like a now style page)
- [ ] Redesign OG image template and re-generate images
- [ ] Create a recommended posts component for post pages
- [ ] test code and additional styles for markdown

## things to do post cutover

- [ ] Add a small like (heart) button to posts alongside social share component (need to see if thats still maintained?)
- [ ] Implement comments again.
- [ ] optional: Consider an image navigation component - create a component that scans posts for images and then has a sliding carosel that allows navigation by image?
- [ ] optional: Revisit webmentions and see if that's useful
- [ ] optional: refactor latest posts to use same styling method as posts page (remove table)

---

Add new tasks as needed. Check off items as we go!
