import { useResolveDidQuery } from "@/state/queries/resolve-uri";
import { HStack, Text, View, VStack } from "../ui";
import { useProfileFollowsQuery } from "@/state/queries/profile-follows";
import { List } from "../List";
import { useCallback, useMemo, useState } from "react";
import { useInitialNumToRender } from "@/hooks/useInitialNumToRender";
import { useSession } from "@/state/session";
import { AppBskyActorDefs } from "@atproto/api";
import { ListRenderItemInfo, TouchableOpacity } from "react-native";
import { router } from "expo-router";
import UserAvatar from "../UserAvatar";
import { sanitizeDisplayName } from "@/lib/strings/display-names";
import { Button } from "../ui/button";
import { MainScrollProvider } from "@/context/main-scroll-provider";
import { useProfileQuery } from "@/state/queries/profile";

interface ProfileFollowItemProps {
  item: AppBskyActorDefs.ProfileView;
}
export function ProfileFollowerItem({ item }: ProfileFollowItemProps) {
  return (
    <TouchableOpacity
      onPress={() => {
        router.push({
          pathname: "/user-profile/[did]",
          params: {
            did: item.did,
          },
        });
      }}
    >
      <VStack className="gap-10 py-3 flex-1 px-3 border-b-[1px] border-slate-200">
        <HStack className="flex-1">
          <UserAvatar avatar={item.avatar} className="w-14 h-14" />
          <VStack className="gap-0 flex-1">
            {!!item.displayName && (
              <Text font="bold" numberOfLines={1}>
                {sanitizeDisplayName(item.displayName)}
              </Text>
            )}
            <Text size="sm" numberOfLines={1}>
              @{item.handle}
            </Text>
          </VStack>
          <Button className="flex-0 w-[80px] px-0 rounded-full">
            <Button.Text className="text-white" size="base" font="semiBold">
              {item.viewer?.following ? "Unfollow" : "Follow"}
            </Button.Text>
          </Button>
        </HStack>
      </VStack>
    </TouchableOpacity>
  );
}

function keyExtractor(item: AppBskyActorDefs.ProfileViewBasic) {
  return item.did;
}

type ProfileFollowType = "Following" | "Follower";

export default function ProfileFollower({ did }: { did: string }) {
  const initialNumToRender = useInitialNumToRender();
  const { currentAccount } = useSession();

  const [isPTRing, setIsPTRing] = useState(false);
  const {
    data: resolvedDid,
    isLoading: isDidLoading,
    error: resolveError,
  } = useResolveDidQuery(did);
  const {
    data,
    isLoading: isFollowsLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    error,
    refetch,
  } = useProfileFollowsQuery(resolvedDid);

  const { data: profile } = useProfileQuery({
    did: resolvedDid,
  });

  const follows = useMemo(() => {
    if (data?.pages) {
      return data.pages.flatMap((page) => page.follows);
    }
    return [];
  }, [data]);

  const onRefresh = useCallback(async () => {
    setIsPTRing(true);
    try {
      await refetch();
    } catch (err) {
      // logger.error('Failed to refresh follows', {error: err})
    }
    setIsPTRing(false);
  }, [refetch, setIsPTRing]);

  const onEndReached = useCallback(async () => {
    if (isFetchingNextPage || !hasNextPage || !!error) return;
    try {
      await fetchNextPage();
    } catch (err) {
      // logger.error('Failed to load more follows', {error: err})
    }
  }, [error, fetchNextPage, hasNextPage, isFetchingNextPage]);

  const renderItem = useCallback(
    ({ item }: ListRenderItemInfo<AppBskyActorDefs.ProfileView>) => {
      return <ProfileFollowerItem item={item} />;
    },
    []
  );

  return (
    <View className="flex-1">
      <MainScrollProvider>
        <List
          data={follows}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          refreshing={isPTRing}
          onRefresh={onRefresh}
          headerOffset={50}
          onEndReached={onEndReached}
          onEndReachedThreshold={4}
          // @ts-ignore our .web version only -prf
          desktopFixedHeight
          initialNumToRender={initialNumToRender}
        />
      </MainScrollProvider>
    </View>
  );
}
