import { View, Text } from "@/components/ui";
import { AppBskyEmbedExternal } from "@atproto/api";
import { useCallback, useRef } from "react";
import * as Webview from "expo-web-browser";
import { IconSymbol } from "../ui/IconSymbol";
import { HStack, VStack } from "../ui";
import { Pressable, View as RNView } from "react-native";
import { useLightboxControls } from "@/state/lightbox";
import { measureHandle } from "@/hooks/useHandleRef";
import { Image } from "expo-image";
import { runOnJS, runOnUI } from "react-native-reanimated";
import { findNodeHandle } from "react-native";

interface FeedLinkEmbedProps {
  embed: AppBskyEmbedExternal.View;
}

export default function FeedLinkEmbed({ embed }: FeedLinkEmbedProps) {
  const { openLightbox } = useLightboxControls();
  const imageRef = useRef<RNView>(null);

  const handlePress = useCallback(async () => {
    if (embed.external.uri) {
      await Webview.openBrowserAsync(embed.external.uri, {
        presentationStyle: Webview.WebBrowserPresentationStyle.PAGE_SHEET,
      });
    }
  }, [embed.external.uri]);

  const handleImagePress = useCallback(() => {
    if (embed.external.thumb) {
      const handle = findNodeHandle(imageRef.current);
      const dims = measureHandle(handle);

      console.log(dims);

      if (handle) {
        runOnUI(() => {
          "worklet";
          if (dims) {
            runOnJS(openLightbox)({
              images: [
                {
                  uri: embed.external.thumb!,
                  dimensions: dims,
                  thumbUri: embed.external.thumb!,
                  thumbDimensions: dims,
                  thumbRect: dims,
                  type: "image",
                  alt: embed.external.title,
                },
              ],
              index: 0,
            });
          }
        })();
      }
    }
  }, [embed.external.thumb, imageRef, openLightbox]);

  return (
    <Pressable onPress={handlePress}>
      <View className="mt-2 mx-4 overflow-hidden rounded-lg border border-gray-200 bg-gray-50">
        {embed.external.thumb && (
          <View
            ref={imageRef}
            collapsable
            className="h-[180px] w-full overflow-hidden"
          >
            <Image
              source={{ uri: embed.external.thumb }}
              style={{ height: "100%", width: "100%" }}
              contentFit="cover"
            />
          </View>
        )}
        <HStack className="p-3">
          <VStack className="flex-1">
            <Text size="sm" className="text-gray-900">
              {embed.external.title || "Link"}
            </Text>
            {embed.external.description && (
              <Text size="sm" numberOfLines={2} className="mt-1 text-gray-500">
                {embed.external.description}
              </Text>
            )}
            <HStack className="mt-2 items-center">
              <IconSymbol name="link" size={14} className="text-gray-400" />
              <Text numberOfLines={1} size="sm" className="text-gray-500">
                {embed.external.uri}
              </Text>
            </HStack>
          </VStack>
        </HStack>
      </View>
    </Pressable>
  );
}
