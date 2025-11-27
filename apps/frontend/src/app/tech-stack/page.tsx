export const dynamic = 'force-static'

export default function TechStackPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="max-w-5xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-5xl font-bold text-slate-900 dark:text-white mb-4">
            Tech Stack Overview
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-300">
            Complete guide to the technologies and patterns used in this
            assignment
          </p>
        </div>

        {/* Navigation */}
        <nav className="bg-white dark:bg-slate-800 rounded-lg p-6 mb-8 shadow-sm border border-slate-200 dark:border-slate-700">
          <h2 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-3">
            Quick Links
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-2 gap-3">
            <a
              href="#stack"
              className="text-blue-600 dark:text-blue-400 hover:underline"
            >
              Stack Overview
            </a>
            <a
              href="#trpc-backend"
              className="text-blue-600 dark:text-blue-400 hover:underline"
            >
              TRPC Backend
            </a>
            <a
              href="#trpc-frontend"
              className="text-blue-600 dark:text-blue-400 hover:underline"
            >
              TRPC Frontend
            </a>
            <a
              href="#database"
              className="text-blue-600 dark:text-blue-400 hover:underline"
            >
              Database
            </a>
          </div>
        </nav>

        {/* Main Content */}
        <div className="space-y-12">
          {/* Section 1: Stack Overview */}
          <section
            id="stack"
            className="bg-white dark:bg-slate-800 rounded-lg p-8 shadow-sm border border-slate-200 dark:border-slate-700"
          >
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-6">
              🏗️ Technology Stack
            </h2>

            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-200 mb-3">
                  Project Structure
                </h3>
                <ul className="space-y-2 text-slate-700 dark:text-slate-300">
                  <li>
                    <strong>Monorepo:</strong> Turborepo
                  </li>
                  <li>
                    <strong>Package Manager:</strong> Bun
                  </li>
                  <li>
                    <strong>Apps:</strong>{' '}
                    <code className="px-2 py-1 bg-slate-100 dark:bg-slate-700 rounded text-sm">
                      apps/frontend
                    </code>{' '}
                    (Next.js) +{' '}
                    <code className="px-2 py-1 bg-slate-100 dark:bg-slate-700 rounded text-sm">
                      apps/api
                    </code>{' '}
                    (Hono)
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-200 mb-3">
                  Backend Technologies
                </h3>
                <ul className="space-y-2 text-slate-700 dark:text-slate-300">
                  <li>
                    <strong>Runtime:</strong> Bun
                  </li>
                  <li>
                    <strong>Web Framework:</strong> Hono (fast, lightweight)
                  </li>
                  <li>
                    <strong>API Layer:</strong> TRPC v11 (type-safe APIs)
                  </li>
                  <li>
                    <strong>ORM:</strong> Drizzle ORM
                  </li>
                  <li>
                    <strong>Database:</strong> PostgreSQL
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-200 mb-3">
                  Frontend Technologies
                </h3>
                <ul className="space-y-2 text-slate-700 dark:text-slate-300">
                  <li>
                    <strong>Framework:</strong> Next.js 15 (App Router)
                  </li>
                  <li>
                    <strong>React:</strong> v19
                  </li>
                  <li>
                    <strong>API Client:</strong> TRPC Client + React Query
                  </li>
                  <li>
                    <strong>State Management:</strong> TanStack React Query v5
                  </li>
                  <li>
                    <strong>Styling:</strong> TailwindCSS v4
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* Section 2: TRPC Backend */}
          <section
            id="trpc-backend"
            className="bg-white dark:bg-slate-800 rounded-lg p-8 shadow-sm border border-slate-200 dark:border-slate-700"
          >
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-6">
              🔌 TRPC Backend Setup
            </h2>

            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-200 mb-3">
                  Creating TRPC Endpoints
                </h3>
                <p className="text-slate-700 dark:text-slate-300 mb-4">
                  TRPC endpoints are defined in router files. Each router
                  contains related procedures (queries or mutations).
                </p>

                <div className="bg-slate-900 rounded-lg p-4 overflow-x-auto">
                  <pre className="text-sm text-slate-100">
                    <code>{`// apps/api/src/trpc/routers/example.ts
import { z } from "zod";
import { publicProcedure, createTRPCRouter } from "../init";

export const exampleRouter = createTRPCRouter({
  // QUERY - Read data
  hello: publicProcedure.query(() => {
    return { message: "Hello World", timestamp: new Date() };
  }),

  // QUERY with input validation
  greeting: publicProcedure
    .input(z.object({ name: z.string() }))
    .query(({ input }) => {
      return { greeting: \`Hello, \${input.name}!\` };
    }),

  // MUTATION - Write data
  incrementCounter: publicProcedure
    .input(z.object({ amount: z.number() }))
    .mutation(({ input }) => {
      // Your database logic here
      return { newValue: input.amount + 1 };
    }),
});`}</code>
                  </pre>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-200 mb-3">
                  Key Concepts
                </h3>
                <ul className="space-y-2 text-slate-700 dark:text-slate-300">
                  <li>
                    <strong>Query:</strong> Use{' '}
                    <code className="px-2 py-1 bg-slate-100 dark:bg-slate-700 rounded text-sm">
                      .query()
                    </code>{' '}
                    for fetching data (GET)
                  </li>
                  <li>
                    <strong>Mutation:</strong> Use{' '}
                    <code className="px-2 py-1 bg-slate-100 dark:bg-slate-700 rounded text-sm">
                      .mutation()
                    </code>{' '}
                    for creating/updating data (POST)
                  </li>
                  <li>
                    <strong>Input Validation:</strong> Use{' '}
                    <code className="px-2 py-1 bg-slate-100 dark:bg-slate-700 rounded text-sm">
                      .input(zodSchema)
                    </code>{' '}
                    to validate incoming data
                  </li>
                  <li>
                    <strong>Type Safety:</strong> TypeScript types are
                    automatically inferred from your procedures
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-200 mb-3">
                  Registering Routers
                </h3>
                <p className="text-slate-700 dark:text-slate-300 mb-4">
                  After creating a router, register it in the main app router:
                </p>
                <div className="bg-slate-900 rounded-lg p-4 overflow-x-auto">
                  <pre className="text-sm text-slate-100">
                    <code>{`// apps/api/src/trpc/routers/_app.ts
import { exampleRouter } from "./example";

export const appRouter = createTRPCRouter({
  example: exampleRouter,  // Accessible as trpc.example.*
  // Add your routers here
});`}</code>
                  </pre>
                </div>
              </div>

              <div className="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 p-4 rounded">
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  <strong>📁 Reference File:</strong> Check out{' '}
                  <code className="px-2 py-1 bg-blue-100 dark:bg-blue-800 rounded">
                    apps/api/src/trpc/routers/demo.ts
                  </code>{' '}
                  for comprehensive examples including async operations and
                  database queries.
                </p>
              </div>
            </div>
          </section>

          {/* Section 3: TRPC Frontend */}
          <section
            id="trpc-frontend"
            className="bg-white dark:bg-slate-800 rounded-lg p-8 shadow-sm border border-slate-200 dark:border-slate-700"
          >
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-6">
              ⚛️ TRPC Frontend Usage
            </h2>

            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-200 mb-3">
                  The{' '}
                  <code className="px-2 py-1 bg-slate-100 dark:bg-slate-700 rounded">
                    useTRPC
                  </code>{' '}
                  Hook
                </h3>
                <p className="text-slate-700 dark:text-slate-300 mb-4">
                  The{' '}
                  <code className="px-2 py-1 bg-slate-100 dark:bg-slate-700 rounded text-sm">
                    useTRPC()
                  </code>{' '}
                  hook is your main interface to the TRPC client. It provides
                  type-safe access to all backend procedures.
                </p>

                <div className="bg-slate-900 rounded-lg p-4 overflow-x-auto mb-4">
                  <pre className="text-sm text-slate-100">
                    <code>{`"use client";

import { useTRPC } from "@/trpc/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export default function MyComponent() {
  const trpc = useTRPC();  // Get the TRPC client
  const queryClient = useQueryClient();

  // ... use trpc.router.procedure patterns below
}`}</code>
                  </pre>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-200 mb-3">
                  Pattern 1: Queries (Fetching Data)
                </h3>
                <p className="text-slate-700 dark:text-slate-300 mb-4">
                  Use{' '}
                  <code className="px-2 py-1 bg-slate-100 dark:bg-slate-700 rounded text-sm">
                    useQuery
                  </code>{' '}
                  with{' '}
                  <code className="px-2 py-1 bg-slate-100 dark:bg-slate-700 rounded text-sm">
                    .queryOptions()
                  </code>{' '}
                  to fetch data:
                </p>

                <div className="bg-slate-900 rounded-lg p-4 overflow-x-auto">
                  <pre className="text-sm text-slate-100">
                    <code>{`const trpc = useTRPC();

// Simple query (no input)
const { data, isLoading, error, refetch } = useQuery(
  trpc.demo.listPosts.queryOptions()
);

// Query with input parameters
const { data: greetingData } = useQuery(
  trpc.demo.greeting.queryOptions({ name: "John" })
);

// Conditional query (only fetch when enabled)
const { data: items } = useQuery({
  ...trpc.demo.getItems.queryOptions(),
  enabled: shouldFetch,  // Only fetch when true
});`}</code>
                  </pre>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-200 mb-3">
                  Pattern 2: Mutations (Creating/Updating Data)
                </h3>
                <p className="text-slate-700 dark:text-slate-300 mb-4">
                  Use{' '}
                  <code className="px-2 py-1 bg-slate-100 dark:bg-slate-700 rounded text-sm">
                    useMutation
                  </code>{' '}
                  with{' '}
                  <code className="px-2 py-1 bg-slate-100 dark:bg-slate-700 rounded text-sm">
                    .mutationOptions()
                  </code>{' '}
                  to modify data:
                </p>

                <div className="bg-slate-900 rounded-lg p-4 overflow-x-auto">
                  <pre className="text-sm text-slate-100">
                    <code>{`const trpc = useTRPC();
const queryClient = useQueryClient();

const addPostMutation = useMutation(
  trpc.demo.addPost.mutationOptions({
    onSuccess: () => {
      // Invalidate queries to refetch fresh data
      queryClient.invalidateQueries({
        queryKey: trpc.demo.listPosts.queryKey(),
      });
    },
    onError: (error) => {
      console.error("Failed to add post:", error);
    },
  })
);

// Use the mutation
const handleSubmit = () => {
  addPostMutation.mutate({
    title: "New Post",
    content: "Post content",
  });
};

// Check mutation state
if (addPostMutation.isPending) return <div>Saving...</div>;
if (addPostMutation.isError) return <div>Error!</div>;`}</code>
                  </pre>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-200 mb-3">
                  Pattern 3: Cache Invalidation
                </h3>
                <p className="text-slate-700 dark:text-slate-300 mb-4">
                  After mutations, invalidate related queries to refetch updated
                  data:
                </p>

                <div className="bg-slate-900 rounded-lg p-4 overflow-x-auto">
                  <pre className="text-sm text-slate-100">
                    <code>{`const queryClient = useQueryClient();
const trpc = useTRPC();

// Invalidate a specific query
queryClient.invalidateQueries({
  queryKey: trpc.demo.listPosts.queryKey(),
});

// Invalidate multiple queries
queryClient.invalidateQueries({
  queryKey: trpc.demo.listPosts.queryKey(),
});
queryClient.invalidateQueries({
  queryKey: trpc.demo.getStats.queryKey(),
});`}</code>
                  </pre>
                </div>
              </div>

              <div className="bg-green-50 dark:bg-green-900/20 border-l-4 border-green-500 p-4 rounded space-y-2">
                <p className="text-sm text-green-800 dark:text-green-200">
                  <strong>📁 Live Examples:</strong>
                </p>
                <ul className="text-sm text-green-800 dark:text-green-200 space-y-1 ml-4">
                  <li>
                    • <strong>Client-Side Rendering:</strong> Visit{' '}
                    <a href="/csr-demo" className="underline font-semibold">
                      /csr-demo
                    </a>{' '}
                    to see TRPC queries and mutations in action
                  </li>
                  <li>
                    • <strong>useTRPC Hook Usage:</strong> Check{' '}
                    <code className="px-2 py-1 bg-green-100 dark:bg-green-800 rounded">
                      apps/frontend/src/app/mixed-demo/client-component.tsx
                    </code>
                  </li>
                  <li>
                    • <strong>Complete CSR Pattern:</strong> Check{' '}
                    <code className="px-2 py-1 bg-green-100 dark:bg-green-800 rounded">
                      apps/frontend/src/app/csr-demo/page.tsx
                    </code>
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* Section 4: Database */}
          <section
            id="database"
            className="bg-white dark:bg-slate-800 rounded-lg p-8 shadow-sm border border-slate-200 dark:border-slate-700"
          >
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-6">
              🗄️ Database with Drizzle & Postgres
            </h2>

            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-200 mb-3">
                  Defining Database Schema
                </h3>
                <p className="text-slate-700 dark:text-slate-300 mb-4">
                  Define your tables in{' '}
                  <code className="px-2 py-1 bg-slate-100 dark:bg-slate-700 rounded text-sm">
                    apps/api/src/db/schema.ts
                  </code>
                  :
                </p>

                <div className="bg-slate-900 rounded-lg p-4 overflow-x-auto">
                  <pre className="text-sm text-slate-100">
                    <code>{`import { pgTable, integer, varchar, text, timestamp } from "drizzle-orm/pg-core";

export const membersTable = pgTable("members", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  firstName: varchar({ length: 255 }).notNull(),
  lastName: varchar({ length: 255 }).notNull(),
  email: varchar({ length: 255 }).notNull().unique(),
  dateOfBirth: timestamp().notNull(),
  createdAt: timestamp().defaultNow(),
  updatedAt: timestamp().defaultNow(),
});`}</code>
                  </pre>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-200 mb-3">
                  Using Drizzle in TRPC Procedures
                </h3>
                <p className="text-slate-700 dark:text-slate-300 mb-4">
                  Import the database client and use Drizzle's query builder:
                </p>

                <div className="bg-slate-900 rounded-lg p-4 overflow-x-auto">
                  <pre className="text-sm text-slate-100">
                    <code>{`import { db } from "../../db/client";
import { membersTable } from "../../db/schema";
import { eq } from "drizzle-orm";

export const membersRouter = createTRPCRouter({
  // SELECT query
  list: publicProcedure.query(async () => {
    return await db.select().from(membersTable);
  }),

  // SELECT with WHERE clause
  getById: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const [member] = await db
        .select()
        .from(membersTable)
        .where(eq(membersTable.id, input.id))
        .limit(1);
      return member;
    }),

  // INSERT mutation
  create: publicProcedure
    .input(z.object({
      firstName: z.string(),
      lastName: z.string(),
      email: z.string().email(),
    }))
    .mutation(async ({ input }) => {
      const [inserted] = await db
        .insert(membersTable)
        .values(input)
        .returning();
      return inserted;
    }),

  // UPDATE mutation
  update: publicProcedure
    .input(z.object({
      id: z.number(),
      firstName: z.string().optional(),
      lastName: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      const { id, ...updates } = input;
      const [updated] = await db
        .update(membersTable)
        .set(updates)
        .where(eq(membersTable.id, id))
        .returning();
      return updated;
    }),
});`}</code>
                  </pre>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-200 mb-3">
                  Pushing Schema to Database
                </h3>
                <p className="text-slate-700 dark:text-slate-300 mb-4">
                  After creating or modifying your database schema, use{' '}
                  <code className="px-2 py-1 bg-slate-100 dark:bg-slate-700 rounded text-sm">
                    db:push
                  </code>{' '}
                  to sync your schema directly to the database:
                </p>

                <div className="bg-slate-900 rounded-lg p-4 overflow-x-auto">
                  <pre className="text-sm text-slate-100">
                    <code>{`# Push schema changes directly to the database
bun run db:push`}</code>
                  </pre>
                </div>

                <p className="text-slate-700 dark:text-slate-300 mt-4 text-sm">
                  This command will automatically detect schema changes and
                  update your PostgreSQL database without generating migration
                  files. It's perfect for development and rapid prototyping.
                </p>
              </div>
            </div>
          </section>

          {/* Footer */}
          <div className="text-center py-8 text-slate-600 dark:text-slate-400">
            <p className="text-sm">
              For questions or issues, refer to the official documentation:
            </p>
            <div className="flex justify-center gap-4 mt-2 text-sm">
              <a
                href="https://trpc.io/docs"
                className="text-blue-600 dark:text-blue-400 hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                TRPC Docs
              </a>
              <span>•</span>
              <a
                href="https://tanstack.com/query/latest"
                className="text-blue-600 dark:text-blue-400 hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                React Query Docs
              </a>
              <span>•</span>
              <a
                href="https://orm.drizzle.team/docs/overview"
                className="text-blue-600 dark:text-blue-400 hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                Drizzle ORM Docs
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
