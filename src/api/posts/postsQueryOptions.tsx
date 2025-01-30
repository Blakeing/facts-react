import { queryOptions } from "@tanstack/react-query";

import { fetchPosts } from "@/api/posts";

export const postsQueryOptions = queryOptions({
	queryKey: ["posts"],
	queryFn: () => fetchPosts(),
});
