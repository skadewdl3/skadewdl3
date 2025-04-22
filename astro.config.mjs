import { defineConfig } from 'astro/config'
import mdx from '@astrojs/mdx'
import sitemap from '@astrojs/sitemap'
import tailwind from '@astrojs/tailwind'
import vue from '@astrojs/vue'
import { imageService } from '@unpic/astro/service'
import { transformerNotationDiff } from '@shikijs/transformers'
import remarkEleventyImage from 'astro-remark-eleventy-image'
import remarkToc from 'remark-toc'
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'

import db from '@astrojs/db'

import vercel from '@astrojs/vercel'

// https://astro.build/config
export default defineConfig({
  site: 'https://example.com',

  integrations: [
    mdx(),
    sitemap(),
    tailwind(),
    vue(),
    remarkEleventyImage(),
    db(),
  ],

  vite: {
    ssr: {
      external: ['@11ty/eleventy-img'],
    },
  },

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
        dark: 'catppuccin-mocha',
      },
      transformers: [transformerNotationDiff()],
    },
  },

  image: {
    service: imageService({
      placeholder: 'blurhash',
      fallbackService: 'uploadcare',
    }),
  },

  adapter: vercel(),
})
