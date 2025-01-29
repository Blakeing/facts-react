// import React from 'react'

// import { useUsers } from '../hooks/useUsers'

// import type { User } from '../../../models/user.model'

// export const UserList: React.FC = () => {
//   const { users, loading, error } = useUsers()

//   if (loading) return <div>Loading...</div>
//   if (error) return <div>Error: {error}</div>

//   return (
//     <div>
//       {users.map((user: User) => (
//         <div key={user.id}>
//           {user.firstName} {user.lastName}
//         </div>
//       ))}
//     </div>
//   )
// }
