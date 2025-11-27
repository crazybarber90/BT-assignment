// 'use client'

// import { useTRPC } from '@/trpc/client'
// import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
// import { useState } from 'react'

// export default function MembersPage() {
//   const trpc = useTRPC()
//   const queryClient = useQueryClient()

//   const { data: members, isLoading } = useQuery(
//     trpc.members.list.queryOptions()
//   )

//   const uploadMutation = useMutation(
//     trpc.members.uploadCSV.mutationOptions({
//       onSuccess: () => {
//         queryClient.invalidateQueries({
//           queryKey: trpc.members.list.queryKey(),
//         })
//       },
//     })
//   )

//   const [csvText, setCsvText] = useState('')

//   const handleUpload = () => {
//     uploadMutation.mutate({ csvText })
//   }

//   return (
//     <div className="p-6">
//       <h1 className="text-xl font-bold mb-4">Members</h1>

//       <textarea
//         className="border p-2 w-full h-32"
//         value={csvText}
//         onChange={(e) => setCsvText(e.target.value)}
//       />

//       <button
//         className="mt-2 px-4 py-2 bg-blue-600 text-white"
//         onClick={handleUpload}
//       >
//         Upload CSV
//       </button>

//       <div className="mt-6">
//         {isLoading ? (
//           <p>Loading...</p>
//         ) : (
//           <ul className="space-y-2">
//             {members?.map((m) => (
//               <li
//                 key={m.id}
//                 className="border p-2 cursor-pointer hover:bg-gray-100"
//                 onClick={() => (window.location.href = `/members/${m.id}`)}
//               >
//                 {m.id} – {m.firstName} {m.lastName} (
//                 {m.dob ? new Date(m.dob).toLocaleDateString('sr-RS') : 'N/A'})
//               </li>
//             ))}
//           </ul>
//         )}
//       </div>
//     </div>
//   )
// }
