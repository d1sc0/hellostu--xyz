---
title: Clean and rebuild
slug: clean-and-rebuild
draft: true
pubDate: 2026-04-20T13:31:00
category: Play
description: tbc
tags:
  - website
  - project
  - code
  - design
  - writing
  - sveltia
  - astro
---

![a room being decorated](../../assets/uploaded_images/decorating-FULL.jpg)

So spring is here and I decided it was time to give this website another fresh coat of paint. What started out as an ambition to just paint the walls turned into knocking a few down and doing some slightly more involved renovations.

### Motivations for change

University studies, plus spending more time on small personal projects lately, pulled me back toward wanting a space where I could write about, share, and showcase what I'm working on and learning. That's still mostly for my own benefit rather than for an audience; it's just useful to catalogue things and make connections over time. There wasn't anything fundamentally wrong with the site as it was. I was getting a bit tired of the punk neo-brutalist aesthetic I'd built and wanted something calmer (am I getting old?). I've been interested in the idea of a digital garden for a while, and wanted something that felt more like that: easier to browse and rummage around in, and less card/image/magazine-like in layout and feel than what I had before.

I also wanted to remove some of the friction that had been getting in the way of me writing and publishing. I've implemented Sveltia CMS (still git-based) for easier, more accessible content editing, and written a few scripts (with the help of co-pilot) to take care of some of the manual work I was doing, like generating social image previews.

Along the way, I've also had the chance to simplify parts of the codebase, add some documentation, and clear away technical debt from earlier experiments. All very satisfying for a nerd like me 🤓. AI has been used and has been useful. We've also had some arguments along the way 🤖😡😂.

### Summary of the changes completed

- New layouts, styles and navigation
- Introduced 3 categories to organise my writing - work, rest and play
- Migrated all old posts and pages, tidying up tags along the way
- Moved much of the page context out of astro files and into Mdx files so the content can be updated alongide posts in the CMS (Content Management System)
- Took the same approach moving menu items previosuly baked into astro pages or components into json files to allow these to be more easliy updated via the CMS
- Implemented 'Dark Mode' feature for the lolz
- Rationalised and improved many of the old components, especially those previosuly created in a hurry to play with and visualise data
- New homepage component that allows a user to browse and navigate to posts by the images used within them.
- Created a set of pre-build scripts that handle some of the more irritating quirks between Sveltia & Astro whilst also generating social preview images for automatic reference in open graph meta.
- Lots of other subtle SEO and accessiblity improvements
- Revised/updated the about page content and introduced a now page

### Things I'm considering next

- For the moment I've removed commenting and social sharing. I probably should add these back in but it's not a prioroty and not sure I want/need the extra page clutter.
- I may try to repurpose the approach used for the home page Image stream to create an in-post gallery component to make sharing photodumps a little easier.
- Considering a recommended or related posts component.

_Image credit: [Valentin Ivantsov on Pexels](https://www.pexels.com/photo/modern-interior-kitchen-under-renovation-36035073/)_
