import React, { useRef } from "react";
import { DimensionValue, Pressable } from "react-native";
import { Image } from "expo-image";
import { AppBskyEmbedImages } from "@atproto/api";

import { HandleRef, measureHandle, useHandleRef } from "@/hooks/useHandleRef";
import { isNative } from "@/platform/detection";
import { useBreakpoints } from "@/hooks/breakpoints";
import { useTheme } from "@react-navigation/native";
import { Text, View } from "./ui";
import { Dimensions } from "./lightbox/ImageViewing/@types";
// import {useLargeAltBadgeEnabled} from '@/state/preferences/large-alt-badge'
// import {atoms as a, useBreakpoints, useTheme} from '#/alf'
// import {ArrowsDiagonalOut_Stroke2_Corner0_Rounded as Fullscreen} from '#/components/icons/ArrowsDiagonal'
// import {MediaInsetBorder} from '#/components/MediaInsetBorder'
// import {Text} from '#/components/Typography'

export function ConstrainedImage({
  aspectRatio,
  fullBleed,
  children,
}: {
  aspectRatio: number;
  fullBleed?: boolean;
  children: React.ReactNode;
}) {
  return (
    <View className="w-full" style={{ aspectRatio }}>
      {children}
    </View>
  );
}

export function AutoSizedImage({
  image,
  crop = "constrained",
  hideBadge,
  onPress,
  onLongPress,
  onPressIn,
}: {
  image: AppBskyEmbedImages.ViewImage;
  crop?: "none" | "square" | "constrained";
  hideBadge?: boolean;
  onPress?: (containerRef: HandleRef, fetchedDims: Dimensions | null) => void;
  onLongPress?: () => void;
  onPressIn?: () => void;
}) {
  // const largeAlt = useLargeAltBadgeEnabled()
  const containerRef = useHandleRef();
  const fetchedDimsRef = useRef<{ width: number; height: number } | null>(null);

  let aspectRatio: number | undefined;
  const dims = image.aspectRatio;
  if (dims) {
    aspectRatio = dims.width / dims.height;
    if (Number.isNaN(aspectRatio)) {
      aspectRatio = undefined;
    }
  }

  let constrained: number | undefined;
  let max: number | undefined;
  let rawIsCropped: boolean | undefined;
  if (aspectRatio !== undefined) {
    const ratio = 1 / 2; // max of 1:2 ratio in feeds
    constrained = Math.max(aspectRatio, ratio);
    max = Math.max(aspectRatio, 0.25); // max of 1:4 in thread
    rawIsCropped = aspectRatio < constrained;
  }

  const cropDisabled = crop === "none";
  const isCropped = rawIsCropped && !cropDisabled;
  const isContain = aspectRatio === undefined;
  const hasAlt = !!image.alt;

  const contents = (
    <View ref={containerRef} collapsable={false} style={{ flex: 1 }}>
      <Image
        contentFit={isContain ? "contain" : "cover"}
        style={{ width: "100%", height: "100%" }}
        transition={500}
        source={image.thumb}
        accessible={true} // Must set for `accessibilityLabel` to work
        accessibilityIgnoresInvertColors
        accessibilityLabel={image.alt}
        accessibilityHint=""
        onLoad={(e) => {
          if (!isContain) {
            fetchedDimsRef.current = {
              width: e.source.width,
              height: e.source.height,
            };
          }
        }}
      />

      {/* {(hasAlt || isCropped) && !hideBadge ? (
        <View
          accessible={false}
          style={[
            a.absolute,
            a.flex_row,
            {
              bottom: a.p_xs.padding,
              right: a.p_xs.padding,
              gap: 3,
            },
            largeAlt && [
              {
                gap: 4,
              },
            ],
          ]}
        >
          {isCropped && (
            <View
              style={[
                a.rounded_xs,
                t.atoms.bg_contrast_25,
                {
                  padding: 3,
                  opacity: 0.8,
                },
                largeAlt && [
                  {
                    padding: 5,
                  },
                ],
              ]}
            >
              <Fullscreen
                fill={t.atoms.text_contrast_high.color}
                width={largeAlt ? 18 : 12}
              />
            </View>
          )}
          {hasAlt && (
            <View
              style={[
                a.justify_center,
                a.rounded_xs,
                t.atoms.bg_contrast_25,
                {
                  padding: 3,
                  opacity: 0.8,
                },
                largeAlt && [
                  {
                    padding: 5,
                  },
                ],
              ]}
            >
              <Text
                style={[a.font_heavy, largeAlt ? a.text_xs : { fontSize: 8 }]}
              >
                ALT
              </Text>
            </View>
          )}
        </View>
      ) : null} */}
    </View>
  );

  if (cropDisabled) {
    return (
      <Pressable
        onPress={() => onPress?.(containerRef, fetchedDimsRef.current)}
        onLongPress={onLongPress}
        onPressIn={onPressIn}
        // alt here is what screen readers actually use
        accessibilityLabel={image.alt}
        accessibilityHint={`Views full image`}
        className="w-full rounded-md overflow-hidden bg-gray-300"
        style={[{ aspectRatio: max ?? 1 }]}
      >
        {contents}
      </Pressable>
    );
  } else {
    return (
      <Pressable
        onPress={() => onPress?.(containerRef, fetchedDimsRef.current)}
        onLongPress={onLongPress}
        onPressIn={onPressIn}
        // alt here is what screen readers actually use
        accessibilityLabel={image.alt}
        accessibilityHint={`Views full image`}
        className="h-full"
      >
        {contents}
      </Pressable>
    );
  }
}
