import rss from '@astrojs/rss'
import { getCollection } from 'astro:content'
import { SITE_DESCRIPTION } from '../consts'

export async function GET(context) {
  const posts = await getCollection('blog')
  return rss({
    title: "Soham Karandikar's Portfolio",
    description: SITE_DESCRIPTION,
    site: context.site,
    items: posts.map((post) => ({
      ...post.data,
      link: `/blog/${post.slug}/`,
    })),
  })
}
