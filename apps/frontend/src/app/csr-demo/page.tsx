'use client'

import { useTRPC } from '@/trpc/client'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'

export default function CSRDemoPage() {
  const [name, setName] = useState('Client Side')
  const [inputName, setInputName] = useState('')
  const queryClient = useQueryClient()
  const trpc = useTRPC()

  // Client-side data fetching using TRPC with react-query
  const {
    data: greetingData,
    isLoading: greetingLoading,
    refetch: refetchGreeting,
  } = useQuery(trpc.demo.greeting.queryOptions({ name }))

  const {
    data: posts,
    isLoading: postsLoading,
    refetch: refetchPosts,
  } = useQuery(trpc.demo.listPosts.queryOptions())

  const {
    data: stats,
    isLoading: statsLoading,
    refetch: refetchStats,
  } = useQuery(trpc.demo.getStats.queryOptions())

  // Mutation for adding posts
  const addPostMutation = useMutation(
    trpc.demo.addPost.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: trpc.demo.listPosts.queryKey(),
        })
        queryClient.invalidateQueries({
          queryKey: trpc.demo.getStats.queryKey(),
        })
      },
    })
  )

  const handleChangeName = () => {
    if (inputName.trim()) {
      setName(inputName)
      setInputName('')
    }
  }

  return (
    <div className="container mx-auto p-8 max-w-6xl">
      <h1 className="text-4xl font-bold mb-8">Client-Side Rendering Demo</h1>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-3">
            Greeting Endpoint (CSR)
          </h2>
          {greetingLoading ? (
            <div className="space-y-2">
              <div className="animate-pulse">
                <div className="h-6 bg-gray-300 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 mt-2"></div>
              </div>
            </div>
          ) : (
            <>
              <p className="text-gray-700 text-lg mb-2">
                {greetingData?.greeting}
              </p>
              <p className="text-sm text-gray-500">
                Fetched at:{' '}
                {greetingData &&
                  new Date(greetingData.timestamp).toLocaleTimeString()}
              </p>
            </>
          )}
          <div className="mt-4 flex gap-2">
            <input
              type="text"
              value={inputName}
              onChange={(e) => setInputName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleChangeName()}
              placeholder="Enter name..."
              className="flex-1 px-3 py-2 border rounded-md"
            />
            <button
              onClick={handleChangeName}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Change
            </button>
            <button
              onClick={() => refetchGreeting()}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            >
              Refetch
            </button>
          </div>
          <div className="mt-4 p-3 bg-orange-50 rounded">
            <p className="text-xs text-orange-700">
              This data is fetched from the browser after the page loads.
            </p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-3">Statistics (CSR)</h2>
          {statsLoading ? (
            <div className="space-y-2">
              <div className="animate-pulse">
                <div className="h-4 bg-gray-300 rounded w-full mb-2"></div>
                <div className="h-4 bg-gray-300 rounded w-full mb-2"></div>
                <div className="h-4 bg-gray-300 rounded w-full"></div>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Total Posts:</span>
                <span className="font-semibold">{stats?.totalPosts}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Total Items:</span>
                <span className="font-semibold">{stats?.totalItems}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Last Update:</span>
                <span className="text-sm">
                  {stats && new Date(stats.lastUpdate).toLocaleTimeString()}
                </span>
              </div>
            </div>
          )}
          <button
            onClick={() => refetchStats()}
            className="mt-3 px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 w-full"
          >
            Refresh Stats
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mt-6">
        <h2 className="text-xl font-semibold mb-4">Posts List (CSR)</h2>
        {postsLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="animate-pulse border-l-4 border-gray-300 pl-4 py-2"
              >
                <div className="h-5 bg-gray-300 rounded w-1/3 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-3 bg-gray-100 rounded w-1/4 mt-2"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {posts && posts.length > 0 ? (
              posts.map((post) => (
                <div
                  key={post.id}
                  className="border-l-4 border-blue-500 pl-4 py-2"
                >
                  <h3 className="font-semibold text-lg">{post.title}</h3>
                  <p className="text-gray-600 mt-1">{post.content}</p>
                  <p className="text-xs text-gray-400 mt-2">
                    Created: {new Date(post.createdAt).toLocaleDateString()}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-gray-500">No posts available</p>
            )}
          </div>
        )}

        <div className="mt-4 p-4 bg-gray-50 rounded">
          <h3 className="font-semibold mb-2">Add New Post</h3>
          <form
            onSubmit={(e) => {
              e.preventDefault()
              const formData = new FormData(e.currentTarget)
              const title = formData.get('title') as string
              const content = formData.get('content') as string
              if (title && content) {
                addPostMutation.mutate({ title, content })
                e.currentTarget.reset()
              }
            }}
            className="space-y-2"
          >
            <input
              name="title"
              type="text"
              placeholder="Post title..."
              className="w-full px-3 py-2 border rounded-md"
              required
            />
            <textarea
              name="content"
              placeholder="Post content..."
              className="w-full px-3 py-2 border rounded-md"
              rows={3}
              required
            />
            <button
              type="submit"
              disabled={addPostMutation.isPending}
              className="px-4 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-600 disabled:opacity-50"
            >
              {addPostMutation.isPending ? 'Adding...' : 'Add Post'}
            </button>
          </form>
        </div>

        <div className="mt-4 flex gap-2">
          <button
            onClick={() => refetchPosts()}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Refresh Posts
          </button>
        </div>

        <div className="mt-4 p-3 bg-yellow-50 rounded">
          <p className="text-xs text-yellow-700">
            Posts are fetched from the browser. Notice the loading states!
          </p>
        </div>
      </div>

      <div className="mt-8 p-6 bg-linear-to-r from-orange-50 to-red-50 rounded-lg">
        <h3 className="text-lg font-semibold mb-3">CSR Characteristics</h3>
        <ul className="space-y-2 text-sm">
          <li className="flex items-start">
            <span className="mr-2">✓</span>
            <span>Data is fetched after the page loads in the browser</span>
          </li>
          <li className="flex items-start">
            <span className="mr-2">✓</span>
            <span>Shows loading states while fetching data</span>
          </li>
          <li className="flex items-start">
            <span className="mr-2">✓</span>
            <span>Interactive and can refetch/update without page reload</span>
          </li>
          <li className="flex items-start">
            <span className="mr-2">✓</span>
            <span>Initial HTML is minimal, populated by JavaScript</span>
          </li>
        </ul>
      </div>
    </div>
  )
}
