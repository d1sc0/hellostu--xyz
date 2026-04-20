import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';

export async function GET(context) {
  const posts = await getCollection('posts', ({ data }) => {
    return import.meta.env.PROD ? data.draft !== true : true;
  });
  posts.sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());

  // Helper to get OG image URL for a post
  function getOgImageUrl(post) {
    // Prefer slug, fallback to id
    const slug = post.data.slug || post.id;
    // Most images are named by slug
    return `${context.site}generated_social_images/${slug}.png`;
  }

  return rss({
    title: 'Blog Posts',
    description: 'Latest posts from the site',
    site: context.site,
    xmlns: {
      media: 'http://search.yahoo.com/mrss/',
    },
    items: posts.map(post => {
      const ogImage = getOgImageUrl(post);
      return {
        title: post.data.title,
        pubDate: post.data.pubDate,
        description: post.data.description,
        link: `/posts/${post.id}/`,
        content: `<p>${post.data.description} <a href="${context.site}posts/${post.id}/">[read more...]</a></p>`,
        customData: `
          <enclosure url="${ogImage}" type="image/png" />
          <media:content url="${ogImage}" medium="image" />
        `,
      };
    }),
  });
}
