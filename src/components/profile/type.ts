import { AppBskyActorDefs } from "@atproto/api";

export type UserProfileProps = {
  isOwner?: boolean;
  profile: AppBskyActorDefs.ProfileViewDetailed;
};
