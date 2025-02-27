import { HStack, Text, View, VStack } from "@/components/ui";
import { Button } from "@/components/ui/button";
import { Image } from "expo-image";
import { RichText } from "../ui/rich-text";

import useRichText from "@/hooks/useRichText";
import { router } from "expo-router";
import { UserProfileProps } from "./type";

export default function UserProfileHeader({
  profile,
  isOwner,
}: UserProfileProps) {
  const [richText] = useRichText(profile?.description ?? "");

  return (
    <View className="gap-2 ">
      <VStack className="p-3">
        <HStack className="items-center">
          <View className="h-20 w-20 rounded-full border border-gray-200 overflow-hidden bg-gray-300 ">
            <Image
              source={{ uri: profile.avatar }}
              contentFit="contain"
              style={{ width: "100%", height: "100%" }}
            />
          </View>
          <Button variant="ghost">
            <VStack className="items-center">
              <Button.Text>Post</Button.Text>
              <Button.Text font="semiBold">{profile.postsCount}</Button.Text>
            </VStack>
          </Button>
          <Button variant="ghost">
            <VStack className="items-center">
              <Button.Text>Followers</Button.Text>
              <Button.Text font="semiBold">
                {profile.followersCount}
              </Button.Text>
            </VStack>
          </Button>
          <Button variant="ghost">
            <VStack className="items-center">
              <Button.Text>Following</Button.Text>
              <Button.Text font="semiBold">{profile.followsCount}</Button.Text>
            </VStack>
          </Button>
        </HStack>
        <VStack>
          <Text font="extrabold">{profile.displayName}</Text>
          <Text size="sm">@{profile.handle}</Text>
          {!!richText && (
            <RichText value={richText} enableTags size="sm" numberOfLines={4} />
          )}
        </VStack>
        <HStack className="py-3">
          {isOwner ? (
            <Button
              onPress={() => {
                router.push("/(public)/user-profile/edit");
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
    </View>
  );
}
