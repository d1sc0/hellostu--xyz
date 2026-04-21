# Analytics Setup

## Overview

This site uses Umami Cloud for lightweight privacy-friendly analytics.

The tracking script is loaded globally from [src/components/Head.astro](src/components/Head.astro), so every page includes the same analytics snippet without duplicating it in individual pages or components.

## Current implementation

- Script source: `https://cloud.umami.is/script.js`
- Website ID: `654a48c1-5908-4f15-9c11-61de28477192`
- Location: [src/components/Head.astro](src/components/Head.astro)

## Maintenance notes

- Update the shared head component if the analytics provider changes.
- Do not copy the script into page files or other components.
- If you need to disable analytics temporarily, remove or guard the script in `Head.astro`.
