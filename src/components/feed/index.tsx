import {
  ActivityIndicator,
  Dimensions,
  ListRenderItemInfo,
} from "react-native";
import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useSession } from "@/state/session";
import { List, ListMethods } from "@/components/List";
import {
  FeedPostSliceItem,
  RQKEY as FEED_RQKEY,
  usePostFeedQuery,
} from "@/state/queries/post-feed";
import { AppBskyEmbedVideo, AppBskyFeedDefs } from "@atproto/api";
import {
  DISCOVER_FEED_URI,
  KNOWN_SHUTDOWN_FEEDS,
  VIDEO_FEED_URIS,
} from "@/constants";
import { useBreakpoints } from "@/hooks/breakpoints";
import { isNative } from "@/platform/detection";
import { useWebMediaQueries } from "@/hooks/useWebMediaQueries";
import { useTrendingSettings } from "@/state/prefs/trending";
import { logEvent } from "@/statsig/statsig";
import { Text, View } from "@/components/ui";
import PostFeedItem from "@/components/feed/post-feed-item";
import { MainScrollProvider } from "@/context/main-scroll-provider";
import { FeedProps, FeedRow } from "./type";
import MainFeed from "./main-feed";
import { useHeaderOffset } from "@/hooks/useHeaderOffset";
import { useSetMinimalShellMode } from "@/state/shell/minimal-mode";
import { listenSoftReset } from "@/state/events";
import { truncateAndInvalidate } from "@/state/queries/util";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigation } from "expo-router";

export default function Feed({
  testID,
  isPageFocused,
  isPageAdjacent,
  feed,
  feedParams,
  renderEmptyState,
  renderEndOfFeed,
  savedFeedConfig,
  feedInfo,
  extraData,
}: FeedProps) {
  const [isPTRing, setIsPTRing] = useState(false);
  const lastFetchRef = useRef<number>(Date.now());
  const areVideoFeedsEnabled = isNative;
  const { hasSession } = useSession();
  const [hasNew, setHasNew] = useState(false);
  const [isScrolledDown, setIsScrolledDown] = useState(false);
  const headerOffset = useHeaderOffset();
  const scrollElRef = useRef<ListMethods>(null);
  const navigation = useNavigation();

  const queryClient = useQueryClient();
  const setMinimalShellMode = useSetMinimalShellMode();
  const isVideoFeed = useMemo(() => {
    const isBskyVideoFeed = VIDEO_FEED_URIS.includes(feedInfo.uri);
    const feedIsVideoMode =
      feedInfo.contentMode === AppBskyFeedDefs.CONTENTMODEVIDEO;
    const _isVideoFeed = isBskyVideoFeed || feedIsVideoMode;
    return isNative && _isVideoFeed;
  }, [feedInfo]);

  const scrollToTop = useCallback(() => {
    scrollElRef.current?.scrollToOffset({
      animated: isNative,
      offset: -headerOffset,
    });
    setMinimalShellMode(false);
  }, [headerOffset, setMinimalShellMode]);

  const onSoftReset = useCallback(() => {
    // const isScreenFocused =
    // getTabState(getRootNavigation(navigation).getState(), 'Home') ===
    // TabState.InsideAtRoot
    if (navigation.isFocused() && isPageFocused) {
      scrollToTop();
      truncateAndInvalidate(queryClient, FEED_RQKEY(feed));
      setHasNew(false);
      logEvent("feed:refresh", {
        feedType: feed.split("|")[0],
        feedUrl: feed,
        reason: "soft-reset",
      });
    }
  }, [navigation, isPageFocused, scrollToTop, queryClient, feed, setHasNew]);

  // fires when page within screen is activated/deactivated
  useEffect(() => {
    if (!isPageFocused) {
      return;
    }
    return listenSoftReset(onSoftReset);
  }, [onSoftReset, isPageFocused]);

  // const onPressCompose = useCallback(() => {
  //   openComposer({});
  // }, [openComposer]);

  const onPressLoadLatest = useCallback(() => {
    scrollToTop();
    truncateAndInvalidate(queryClient, FEED_RQKEY(feed));
    setHasNew(false);
    logEvent("feed:refresh", {
      feedType: feed.split("|")[0],
      feedUrl: feed,
      reason: "load-latest",
    });
  }, [scrollToTop, feed, queryClient, setHasNew]);

  return (
    <View testID={testID} className="flex-1">
      <MainScrollProvider>
        <MainFeed
          testID={testID ? `${testID}-feed` : undefined}
          enabled={isPageFocused}
          feed={feed}
          extraData={extraData}
          feedParams={feedParams}
          pollInterval={60e3}
          disablePoll={hasNew || !isPageFocused}
          scrollElRef={scrollElRef}
          onScrolledDownChange={setIsScrolledDown}
          onHasNew={setHasNew}
          renderEmptyState={renderEmptyState}
          renderEndOfFeed={renderEndOfFeed}
          headerOffset={headerOffset / 2}
          savedFeedConfig={savedFeedConfig}
          isVideoFeed={isVideoFeed}
        />
      </MainScrollProvider>
    </View>
  );
}
