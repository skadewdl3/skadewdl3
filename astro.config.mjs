import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwind from '@astrojs/tailwind';
import vue from "@astrojs/vue";
import { imageService } from '@unpic/astro/service'

import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex'

// https://astro.build/config
export default defineConfig({
  site: 'https://example.com',
  integrations: [mdx(), sitemap(), tailwind(), vue()],
  markdown: {
    remarkPlugins: [remarkMath],
    rehypePlugins: [rehypeKatex],
    shikiConfig: {
      // Choose from Shiki's built-in themes (or add your own)
      // https://shiki.style/themes
      // Alternatively, provide multiple themes
      // See note below for using dual light/dark themes
      themes: {
        light: 'catppuccin-latte',
        dark: 'poimandres'
      }
    }
  },
  image: {
    service: imageService({
      placeholder: "blurhash",
      fallbackService: "uploadcare"
    })
  }
});
