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
      // Remove multi-line self-closing component tags.
      .replace(/^\s*<[A-Z][\s\S]*?\/>(\s*)$/gm, '')
      // Remove paired component blocks.
      .replace(/^\s*<[A-Z][\s\S]*?<\/[A-Z][A-Za-z0-9]*>(\s*)$/gm, '')
      // Remove inline MDX expression containers.
      .replace(/\{[^{}]*\}/g, '')
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

  // Check if body has components before stripping
  const hadComponents = /<[A-Z][A-Za-z0-9]*/.test(body);

  const rssBody = stripMdxSyntax(body);
  if (!rssBody) {
    const postUrl = new URL(`/posts/${post.id}/`, context.site).toString();
    return `<p>${post.data.description} <a href="${postUrl}">[read more...]</a></p>`;
  }

  const rendered = parser.render(rssBody);
  const sanitized = sanitizeHtml(rendered, {
    allowedTags: sanitizeHtml.defaults.allowedTags.concat(['img']),
    allowedAttributes: {
      ...sanitizeHtml.defaults.allowedAttributes,
      a: ['href', 'name', 'target', 'rel'],
      img: ['src', 'alt', 'title', 'width', 'height', 'loading'],
    },
  });

  let content = absolutizeHtmlUrls(sanitized, context.site);

  // Add notice if components were stripped
  if (hadComponents) {
    const postUrl = new URL(`/posts/${post.id}/`, context.site).toString();
    content += `<blockquote><p><em>Interactive element removed from RSS. <a href="${postUrl}">View the full post</a></em></p></blockquote>`;
  }

  return content;
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
