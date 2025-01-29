// import { useEffect, useState } from 'react'

// import { UserService } from '../../../api/services/user.service'

// import type { User } from '../../../models/user.model'

// export const useDashboardData = () => {
//   const [users, setUsers] = useState<User[]>([])
//   const [loading, setLoading] = useState(true)
//   const [error, setError] = useState<string | null>(null)

//   useEffect(() => {
//     const fetchDashboardData = async () => {
//       try {
//         const response = await UserService.getUsers()
//         setUsers(response.data)
//       } catch (err) {
//         setError(err instanceof Error ? err.message : 'An error occurred')
//       } finally {
//         setLoading(false)
//       }
//     }

//     fetchDashboardData()
//   }, [])

//   const activeUsers = users.length // In a real app, you'd filter by active status
//   const recentActivity = users.slice(-5) // Last 5 users

//   return {
//     users,
//     activeUsers,
//     recentActivity,
//     loading,
//     error,
//   }
// }
