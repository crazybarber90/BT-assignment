'use client'

import { useTRPC } from '@/trpc/client'
import { useQuery } from '@tanstack/react-query'
import React, { use } from 'react'
import { useRouter } from 'next/navigation'

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  const unwrappedParams = use(params)
  const router = useRouter()

  const memberId = Number(unwrappedParams?.id)

  if (!unwrappedParams?.id || isNaN(memberId)) {
    return <div className="text-red-600 font-bold">Invalid or missing ID!</div>
  }

  const trpc = useTRPC()

  const { data: member, isLoading } = useQuery(
    trpc.members.getById.queryOptions({ id: memberId })
  )

  const { data: history } = useQuery(
    trpc.members.getHistory.queryOptions({ memberId })
  )

  if (isLoading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center z-50 bg-background">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 border-4 border-t-transparent border-(--primary) rounded-full animate-spin mb-4"></div>
          <p className="font-semibold text-lg animate-pulse text-foreground">
            Loading member data...
          </p>
        </div>
      </div>
    )
  }

  if (!member)
    return <div className="text-red-600 font-bold">Member not found</div>

  return (
    <div className="p-6 space-y-6 min-h-screen bg-background text-foreground">
      <h1 className="text-2xl font-extrabold text-(--primary)">
        Member {member.id}: {member.firstName} {member.lastName}
      </h1>

      <button
        onClick={() => router.back()}
        className="px-4 py-2 rounded-md font-semibold shadow-md transition transform hover:scale-105 bg-(--secondary) text-(--primary)"
      >
        ← Back
      </button>

      <section className="rounded-lg p-4 shadow-md bg-(--secondary) text-background">
        <h2 className="text-lg text-(--primary) font-semibold mb-2">
          Canonical Fields
        </h2>
        <pre className="p-4 rounded overflow-x-auto bg-background text-foreground">
          {JSON.stringify(
            {
              ...member,
              dob: member.dob
                ? new Date(member.dob).toISOString().split('T')[0]
                : null,
            },
            null,
            2
          )}
        </pre>
      </section>

      <section className="rounded-lg p-4 shadow-md bg-(--secondary) text-background">
        <h2 className="text-lg font-semibold mb-2 text-(--primary)">History</h2>
        <pre className="p-4 rounded overflow-x-auto bg-background text-foreground">
          {JSON.stringify(history, null, 2)}
        </pre>
      </section>
    </div>
  )
}
