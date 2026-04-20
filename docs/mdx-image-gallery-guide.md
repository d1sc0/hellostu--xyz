# MDX Image Gallery Guide

This guide covers `MdxImageGallery`, the MDX component used for rendering build-time image galleries from `src/content/galleries.yaml`.

## What it does

- Loads gallery definitions from `src/content/galleries.yaml` during the build.
- Resolves image references from the CMS into local uploaded assets.
- Renders a horizontal scrolling gallery with arrow buttons, swipe support, and keyboard navigation.
- Supports optional captions and optional links to the full-size image.

## Basic usage

```mdx
import MdxImageGallery from '../../components/MdxImageGallery.astro';

<MdxImageGallery gallery="clean-and-rebuild" />
```

## Props

- `gallery` - required gallery id from `src/content/galleries.yaml`
- `heading` - optional custom heading text
- `showHeading` - hides the heading while keeping the gallery controls visible
- `showCaptions` - shows image captions when they exist in the YAML
- `linkMode` - use `full-image` to make each image open the original file in a new tab
- `imageHeight` - fallback height used for both mobile and desktop
- `imageHeightMobile` - explicit mobile image height
- `imageHeightDesktop` - explicit desktop image height

## CMS-backed image paths

When image galleries are edited in Sveltia CMS, image paths are stored as `/src/assets/uploaded_images/...`.

The component resolves those paths at build time, so the YAML file can stay CMS-friendly while the final site still uses Astro image optimisation.

## Gallery-only post workflow

If a post uses `MdxImageGallery` and does not include a regular markdown image in the body, set optional `featureImage` in post frontmatter.

This ensures the post still contributes an image to:

- the home page image stream
- OG social image generation
- preview image generation

Example:

```yaml
---
title: Gallery post
slug: gallery-post
featureImage: /src/assets/uploaded_images/example.jpg
---
```

Example gallery entry:

```yaml
galleries:
  - id: clean-and-rebuild
    title: Clean and rebuild gallery
    images:
      - src: /src/assets/uploaded_images/example.jpg
        alt: Example image description
        caption: Optional caption text
```

## Styling and behaviour

- Images are displayed in a horizontal track with consistent heights.
- The gallery uses `scroll-snap` for predictable swipe and button scrolling.
- The viewport shows fade edges to indicate additional content off-screen.
- Arrow keys work when the gallery viewport is focused.

## Related files

- Component: `src/components/MdxImageGallery.astro`
- Styles: `src/styles/mdx-image-gallery.css`
- Manifest: `src/content/galleries.yaml`
- CMS config: `public/admin/config.yaml`
