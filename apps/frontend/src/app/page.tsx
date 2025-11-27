'use client'

import { useState } from 'react'
import { useTRPC } from '@/trpc/client'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import Link from 'next/link'

export default function HomePage() {
  const trpc = useTRPC()
  const queryClient = useQueryClient()
  const [csv, setCsv] = useState('')

  const { data: members, isLoading } = useQuery(
    trpc.members.list.queryOptions()
  )

  const uploadMutation = useMutation(
    trpc.members.uploadCSV.mutationOptions({
      onSuccess: () =>
        queryClient.invalidateQueries({
          queryKey: trpc.members.list.queryKey(),
        }),
    })
  )

  const handleUpload = () => {
    uploadMutation.mutate({ csvText: csv })
  }

  if (isLoading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-gray-900 z-50">
        <div className="flex flex-col items-center">
          {/* Spinner */}
          <div className="w-16 h-16 border-4 border-t(--primary) border-b(--secondary) border-l-(--secondary) border-r-(--primary) rounded-full animate-spin mb-4"></div>
          <p className="text(--primary) font-bold text-lg animate-pulse">
            Loading members...
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen p-6 bg-gray-400 text-white space-y-6">
      <h1 className="text-3xl font-extrabold text-(--primary)">Member List</h1>

      {/* CSV Upload */}
      <div className="space-y-3">
        <textarea
          className="w-full p-4 rounded-lg border-2 border-gray-700 bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-(--primary)"
          rows={6}
          value={csv}
          onChange={(e) => setCsv(e.target.value)}
          placeholder="Paste CSV here..."
        />
        <button
          onClick={handleUpload}
          className="w-full py-3 rounded-lg bg-linear-to-r from-(--primary) to-(--secondary) text-white font-semibold shadow-md hover:scale-101 hover:from-(--primary) hover:to(--secondary) active:scale-95 transform transition cursor-pointer"
        >
          Upload CSV
        </button>
      </div>

      {/* Member List */}
      <div className="space-y-4">
        {members?.map((m: any) => (
          <Link
            href={`/members/${m.id}`}
            key={m.id}
            className="block p-4 rounded-lg bg-gray-800 hover:bg-gray-700 shadow-md transition"
          >
            <h2 className="text-(--primary) font-bold text-lg">
              {m.firstName} {m.lastName}
            </h2>
            <p className="text-gray-300">ID: {m.id}</p>
            <p className="text-gray-300">
              DOB: {m.dob ? new Date(m.dob).toISOString().split('T')[0] : 'N/A'}
            </p>
            <p className="text-gray-400">{m.city}</p>
            <p
              className={`mt-1 font-semibold ${
                m.status === 'active' ? 'text(--primary)' : 'text-red-400'
              }`}
            >
              {m.status}
            </p>
          </Link>
        ))}
      </div>
    </div>
  )
}
