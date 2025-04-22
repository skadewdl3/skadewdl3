import { defineAction } from 'astro:actions'
import { z } from 'astro:schema'

import { db, Comment, Like } from 'astro:db'

export const addComment = defineAction({
  input: z.object({
    slug: z.string().min(1, 'Post slug is required'),
    name: z.string().min(1, 'Name is required'),
    email: z.string().email('Valid email is required'),
    message: z.string().min(1, 'Comment message is required'),
    createdAt: z.coerce.date().optional().default(new Date()),
  }),
  async handler({ slug, name, email, message, createdAt }) {
    try {
      const newComment = await db
        .insert(Comment)
        .values({
          postSlug: slug,
          name,
          email,
          message,
          createdAt,
        })
        .returning()

      return {
        success: true,
        data: newComment[0],
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to add comment',
      }
    }
  },
})

export const addLike = defineAction({
  input: z.object({
    slug: z.string().min(1, 'Post slug is required'),
    createdAt: z.coerce.date().optional().default(new Date()),
    name: z.string().min(1, 'Name is required'),
    email: z.string().email('Valid email is required'),
  }),
  async handler({ slug, name, email, createdAt }) {
    try {
      const newLike = await db
        .insert(Like)
        .values({
          postSlug: slug,
          name,
          email,
          createdAt,
        })
        .returning()

      return {
        success: true,
        data: newLike[0],
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to add like',
      }
    }
  },
})

export const server = {
  addComment,
  addLike,
}
