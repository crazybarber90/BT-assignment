import { z } from 'zod'
import { publicProcedure, createTRPCRouter } from '../init'

// In-memory data store for demo purposes
let posts = [
  {
    id: 1,
    title: 'First Post',
    content: 'This is the first post content',
    createdAt: new Date('2024-01-15').toISOString(),
  },
  {
    id: 2,
    title: 'Second Post',
    content: 'This is the second post content',
    createdAt: new Date('2024-02-20').toISOString(),
  },
  {
    id: 3,
    title: 'Third Post',
    content: 'This is the third post content',
    createdAt: new Date('2024-03-10').toISOString(),
  },
]

let items = [
  { id: 1, name: 'Item Alpha', description: 'Description for item alpha' },
  { id: 2, name: 'Item Beta', description: 'Description for item beta' },
  { id: 3, name: 'Item Gamma', description: 'Description for item gamma' },
]

export const demoRouter = createTRPCRouter({
  greeting: publicProcedure
    .input(z.object({ name: z.string().optional() }))
    .query(({ input }) => {
      return {
        greeting: `Hello ${input.name ?? 'World'}!`,
        timestamp: new Date().toISOString(),
      }
    }),

  listPosts: publicProcedure.query(async () => {
    // Add a small delay to show loading state in CSR
    await new Promise((resolve) => setTimeout(resolve, 300))
    return posts
  }),

  getItems: publicProcedure.query(async () => {
    // Add a small delay to show loading state
    await new Promise((resolve) => setTimeout(resolve, 500))
    return items
  }),

  addPost: publicProcedure
    .input(
      z.object({
        title: z.string().min(1),
        content: z.string().min(1),
      })
    )
    .mutation(({ input }) => {
      const newPost = {
        id: posts.length + 1,
        title: input.title,
        content: input.content,
        createdAt: new Date().toISOString(),
      }
      posts.push(newPost)
      return newPost
    }),

  getStats: publicProcedure.query(() => {
    return {
      totalPosts: posts.length,
      totalItems: items.length,
      lastUpdate: new Date().toISOString(),
    }
  }),
})
