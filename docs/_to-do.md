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

- [x] Add images to the about page and re-write content to be more personal and current (consider a "now" style page)
- [x] Redesign OG image template and re-generate images
- [x] Test code and additional styles for markdown

## Post-Cutover Tasks

- [x] (Implemented) Consider an image navigation component—scan posts for images and provide a sliding carousel for navigation
- [x] Add a way to browse by post image on the home page
- [x] Add a small like (heart) button to posts alongside social share component (implemented using Firebase RTDB and native Web Share)
- [x] (Optional) Consider adapting a copy of the ImageStream component for inserting galleries of post images into mdx posts
- [x] (Optional) Create a recommended posts component for post pages
- [x] (Optional) Refactor latest posts to use same styling method as posts page (remove table)
~~- [ ] (Optional) Consider implementing Jam comments again~~
- [x] (Optional) Add a Strava running component/widget to show a specific recent activities (implemented lightweight StravaEmbed)
- [x] (Optional) Add a playlist component/widget to showcase favorite music/playlists, should allow playlists to be viewed in both spotify or apple music (implemented tabbed PlaylistWidget with lazy-loading)
- [x] (Optional) Add a component for embedding Instagram posts/reels (implemented InstagramEmbed)
- [ ] Build native Photos section into Astro (replace external Adobe Lightroom subdomain `photos.hellostu.xyz`):
  - [ ] Add `albums` / `photos` collection schema to Sveltia CMS config (`public/admin/config.yaml`)
  - [ ] Build `/photos` index page with album masonry grid, category filter pills, and photostream
  - [ ] Build `/photos/[album]` album story/gallery view using Astro image tools (`astro:assets` + Sharp)
  - [ ] Implement responsive full-screen lightbox with touch/swipe, keyboard navigation (`←`/`→`/`Esc`), and build-time EXIF metadata display (Camera, Lens, ƒ-stop, Shutter, ISO)
  - [ ] Update site navigation (`src/content/main-nav.json`) from external link to native `/photos` route

---

Add new tasks as needed. Check off items as you go!
