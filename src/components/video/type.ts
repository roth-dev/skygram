import { AuthorFilter } from "@/state/queries/post-feed";
import {
  AppBskyEmbedVideo,
  AppBskyFeedDefs,
  ModerationDecision,
} from "@atproto/api";

export type VideoFeedSourceContext =
  | {
      type: "feedgen";
      uri: string;
      sourceInterstitial: "discover" | "explore" | "none";
      initialPostUri?: string;
    }
  | {
      type: "author";
      did: string;
      filter: AuthorFilter;
      initialPostUri?: string;
    };

export type VideoItem = {
  moderation: ModerationDecision;
  post: AppBskyFeedDefs.PostView;
  video: AppBskyEmbedVideo.View;
  feedContext: string | undefined;
};
