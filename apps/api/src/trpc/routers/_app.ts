import { createTRPCRouter } from '../init'
import { exampleRouter } from './example'
import { demoRouter } from './demo'
import { membersRouter } from './members'

export const appRouter = createTRPCRouter({
  example: exampleRouter,
  demo: demoRouter,
  members: membersRouter,
})

export type AppRouter = typeof appRouter
