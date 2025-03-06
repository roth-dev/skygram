import { HStack, Text, View, VStack } from "@/components/ui";
import { Button } from "@/components/ui/button";
import { RichText } from "../ui/rich-text";

import useRichText from "@/hooks/useRichText";
import { router } from "expo-router";
import { UserProfileProps } from "./type";
import { AppBskyActorDefs } from "@atproto/api";
import UserAvatar from "../UserAvatar";
import { useMemo } from "react";
import { useSession } from "@/state/session";
import { cn } from "@/lib/utils";
import Separetor from "../ui/separator";
import { formatNumberToKOrM } from "@/lib/numbers";

export default function UserProfileHeader({
  profile,
  isOwner,
}: UserProfileProps) {
  const { currentAccount } = useSession();
  const [richText] = useRichText(profile?.description ?? "");

  const knownFollowers = useMemo(() => {
    return profile.viewer?.knownFollowers?.followers.slice(0, 3) ?? [];
  }, [profile]);

  const isMe = useMemo(() => {
    return profile.did === currentAccount?.did;
  }, [profile]);
  return (
    <View className="gap-2">
      <VStack className="p-3 pb-0">
        <HStack className="items-center">
          <UserAvatar className="h-20 w-20" avatar={profile.avatar} />

          <Button variant="ghost">
            <VStack className="items-center gap-0">
              <Button.Text font="semiBold">
                {formatNumberToKOrM(profile.postsCount ?? 0)}
              </Button.Text>
              <Button.Text>Post</Button.Text>
            </VStack>
          </Button>
          <Button variant="ghost">
            <VStack className="items-center gap-0">
              <Button.Text font="semiBold">
                {formatNumberToKOrM(profile.followersCount ?? 0)}
              </Button.Text>
              <Button.Text>Follower</Button.Text>
            </VStack>
          </Button>
          <Button variant="ghost">
            <VStack className="items-center gap-0">
              <Button.Text font="semiBold">
                {formatNumberToKOrM(profile.followsCount ?? 0)}
              </Button.Text>
              <Button.Text>Following</Button.Text>
            </VStack>
          </Button>
        </HStack>
        <VStack>
          <Text font="extrabold" size="xl">
            {profile.displayName}
          </Text>
          <Text>@{profile.handle}</Text>
          {!!richText && <RichText value={richText} enableTags />}
        </VStack>

        {!isMe && knownFollowers.length > 0 && (
          <KnownFollower
            count={profile.viewer?.knownFollowers?.count ?? 0}
            profiles={knownFollowers}
          />
        )}

        <HStack className="py-3">
          {isOwner ? (
            <Button
              onPress={() => {
                router.push("/user-profile/edit");
              }}
              variant="secondary"
              className="flex-1"
            >
              <Button.Text font="semiBold">Edit Profile</Button.Text>
            </Button>
          ) : (
            <>
              <Button variant="secondary" className="flex-1">
                <Button.Text font="semiBold">Follow</Button.Text>
              </Button>
              <Button variant="secondary" className="flex-1">
                <Button.Text font="semiBold">Message</Button.Text>
              </Button>
            </>
          )}
        </HStack>
      </VStack>
      <Separetor />
    </View>
  );
}

function KnownFollower({
  profiles,
  count,
}: {
  count: number;
  profiles: AppBskyActorDefs.ProfileViewBasic[];
}) {
  const followersName = useMemo(() => {
    return profiles
      .map((user) => user.displayName)
      .filter(Boolean)
      .join(", ");
  }, [profiles]);

  const restFollowerCount = useMemo(() => {
    return count - profiles.length;
  }, [count, profiles]);

  return (
    <HStack className="gap-0 items-center ">
      {profiles.map((user, index) => {
        return (
          <UserAvatar
            style={{
              right: index === 0 ? 0 : index * 10,
            }}
            className={"border border-neutral-100"}
            key={user.did}
            avatar={user.avatar}
          />
        );
      })}
      <HStack
        className={cn(
          "gap-1",
          profiles.length === 1 ? "left-2" : "left-[-12px]"
        )}
      >
        <Text size="sm" numberOfLines={2}>
          Followed by{" "}
          <Text font="semiBold" size="sm" numberOfLines={1}>
            {followersName}
          </Text>
          {!!restFollowerCount && ` & ${restFollowerCount} others`}
        </Text>
      </HStack>
    </HStack>
  );
}
