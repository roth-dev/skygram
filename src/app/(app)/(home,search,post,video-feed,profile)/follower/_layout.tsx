import Layout from "@/components/Layout";
import { Pager, PagerRef } from "@/components/pager/Pager";
import { PagerWithHeader } from "@/components/pager/PagerWithHeader";
import ProfileFollower from "@/components/profile/profile-follower";
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

  const [selectedIndex, setSelectedIndex] = useState(() => initialPage);

  const { data: resolvedDid } = useResolveDidQuery(route.handle);
  const { data: profile } = useProfileQuery({
    did: resolvedDid,
  });

  const pagerRef = useRef<PagerRef>(null);
  const onPageSelected = useCallback((index: number) => {
    setSelectedIndex(index);
  }, []);

  const pageTitles = useMemo(() => {
    return [
      `${formatNumberToKOrM(profile?.followersCount ?? 0)} Followers`,
      `${formatNumberToKOrM(profile?.followsCount ?? 0)} Following`,
    ];
  }, [profile]);

  return (
    <Layout.Screen title={sanitizeDisplayName(profile?.handle ?? "")}>
      <PagerWithHeader
        ref={pagerRef}
        testID="followerScreen"
        items={pageTitles}
        isHeaderReady
        initialPage={initialPage}
        onPageSelected={onPageSelected}
      >
        {() => <ProfileFollower key="followerTab" did={route.did} />}
        {() => <ProfileFollower key="followeringTab" did={route.did} />}
      </PagerWithHeader>
    </Layout.Screen>
  );
}
