---
title: "Bringing My Photos Home: Building a Native Portfolio in My Digital Garden"
pubDate: 2026-08-23
description: "Why I moved my photography portfolio away from Adobe Portfolio and brought it natively into my Astro digital garden—focusing on ownership, cohesive design, category filtering, and deep linking."
tags:
  - "photography"
  - "astro"
  - "webdev"
  - "digital garden"
  - "creativity"
slug: "bringing-my-photos-home"
---

For several years, my photography lived over on a detached subdomain powered by Adobe Portfolio (`photos.hellostu.xyz`). On paper, it made a lot of sense: you pick a pre-made template, click sync in Adobe Lightroom, and your collections appear online with almost zero friction.

In practice, it always felt like an annex. 

The typography never quite matched the rest of my digital garden, the color schemes clashed with the main site, and navigating back and forth felt disjointed. It felt like visiting two completely separate worlds.

This weekend, I finally pulled the plug on the external subdomain and brought my photography **home** into a native **[Photo Portfolio](/photos/)** right inside `hellostu.xyz`.

---

### The Catalyst: Switching to Sveltia CMS

The biggest blocker to hosting photos natively in the past was maintenance. I didn't want to open Visual Studio Code, write raw YAML files, manually rename image files, and push git commits every time I wanted to add a picture. 

The catalyst for making the switch was integrating **Sveltia CMS** into my static site. 

Having a clean, visual content management interface changed everything. Now, curating the gallery is as simple as opening `/admin/`, selecting an image, giving it a title, and picking a category.

Is it quite as effortless as clicking "Sync to Adobe Portfolio" straight out of Lightroom? Probably not. But because I curate and update my portfolio in thoughtful batches rather than daily dumps, that slight trade-off is negligible. Having the gallery live natively under the same roof—sharing the exact same aesthetic, fonts, and codebase—far outweighs any minor inconvenience.

---

### Making the Gallery Feel Like Home

Bringing the photos directly into Astro allowed me to design the viewing experience around how I actually want people to enjoy them:

#### 1. Seamless Digital Garden Integration
The gallery now uses the exact same warm palette, fonts, and responsive layout rules as the rest of the site. It no longer feels like a third-party widget taped onto the side; it feels like a natural wing of the house.

#### 2. Pure Masonry Layout
Rather than cropping vertical portraits into rigid square thumbnails or leaving awkward gaps, the masonry grid flows naturally across 1 column on mobile and 2 columns on desktop landscape. Every photo retains its natural aspect ratio.

#### 3. Category Filtering
I wanted an easy way to organize my photography without creating dozens of separate pages. We set up simple filter pills across five core themes:
* **Self**
* **People**
* **Animals**
* **Places**
* **Other**

You can browse everything in a single stream, or filter down to a specific mood with a single tap.

#### 4. Deep Linking & Direct Permalinks
One of the most frustrating limitations of many third-party photo tools is the inability to share a single photo. If you want to talk about a specific picture in an essay or send a link to a friend, you usually have to point them to the entire gallery and tell them to "scroll down a bit."

Now, every photo generates its own direct permalink (like **[/photos#vape-dancing](/photos#vape-dancing)** or **[/photos#iron-banana](/photos#iron-banana)**). Clicking a link opens the gallery and immediately launches that exact picture in high resolution. There's even a discrete 1-click **Copy Link** button right in the lightbox header.

#### 5. Intelligent Metadata Behind the Scenes
To keep the editing process effortless, the site automatically reads each photo's EXIF data at build time. When I upload a photo, Astro automatically extracts the capture date (e.g. `Aug 2025`) and camera gear (e.g. `Olympus E-M1 Mark III • 12-40mm F2.8 Pro`), meaning I only ever need to type a title.

---

### The Payoff

Digital gardens are about ownership and intentionality. Relying on closed silos and monthly subscriptions often pulls us away from the craft of building spaces that truly feel like our own.

Having my visual work live alongside my weeknotes, writing, and experiments makes the whole site feel whole again.

If you'd like to take a look around, explore the new **[Photos Portfolio](/photos/)**!
