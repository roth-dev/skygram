import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useAgent } from "../session";
import { STALE } from ".";
import { AppBskyActorDefs } from "@atproto/api";

import { useUnstableProfileViewCache } from "./unstable-profile-cache";

const RQKEY_ROOT = "profile";
export const RQKEY = (did: string) => [RQKEY_ROOT, did];

const profilesQueryKeyRoot = "profiles";
export const profilesQueryKey = (handles: string[]) => [
  profilesQueryKeyRoot,
  handles,
];

export function useProfileQuery({
  did,
  staleTime = STALE.SECONDS.FIFTEEN,
}: {
  did: string | undefined;
  staleTime?: number;
}) {
  const agent = useAgent();
  const { getUnstableProfile } = useUnstableProfileViewCache();
  return useQuery<AppBskyActorDefs.ProfileViewDetailed>({
    // WARNING
    // this staleTime is load-bearing
    // if you remove it, the UI infinite-loops
    // -prf
    staleTime,
    refetchOnWindowFocus: true,
    queryKey: RQKEY(did ?? ""),
    queryFn: async () => {
      const res = await agent.getProfile({ actor: did ?? "" });
      return res.data;
    },
    placeholderData: () => {
      if (!did) return;
      return getUnstableProfile(did) as AppBskyActorDefs.ProfileViewDetailed;
    },
    enabled: !!did,
  });
}

export function useProfilesQuery({
  handles,
  maintainData,
}: {
  handles: string[];
  maintainData?: boolean;
}) {
  const agent = useAgent();
  return useQuery({
    staleTime: STALE.MINUTES.FIVE,
    queryKey: profilesQueryKey(handles),
    queryFn: async () => {
      const res = await agent.getProfiles({ actors: handles });
      return res.data;
    },
    placeholderData: maintainData ? keepPreviousData : undefined,
  });
}
