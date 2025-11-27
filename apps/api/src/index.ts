import { trpcServer } from '@hono/trpc-server'
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { secureHeaders } from 'hono/secure-headers'
import { logger } from 'hono/logger'
import { createTRPCContext } from './trpc/init'
import { appRouter } from './trpc/routers/_app'
import { config } from './config'
import { checkDatabaseConnection } from './db/client'

// Check database connection on startup
try {
  console.log('🔍 Checking database connection...')
  await checkDatabaseConnection()
  console.log('✅ Database connection successful')
} catch (error) {
  console.error(' Database connection failed')
  console.error(
    'Error:',
    error instanceof Error ? error.message : String(error)
  )
  console.error('\nTroubleshooting:')
  console.error('- Ensure your database is running')
  console.error('- Check DATABASE_URL in .env file')
  console.error(
    `- Current DATABASE_URL: ${
      process.env.DATABASE_URL?.replace(/:[^:@]+@/, ':****@') || 'NOT SET'
    }`
  )
  process.exit(1)
}

const app = new Hono()

app.use(secureHeaders())

app.use('*', logger())

app.use(
  '*',
  cors({
    origin: process.env.ALLOWED_API_ORIGINS?.split(',') ?? [],
    allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowHeaders: [
      'Authorization',
      'Content-Type',
      'accept-language',
      'x-trpc-source',
      'x-user-locale',
      'x-user-timezone',
      'x-user-country',
    ],
    exposeHeaders: ['Content-Length'],
    maxAge: 86400,
    credentials: true,
  })
)

app.use(
  '/trpc/*',
  trpcServer({
    router: appRouter,
    createContext: createTRPCContext,
  })
)

const SERVER_ID =
  process.env.SERVER_ID || Math.random().toString(36).substring(2, 15)

app.get('/health', (c) => {
  const healthData = {
    status: 'ok',
    timestamp: new Date().toISOString(),
    serverId: SERVER_ID,
    hostname: process.env.HOSTNAME || 'unknown',
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    userAgent: c.req.header('User-Agent') || 'unknown',
    environment: config.server.environment,
  }

  // Log health check requests for debugging
  console.log(
    `🔍 Health check from: ${c.req.header('User-Agent') || 'unknown'} - ${
      c.req.header('X-Forwarded-For') || c.req.header('X-Real-IP') || 'direct'
    }`
  )

  return c.json(healthData)
})

app.get('/', (c) => {
  return c.json({
    message: 'CSV members API',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      trpc: '/trpc',
    },
  })
})

export default {
  port: config.server.port,
  fetch: app.fetch,
}
