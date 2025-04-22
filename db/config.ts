import { defineDb, defineTable, column } from 'astro:db'

const Comment = defineTable({
  columns: {
    id: column.number({ primaryKey: true }),
    postSlug: column.text(),
    name: column.text(),
    email: column.text(),
    message: column.text(),
    createdAt: column.date({ default: new Date() }),
    likes: column.number({ default: 0 }),
    replies: column.json({ default: [] }),
  },
})

const Like = defineTable({
  columns: {
    id: column.number({ primaryKey: true }),
    postSlug: column.text(),
    name: column.text(),
    email: column.text(),
    createdAt: column.date({ default: new Date() }),
  },
})

export default defineDb({
  tables: { Comment, Like },
})
