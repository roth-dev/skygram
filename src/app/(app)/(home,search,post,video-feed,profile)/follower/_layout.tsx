import Layout from "@/components/Layout";
import { ListRef } from "@/components/List";
import { PagerRef } from "@/components/pager/Pager";
import { PagerWithHeader } from "@/components/pager/PagerWithHeader";
import ProfileFollower from "@/components/profile/profile-follower";
import { Text, View } from "@/components/ui";
import { formatNumberToKOrM } from "@/lib/numbers";
import { sanitizeDisplayName } from "@/lib/strings/display-names";
import { useProfileQuery } from "@/state/queries/profile";
import { useResolveDidQuery } from "@/state/queries/resolve-uri";
import { useLocalSearchParams } from "expo-router";
import { useCallback, useMemo, useRef, useState } from "react";

export default function FollowerScreen() {
  const route = useLocalSearchParams<{
    did: string;
    handle: string;
    type: "follower" | "following";
  }>();
  const initialPage = useMemo(
    () => (route.type === "following" ? 1 : 0),
    [route]
  );

  const { data: resolvedDid } = useResolveDidQuery(route.handle);
  const { data: profile } = useProfileQuery({
    did: resolvedDid,
  });

  const pagerRef = useRef<PagerRef>(null);
  const onPageSelected = useCallback((index: number) => {
    pagerRef.current?.setPage(index);
  }, []);

  const pageTitles = useMemo(() => {
    return [
      `${formatNumberToKOrM(profile?.followersCount ?? 0)} Followers`,
      `${formatNumberToKOrM(profile?.followsCount ?? 0)} Following`,
    ];
  }, [profile]);

  return (
    <Layout.Screen title={sanitizeDisplayName(route.handle)}>
      <View className="flex-1">
        <PagerWithHeader
          ref={pagerRef}
          key={"followerPager"}
          testID="followerScreen"
          items={pageTitles}
          isHeaderReady
          renderHeader={() => (
            <View>
              <Text>Hello</Text>
            </View>
          )}
          initialPage={initialPage}
          onPageSelected={onPageSelected}
        >
          {({ scrollElRef, isFocused, headerHeight }) => {
            return (
              <ProfileFollower
                key="followerTab"
                scrollElRef={scrollElRef as ListRef}
                did={route.did}
              />
            );
          }}
          {({ scrollElRef, isFocused, headerHeight }) => {
            return (
              <ProfileFollower
                key="followeringTab"
                scrollElRef={scrollElRef as ListRef}
                did={route.did}
              />
            );
          }}
        </PagerWithHeader>
      </View>
    </Layout.Screen>
  );
}
