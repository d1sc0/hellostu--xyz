# Jam Comments Integration

## Overview

This site integrates Jam Comments for lightweight, developer-friendly static site comment management on blog posts.

To maintain build robustness and prevent build failures if keys are unset, the integration is **conditionally activated** based on the presence of environment variables.

---

## Configuration & Activation

To activate Jam Comments on your blog posts, configure the following variables in your `.env` file (or CI/CD environment):

```ini
# Jam Comments Configuration
JAM_COMMENTS_DOMAIN=hellostu.xyz
JAM_COMMENTS_API_KEY=your_jam_comments_api_key_here
JAM_COMMENTS_TZ=Europe/London
```

If these keys are not set, the comment form is completely ignored during compile time without throwing errors.

---

## Technical Details

### 1. Integration Layout
The comments block is rendered directly inside the shared post layout file [src/layouts/MarkdownPostLayout.astro](file:///Users/d1sc0/Projects/hellostu--xyz/src/layouts/MarkdownPostLayout.astro) under the Like and Share widgets:

```astro
---
import JamComments from '@jam-comments/astro';

const jamCommentsDomain = import.meta.env.JAM_COMMENTS_DOMAIN || process.env.JAM_COMMENTS_DOMAIN;
const jamCommentsApiKey = import.meta.env.JAM_COMMENTS_API_KEY || process.env.JAM_COMMENTS_API_KEY;
const jamCommentsTz = import.meta.env.JAM_COMMENTS_TZ || process.env.JAM_COMMENTS_TZ;
const hasJamComments = !!(jamCommentsDomain && jamCommentsApiKey);
const currentPath = new URL(Astro.request.url).pathname;
---

{
  hasJamComments && (
    <div class="post-layout__comments">
      <JamComments domain={jamCommentsDomain} apiKey={jamCommentsApiKey} path={currentPath} tz={jamCommentsTz} />
    </div>
  )
}
```

### 2. Style Theme Integration
To ensure a consistent look and feel with the site's typography and color scheme (supporting both **Light** and **Dark** mode), the styling overrides have been centralized in [src/styles/md-post-layout.css](file:///Users/d1sc0/Projects/hellostu--xyz/src/styles/md-post-layout.css):

```css
.post-layout__comments .jc {
  --jc-color-text: var(--color-text);
  --jc-color-text-muted: var(--color-text);
  --jc-color-border: var(--color-line);
  --jc-color-bg: var(--color-page);
  --jc-color-bg-subtle: var(--color-line);
  --jc-color-accent: var(--color-link);
  --jc-font-family: 'Lexend', sans-serif;
  --jc-max-width: 100%;
}
```

This ensures that the inputs and forms instantly adapt to dark-mode transitions using your site's custom palette variables.

---

## References

*   **Official Documentation**: [Jam Comments Customizing Look & Feel](https://jamcomments.com/docs/styles/)
*   **Package**: `@jam-comments/astro`
