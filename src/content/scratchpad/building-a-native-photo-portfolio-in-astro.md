---
title: "Building a Native Photo Portfolio in Astro: Saying Goodbye to Adobe Portfolio"
pubDate: 2026-08-23
description: "Why I moved my photography portfolio away from Adobe Portfolio and rebuilt it natively into my Astro digital garden—with responsive masonry, build-time EXIF extraction, and a sleek lightbox."
tags:
  - "photography"
  - "astro"
  - "webdev"
  - "digital"
  - "creativity"
slug: "native-photo-portfolio-in-astro"
---

For a long time, my photography lived over on an external subdomain powered by Adobe Portfolio (`photos.hellostu.xyz`). On paper, it was convenient—sync a collection straight from Lightroom, pick a template, and call it a day. 

In practice, it always felt like a disconnected annex. The design never quite matched the rest of my digital garden, navigating back and forth felt disjointed, and I was paying a monthly creative cloud subscription partly just to keep a web gallery alive.

This weekend, I finally pulled the plug on the external subdomain and built a dedicated, native **[Photo Portfolio](/photos/)** right inside my Astro static site. 

Here is why I made the switch, how it's engineered, and a look at the configuration behind the scenes.

---

### Why Ditch Adobe Portfolio?

1. **True Ownership & Zero Subscriptions**: My photographs now live directly in my GitHub repository and deploy effortlessly to Firebase alongside my weeknotes, writing, and projects. No vendor lock-in.
2. **Blazing Performance**: Astro's asset pipeline with Sharp automatically generates modern responsive WebP formats at multiple breakpoints (`400px` to `1600px`), delivering razor-sharp Retina display quality with fraction-of-a-second load times.
3. **Seamless Digital Garden Aesthetic**: The gallery uses the exact same typography, palette variables, and responsive layout conventions as the rest of the site.
4. **Separation of Concerns**: In-post story galleries remain contextual within articles, while `/photos` serves as a high-resolution, curated portfolio stream.
5. **Direct Photo Permalinks**: Every individual photograph now has its own linkable URL (e.g. `https://hellostu.xyz/photos#iron-banana`), complete with an instant "Copy Link" button in the lightbox. Adobe Portfolio made direct photo linking clunky and awkward.

---

### How We Built It

#### 1. Curated Data Schema in Sveltia CMS

To make curating and adding new photographs effortless without touching code, we created a dedicated `photos.yaml` data manifest and mapped it into **Sveltia CMS** (`/admin/`):

```yaml
# public/admin/config.yaml
- name: 'portfolio'
  label: 'Photo Portfolio'
  media_folder: 'src/assets/images/portfolio'
  public_folder: '/src/assets/images/portfolio'
  files:
    - file: 'src/content/photos.yaml'
      label: 'Curated Photos'
      name: 'curated_photos'
      fields:
        - { label: 'Page Title', name: 'title', widget: 'string', default: 'Photos' }
        - { label: 'Intro Text', name: 'intro', widget: 'markdown', required: false }
        - label: 'Photos'
          name: 'photos'
          widget: 'list'
          summary: '{{fields.title}} ({{fields.category}})'
          fields:
            - { label: 'Image', name: 'src', widget: 'image' }
            - { label: 'Title', name: 'title', widget: 'string', required: false }
            - { label: 'Caption / Location', name: 'caption', widget: 'string', required: false }
            - {
                label: 'Category',
                name: 'category',
                widget: 'select',
                options: ['Self', 'People', 'Animals', 'Places', 'Other'],
                default: 'Other',
              }
            - { label: 'Camera / Gear', name: 'camera', widget: 'string', required: false }
            - { label: 'Year / Date', name: 'date', widget: 'string', required: false }
```

> **Smart Defaults**: To keep CMS entries lightning fast, accessibility `alt` text automatically falls back to the photo's `title`, saving an extra field every time.

---

#### 2. Automatic Build-Time EXIF Metadata Extraction

Rather than manually looking up when every photo was taken or what camera was in my hand, `PhotoGallery.astro` automatically parses image EXIF metadata at build time using `exifr` if the fields are left empty in the CMS:

```js
// Inside PhotoGallery.astro (build-time frontmatter)
if (!date || !camera) {
  const exif = await exifr.parse(diskPath, { tiff: true, exif: true });
  
  if (!date && exif?.DateTimeOriginal) {
    date = new Date(exif.DateTimeOriginal).toLocaleDateString('en-GB', { 
      month: 'short', 
      year: 'numeric' 
    });
  }

  if (!camera) {
    const cam = cleanCamera(exif?.Make, exif?.Model);
    const lens = cleanLens(exif?.LensModel);
    camera = [cam, lens].filter(Boolean).join(' • ');
  }
}
```

This means new uploads in Sveltia CMS only require an image and a title. Astro automatically tags them with accurate capture dates and camera bodies spanning from my old Nikon D7000 and Pixel phones to my Olympus gear—with full freedom to provide a custom manual override whenever desired.

---

#### 3. Pure Masonry Layout (CSS Columns)

Instead of rigid square thumbnails that crop portraits or awkward grid gaps, we implemented pure CSS multi-column masonry:

```css
/* src/styles/photos.css */
.photos-masonry {
  column-count: 1;
  column-gap: 0.5rem;
  margin-bottom: 3rem;
}

.photo-item {
  break-inside: avoid;
  margin-bottom: 0.5rem;
  display: block;
  width: 100%;
  border-radius: 6px;
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.2s ease, opacity 0.3s ease;
}

@media (min-width: 768px) and (orientation: landscape) {
  .photos-masonry {
    column-count: 2;
    column-gap: 0.6rem;
  }
  .photo-item {
    margin-bottom: 0.6rem;
  }
}
```

Every photograph retains its natural vertical or horizontal proportions, creating a seamless, tactile masonry flow.

---

#### 4. Minimalist, Accessible Lightbox Modal

Clicking any photo opens a native `<dialog>` modal with:
- Keyboard navigation (`←`, `→` arrow keys to cycle, `Esc` to close).
- Mobile touch swipe gestures.
- A compact, frosted-glass dark badge anchored to the bottom right showing Title, Location, Camera Gear, and Date:

```html
<!-- Lightbox Overlay -->
<div class="lightbox__overlay" id="lightbox-overlay">
  <h2 class="lightbox__title" id="lightbox-title">Vape Dancing</h2>
  <p class="lightbox__caption" id="lightbox-caption"></p>
  <p class="lightbox__camera" id="lightbox-camera">Olympus E-M1 Mark III • 12-40mm F2.8 Pro</p>
  <p class="lightbox__date" id="lightbox-date">Aug 2025</p>
</div>
```

---

#### 5. Recent-Weighted Randomization

I didn't want a strict chronological timeline (which can feel predictable), but I also didn't want my best recent work buried at the bottom. We applied a weighted shuffle algorithm:

```js
// Weight recent photos towards the top with controlled random jitter
function weightedShuffle(photos, jitterYears = 1.6) {
  const ONE_YEAR_MS = 365.25 * 24 * 60 * 60 * 1000;
  const jitterMs = jitterYears * ONE_YEAR_MS;

  return photos
    .map(p => ({
      photo: p,
      score: parseDateToTimestamp(p.date) + (Math.random() * 2 - 1) * jitterMs,
    }))
    .sort((a, b) => b.score - a.score)
    .map(s => s.photo);
}
```

Recent shots from 2024–2026 naturally greet visitors first, followed by older visual memories, all woven together with pleasant variety.

---

#### 6. Direct Photo Permalinks & Deep Linking

One limitation with many third-party galleries is that you can rarely share a link to a *single* photograph inside a fullscreen viewer. 

We wired up reversible deep linking into `PhotoGallery.astro`:
- Every image generates a clean slug from its title (e.g. `#vape-dancing`, `#cocktail-menu`, `#iron-banana`).
- When navigating or sharing, `history.replaceState` updates the URL hash dynamically.
- Visiting `/photos#vape-dancing` directly automatically scrolls to and launches that exact photograph in the fullscreen lightbox.
- A discrete share button in the lightbox header lets you copy the direct permalink in one click with instant visual feedback.

---

### What's Next?

Having my photography live inside the same codebase as my thoughts and essays makes the whole digital garden feel complete. If you'd like to take a look, explore the new **[Photos Portfolio](/photos/)** (or test a direct link like **[/photos#vape-dancing](/photos#vape-dancing)**)!
