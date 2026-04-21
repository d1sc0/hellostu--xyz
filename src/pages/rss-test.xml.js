import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import sanitizeHtml from 'sanitize-html';
import MarkdownIt from 'markdown-it';

const parser = new MarkdownIt({
  html: false,
  linkify: true,
  typographer: true,
});

function toAbsoluteSiteUrl(site, path) {
  if (!path) return path;
  if (/^(https?:)?\/\//.test(path)) return path;
  if (path.startsWith('/')) return new URL(path, site).toString();
  return path;
}

function absolutizeHtmlUrls(html, site) {
  return html
    .replace(/(href=")\/(?!\/)/g, `$1${new URL('/', site).toString()}`)
    .replace(/(src=")\/(?!\/)/g, `$1${new URL('/', site).toString()}`);
}

function looksLikeMdx(body) {
  // If body likely contains JSX/components/expressions, use fallback excerpt.
  return /<[A-Z][A-Za-z0-9]*/.test(body) || /\{[^}]+\}/.test(body);
}

function getOgImageUrl(post, site) {
  const slug = post.data.slug || post.id;
  return new URL(`/generated_social_images/${slug}.png`, site).toString();
}

function buildRssContent(post, context) {
  const body = post.body || '';
  if (!body || looksLikeMdx(body)) {
    const postUrl = new URL(`/posts/${post.id}/`, context.site).toString();
    return `<p>${post.data.description} <a href="${postUrl}">[read more...]</a></p>`;
  }

  const rendered = parser.render(body);
  const sanitized = sanitizeHtml(rendered, {
    allowedTags: sanitizeHtml.defaults.allowedTags.concat(['img']),
    allowedAttributes: {
      ...sanitizeHtml.defaults.allowedAttributes,
      a: ['href', 'name', 'target', 'rel'],
      img: ['src', 'alt', 'title', 'width', 'height', 'loading'],
    },
  });

  return absolutizeHtmlUrls(sanitized, context.site);
}

export async function GET(context) {
  const posts = await getCollection('posts', ({ data }) => {
    return import.meta.env.PROD ? data.draft !== true : true;
  });

  posts.sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());

  return rss({
    title: 'Blog Posts (Test Full Content)',
    description: 'Test feed with full post content where possible',
    site: context.site,
    xmlns: {
      media: 'http://search.yahoo.com/mrss/',
    },
    items: posts.map(post => {
      const ogImage = getOgImageUrl(post, context.site);
      return {
        title: post.data.title,
        pubDate: post.data.pubDate,
        description: post.data.description,
        link: `/posts/${post.id}/`,
        content: buildRssContent(post, context),
        customData: `
          <enclosure url="${toAbsoluteSiteUrl(context.site, ogImage)}" type="image/png" />
          <media:content url="${toAbsoluteSiteUrl(context.site, ogImage)}" medium="image" />
        `,
      };
    }),
  });
}
