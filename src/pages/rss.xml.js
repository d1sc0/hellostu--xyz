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

function stripMdxSyntax(body) {
  return (
    body
      // Remove import/export blocks.
      .replace(/^\s*import[\s\S]*?;[^\n]*$/gm, '')
      .replace(/^\s*export[\s\S]*?;[^\n]*$/gm, '')
      // Replace multi-line self-closing component tags with marker.
      .replace(/^\s*<[A-Z][\s\S]*?\/>\s*$/gm, '\n[INTERACTIVE_REMOVED]\n')
      // Replace paired component blocks with marker.
      .replace(
        /^\s*<[A-Z][\s\S]*?<\/[A-Z][A-Za-z0-9]*>\s*$/gm,
        '\n[INTERACTIVE_REMOVED]\n',
      )
      // Remove inline MDX expression containers.
      .replace(/\{[^{}]*\}/g, '')
      // Replace iframe tags with marker (including multiline).
      .replace(/<iframe[\s\S]*?<\/iframe>/gm, '\n[INTERACTIVE_REMOVED]\n')
      .trim()
  );
}

function getOgImageUrl(post, site) {
  const slug = post.data.slug || post.id;
  return new URL(`/generated_social_images/${slug}.png`, site).toString();
}

function buildRssContent(post, context) {
  const body = post.body || '';
  if (!body) {
    const postUrl = new URL(`/posts/${post.id}/`, context.site).toString();
    return `<p>${post.data.description} <a href="${postUrl}">[read more...]</a></p>`;
  }

  // Check if body has components or iframes before stripping
  const hadComponents = /<[A-Z][A-Za-z0-9]*/.test(body);
  const hadIframes = /<iframe/.test(body);
  // Check if body has images
  const hadImages = /!\[/.test(body);

  const rssBody = stripMdxSyntax(body);
  if (!rssBody) {
    const postUrl = new URL(`/posts/${post.id}/`, context.site).toString();
    return `<p>${post.data.description} <a href="${postUrl}">[read more...]</a></p>`;
  }

  const rendered = parser.render(rssBody);

  // Replace img tags with markers before sanitization
  let withImageMarkers = rendered.replace(/<img[^>]*>/g, '[IMAGE_REMOVED]');

  let sanitized = sanitizeHtml(withImageMarkers, {
    allowedTags: sanitizeHtml.defaults.allowedTags,
    allowedAttributes: sanitizeHtml.defaults.allowedAttributes,
  });

  // Remove any escaped iframe tags that made it through
  sanitized = sanitized.replace(/&lt;iframe[\s\S]*?&lt;\/iframe&gt;/g, '');

  let content = absolutizeHtmlUrls(sanitized, context.site);

  // Replace markers with blockquote notices if elements were stripped
  if (hadComponents || hadIframes || hadImages) {
    const postUrl = new URL(`/posts/${post.id}/`, context.site).toString();
    const interactiveNotice = `<blockquote><p><em>Interactive element removed from RSS. <a href="${postUrl}">View the full post</a></em></p></blockquote>`;
    const imageNotice = `<blockquote><p><em>Image removed from RSS. <a href="${postUrl}">View the full post</a></em></p></blockquote>`;
    content = content.replace(/\[INTERACTIVE_REMOVED\]/g, interactiveNotice);
    content = content.replace(/\[IMAGE_REMOVED\]/g, imageNotice);
  }

  return content;
}

export async function GET(context) {
  const posts = await getCollection('posts', ({ data }) => {
    return import.meta.env.PROD ? data.draft !== true : true;
  });

  posts.sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());

  return rss({
    title: 'Hello Stu - Posts',
    description:
      'Latest posts from Stuart Mackenzie. Feed contains post content with images and interactive elements removed for improved readability in RSS readers.',
    site: context.site,
    xmlns: {
      media: 'http://search.yahoo.com/mrss/',
    },
    items: posts.map(post => {
      const ogImage = getOgImageUrl(post, context.site);

      // Build category link
      const categoryLink = `<p><strong>Posted in:</strong> <a href="${new URL(`/${post.data.category.toLowerCase()}/`, context.site).toString()}">${post.data.category}</a></p>`;

      // Build tags
      let tagsHtml = '';
      if (post.data.tags && post.data.tags.length > 0) {
        const tagLinks = post.data.tags
          .map(
            tag =>
              `<a href="${new URL(`/tags/${tag.toLowerCase().replace(/\s+/g, '-')}/`, context.site).toString()}">${tag}</a>`,
          )
          .join(', ');
        tagsHtml = `<p><strong>Tagged:</strong> ${tagLinks}</p>`;
      }

      // Combine metadata and content
      const metadata = categoryLink + tagsHtml;
      const mainContent = buildRssContent(post, context);

      return {
        title: post.data.title,
        pubDate: post.data.pubDate,
        description: post.data.description,
        link: `/posts/${post.id}/`,
        content: metadata + mainContent,
        customData: `
          <enclosure url="${toAbsoluteSiteUrl(context.site, ogImage)}" type="image/png" />
          <media:content url="${toAbsoluteSiteUrl(context.site, ogImage)}" medium="image" />
        `,
      };
    }),
  });
}
