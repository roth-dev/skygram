import { UserProfileProps } from "./type";
import { View } from "../ui";
import { memo, useCallback, useRef, useState } from "react";
import UserProfileHeader from "./user-profile-header";
import { PagerRef } from "../pager/Pager";
import { useSetMinimalShellMode } from "@/state/shell/minimal-mode";
import { emitSoftReset } from "@/state/events";
import { PagerWithHeader } from "../pager/PagerWithHeader";
import MainFeed from "../feed/main-feed";
import { useModerationOpts } from "@/state/prefs/moderation-opts";
import { ListRef } from "../List";
export interface ExpoScrollForwarderViewProps {
  scrollViewTag: number | null;
  children: React.ReactNode;
}

export function ExpoScrollForwarderView({
  children,
}: React.PropsWithChildren<ExpoScrollForwarderViewProps>) {
  return children;
}

export default memo(function UserProfile({
  profile,
  isOwner,
}: UserProfileProps) {
  const setMinimalShellMode = useSetMinimalShellMode();
  const [selectedIndex, setSelectedIndex] = useState(0);
  const pagerRef = useRef<PagerRef>(null);
  const moderationOpts = useModerationOpts();
  const [scrollViewTag, setScrollViewTag] = useState<number | null>(null);
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

  const pageTitles = ["Post", "Video", "Media", "Liked"];

  const TABS = ["Post", "Video", "Replied"];

  const renderHeader = ({
    setMinimumHeight,
  }: {
    setMinimumHeight: (height: number) => void;
  }) => {
    return (
      <UserProfileHeader
        isOwner={isOwner}
        profile={profile}
        // labeler={labelerInfo}
        // descriptionRT={hasDescription ? descriptionRT : null}
        // moderationOpts={moderationOpts}
        // hideBackButton={hideBackButton}
        // isPlaceholderProfile={showPlaceholder}
      />
    );
  };

  return (
    <View style={{ flex: 1 }}>
      <PagerWithHeader
        key={"profilePager"}
        ref={pagerRef}
        testID="homeScreen"
        items={pageTitles}
        isHeaderReady
        renderHeader={renderHeader}
        initialPage={selectedIndex}
        onPageSelected={onPageSelected}
        allowHeaderOverScroll
        // onPageScrollStateChanged={onPageScrollStateChanged}
      >
        {({ scrollElRef, isFocused, headerHeight }) => {
          return (
            <MainFeed
              renderEmptyState={() => <></>}
              headerOffset={headerHeight}
              scrollElRef={scrollElRef as ListRef}
              feed={`author|${profile.did}|posts_and_author_threads`}
              ignoreFilterFor={profile.did}
            />
          );
        }}
      </PagerWithHeader>
    </View>
  );
});
