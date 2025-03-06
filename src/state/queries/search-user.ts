import { useQueryClient } from "@tanstack/react-query";
import { useAgent } from "../session";
import { useCallback } from "react";

const searchUserQueryKeyRoot = "search-user";
const searchPostsQueryKey = (query: string) => [searchUserQueryKeyRoot, query];

export function useSearchUser() {
  const queryClient = useQueryClient();
  const agent = useAgent();

  const searchUser = useCallback(
    async (query: string) => {
      return queryClient.fetchQuery({
        queryKey: searchPostsQueryKey(query),
        queryFn: async () => {
          return await agent.searchActors({
            term: query,
          });
        },
      });
    },
    [agent]
  );

  return { searchUser };
}
