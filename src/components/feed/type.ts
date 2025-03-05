import { SavedFeedSourceInfo } from "@/state/queries/feed";
import {
  FeedDescriptor,
  FeedParams,
  FeedPostSlice,
  FeedPostSliceItem,
} from "@/state/queries/post-feed";
import { AppBskyActorDefs } from "@atproto/api";
import { StyleProp, ViewStyle } from "react-native";
import { ListRef } from "../List";

export type FeedRow =
  | {
      type: "loading";
      key: string;
    }
  | {
      type: "empty";
      key: string;
    }
  | {
      type: "error";
      key: string;
    }
  | {
      type: "loadMoreError";
      key: string;
    }
  | {
      type: "feedShutdownMsg";
      key: string;
    }
  | {
      type: "fallbackMarker";
      key: string;
    }
  | {
      type: "sliceItem";
      key: string;
      slice: FeedPostSlice;
      indexInSlice: number;
      showReplyTo: boolean;
    }
  | {
      type: "videoGridRowPlaceholder";
      key: string;
    }
  | {
      type: "videoGridRow";
      key: string;
      items: FeedPostSliceItem[];
      sourceFeedUri: string;
      feedContexts: (string | undefined)[];
    }
  | {
      type: "sliceViewFullThread";
      key: string;
      uri: string;
    }
  | {
      type: "interstitialFollows";
      key: string;
    }
  | {
      type: "interstitialProgressGuide";
      key: string;
    }
  | {
      type: "interstitialTrending";
      key: string;
    }
  | {
      type: "interstitialTrendingVideos";
      key: string;
    };

export interface FeedProps {
  testID?: string;
  feed: FeedDescriptor;
  feedParams?: FeedParams;
  isPageFocused: boolean;
  isPageAdjacent: boolean;
  extraData?: any;
  renderEmptyState: () => JSX.Element;
  renderEndOfFeed?: () => JSX.Element;
  savedFeedConfig?: AppBskyActorDefs.SavedFeed;
  feedInfo: SavedFeedSourceInfo;
}

export interface MainFeedProps
  extends Omit<FeedProps, "isPageFocused" | "isPageAdjacent" | "feedInfo"> {
  ignoreFilterFor?: string;
  style?: StyleProp<ViewStyle>;
  enabled?: boolean;
  pollInterval?: number;
  disablePoll?: boolean;
  scrollElRef?: ListRef;
  onHasNew?: (v: boolean) => void;
  onScrolledDownChange?: (isScrolledDown: boolean) => void;
  headerOffset?: number;
  progressViewOffset?: number;
  desktopFixedHeightOffset?: number;
  ListHeaderComponent?: () => JSX.Element;
  savedFeedConfig?: AppBskyActorDefs.SavedFeed;
  initialNumToRender?: number;
  isVideoFeed?: boolean;
}
