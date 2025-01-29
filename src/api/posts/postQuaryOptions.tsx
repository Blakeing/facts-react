import { queryOptions } from '@tanstack/react-query'

import { fetchPost } from '@/api/posts'

export const postQueryOptions = (postId: string) =>
  queryOptions({
    queryKey: ['posts', { postId }],
    queryFn: () => fetchPost(postId),
  })
