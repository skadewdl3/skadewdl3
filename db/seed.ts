import { db, Comment } from 'astro:db'

export default async function () {
  await db.insert(Comment).values([
    {
      postSlug: '1-marching-squares',
      name: 'Soham',
      email: 'sohamk1@gmail.com',
      message: 'Great post!',
      createdAt: new Date(),
    },
    {
      postSlug: '1-marching-squares',
      name: 'Soham2',
      email: 'soham2@gmail.com',
      message: 'W Post',
      createdAt: new Date(),
    },
  ])
}
