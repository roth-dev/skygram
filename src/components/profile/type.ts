import { AppBskyActorDefs } from "@atproto/api";

export type UserProfileProps = {
  isOwner?: boolean;
  shouldHeaderReady?: boolean;
  profile: AppBskyActorDefs.ProfileViewDetailed;
};
