// import { useEffect, useState } from 'react'

// import { UserService } from '../../../api/services/user.service'

// import type { User } from '../../../models/user.model'

// export const useUsers = () => {
//   const [users, setUsers] = useState<User[]>([])
//   const [loading, setLoading] = useState(true)
//   const [error, setError] = useState<string | null>(null)

//   useEffect(() => {
//     const fetchUsers = async () => {
//       try {
//         const response = await UserService.getUsers()
//         setUsers(response.data)
//       } catch (err) {
//         setError(err instanceof Error ? err.message : 'An error occurred')
//       } finally {
//         setLoading(false)
//       }
//     }

//     fetchUsers()
//   }, [])

//   return { users, loading, error }
// }
