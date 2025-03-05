import Feed from "@/components/feed";
import { HomeHeader } from "@/components/home/HomeHeader";
import Layout from "@/components/Layout";
import { Pager, PagerRef, RenderTabBarFnProps } from "@/components/pager/Pager";
import { Text } from "@/components/ui";
import { emitSoftReset } from "@/state/events";
import { usePinnedFeedsInfos } from "@/state/queries/feed";
import { FeedParams } from "@/state/queries/post-feed";
import { usePreferencesQuery } from "@/state/queries/prefs";
import { useSetMinimalShellMode } from "@/state/shell/minimal-mode";
import { Stack } from "expo-router";
import { useCallback, useMemo, useRef, useState } from "react";
import { ActivityIndicator, SafeAreaView } from "react-native";

export default function HomeScreen() {
  const { data: preferences } = usePreferencesQuery();
  const { data: pinnedFeedInfos, isLoading: isPinnedFeedsLoading } =
    usePinnedFeedsInfos();
  const setMinimalShellMode = useSetMinimalShellMode();
  const [selectedIndex, setSelectedIndex] = useState(0);
  const pagerRef = useRef<PagerRef>(null);

  const onPageSelected = useCallback((index: number) => {
    setSelectedIndex(index);
  }, []);

  const onPageScrollStateChanged = useCallback(
    (state: "idle" | "dragging" | "settling") => {
      "worklet";
      if (state === "dragging") {
        setMinimalShellMode(false);
      }
    },
    [setMinimalShellMode]
  );

  const onPressSelected = useCallback(() => {
    emitSoftReset();
  }, []);

  const allFeeds = useMemo(
    () => (pinnedFeedInfos ?? []).map((f) => f.feedDescriptor),
    [pinnedFeedInfos]
  );

  const homeFeedParams = useMemo<FeedParams>(() => {
    return {
      mergeFeedEnabled: Boolean(
        preferences?.feedViewPrefs.lab_mergeFeedEnabled
      ),
      mergeFeedSources: preferences?.feedViewPrefs.lab_mergeFeedEnabled
        ? preferences.savedFeeds
            .filter((f) => f.type === "feed" || f.type === "list")
            .map((f) => f.value)
        : [],
    };
  }, [preferences]);

  const renderTabBar = useCallback(
    (props: RenderTabBarFnProps) => {
      return (
        <HomeHeader
          key="FEEDS_TAB_BAR"
          {...props}
          testID="homeScreenFeedTabs"
          onPressSelected={onPressSelected}
          feeds={pinnedFeedInfos ?? []}
          onSelect={(index) => {
            pagerRef.current?.setPage(index);
            pagerRef.current?.setPageWithoutAnimated(index);
            setSelectedIndex(index);
          }}
        />
      );
    },
    [onPressSelected, pinnedFeedInfos]
  );

  let screen = (
    <ActivityIndicator
      size="large"
      className="flex-1 items-center justify-center"
    />
  );
  if (preferences && pinnedFeedInfos && !isPinnedFeedsLoading) {
    screen = (
      <Pager
        key={allFeeds?.join(",")}
        ref={pagerRef}
        testID="homeScreen"
        swipeEnabled={false}
        initialPage={selectedIndex}
        onPageSelected={onPageSelected}
        onPageScrollStateChanged={onPageScrollStateChanged}
        renderTabBar={renderTabBar}
      >
        {pinnedFeedInfos &&
          pinnedFeedInfos.length &&
          pinnedFeedInfos.map((feedInfo, index) => {
            const feed = feedInfo.feedDescriptor;
            const isFollowing = feed === "following";
            const savedFeedConfig = feedInfo.savedFeed;
            return (
              <Feed
                key={feed}
                testID="customFeedPage"
                isPageFocused={selectedIndex === index}
                feed={feedInfo.feedDescriptor}
                feedParams={homeFeedParams}
                renderEmptyState={() => <Text>No feed</Text>}
                renderEndOfFeed={() => <Text>End of feed</Text>}
                feedInfo={feedInfo}
                savedFeedConfig={isFollowing ? undefined : savedFeedConfig}
                isPageAdjacent={Math.abs(selectedIndex - index) === 1}
              />
            );
          })}
      </Pager>
    );
  }

  return <Layout.Tab safeArea>{screen}</Layout.Tab>;
}
