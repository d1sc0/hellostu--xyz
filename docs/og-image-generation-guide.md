---
## Image Generation Configuration

All OG and preview image generation settings (template path, fallback background, output directory, site title, style, and site URL) are managed in:

    src/scripts/image-generation/image-config.json

This makes it easy to update image generation parameters in one place for both scripts.

# OG Image Generation Script

This script generates Open Graph (OG) images for all posts using Puppeteer and a custom HTML template.

- **Script:** `src/scripts/image-generation/generate-og-images.ts`
- **Template:** `src/scripts/image-generation/social-image-template.html`
- **Background:** `src/scripts/image-generation/og-background.png`
- **Output:** `public/generated_social_images/` (1200x630 PNG)
- **Config:** `src/scripts/image-generation/image-config.json` (all paths, site title, style, and site URL)

## How It Works

1. Reads all Markdown files in `src/content/posts/`.
2. Extracts post metadata (title, slug) and finds the first image in the post body (if present).
3. Loads the HTML template and injects post data and a base64-encoded background image.
    - If a post or page image is found, it is used as the background (with grayscale and opacity applied).
    - If no image is found, the fallback background is `src/scripts/image-generation/og-background.png`.

## OG Image Fallback Logic

When rendering pages, the site checks if a generated OG image exists at `/generated_social_images/[id].png`.

- If the image exists, it is used for the Open Graph meta tag.
- If not, the default OG image `/default_social.png` is used instead.

This ensures every page always has a valid OG image for social sharing, even if a generated image is missing.
4. Uses Puppeteer to render the HTML and capture a PNG screenshot.
5. Saves the image as `[post-id].png` in the output folder.

## Usage

Run as part of prebuild automation:

```
npm run prebuild
```

Or run clean prebuild (removes existing generated images first):

```
npm run prebuild:clean
```

Or manually:

```
npx ts-node src/scripts/image-generation/generate-og-images.ts
```

## Default OG Image

- The default OG image is located at `/public/default_social.png`.
- This image is used as a fallback for any page that does not have a generated OG image.

- Skips images that already exist.
- Logs only the generated filename for clarity.
- The template includes a fallback background for browser preview, but the script injects the correct background at runtime.
- Only post and page Markdown/MDX files are processed.
- **Font loading:** The template now includes a Google Fonts link for Inter, ensuring correct font rendering in both browser preview and generated images.
- All config (template path, fallback, output dir, site title, style, site URL) is in `image-config.json`.
- Output directory is auto-created if missing.
- Image filenames in Markdown are normalized to end with _RIGHT, _LEFT, or _FULL (default _FULL) by the prebuild script.

---

For styling and naming conventions used in image templates and across the project, see [css-naming-conventions.md](css-naming-conventions.md).
