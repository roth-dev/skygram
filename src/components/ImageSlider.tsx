import React, { useCallback, useRef, useState } from "react";
import {
  FlatList,
  FlatListProps,
  ListRenderItemInfo,
  Pressable,
  ViewabilityConfig,
  ViewToken,
} from "react-native";
import { HStack, Text, View } from "./ui";
import { AppBskyEmbedImages } from "@atproto/api";
import { Image } from "expo-image";
import { cn } from "@/lib/utils";

type ImageView = AppBskyEmbedImages.ViewImage;

type Props<T = any> = Omit<FlatListProps<T>, "data" | "renderItem"> & {
  images: ImageView[];
  duration?: number;
  initialIndex?: number;
  onImagePress?: (item: ImageView) => void;
};

interface ImageSliderProps {
  width: number;
  height: number;
  uri: string;
  index: number;
}

interface IndicatorProps {
  index: number;
  indicator: number;
}
function SliderIndicator({ indicator, index }: IndicatorProps) {
  return (
    <HStack className="absolute bg-transparent dark:bg-transparent self-center gap-1 items-end bottom-2">
      {Array.from({ length: indicator }).map((_, idx) => (
        <View
          className={cn(
            "rounded-full w-2 h-2",
            index === idx
              ? "bg-blue-500 dark:bg-blue-500"
              : "bg-slate-100 dark:bg-slate-100"
          )}
          key={idx}
        />
      ))}
    </HStack>
  );
}
function ImageSlider({ width, height, uri }: ImageSliderProps) {
  return (
    <View style={{ width, height }}>
      <Image
        source={{ uri }}
        contentFit="cover"
        transition={500}
        style={{ width: "100%", height: "100%" }}
      />
    </View>
  );
}

const MediaSlider = ({ images, initialIndex, onImagePress }: Props) => {
  const [index, setIndex] = useState(0);
  const [itemSize, setItemSize] = useState({
    width: 0,
    height: 0,
  });

  const loaded = useRef(new Set([0]));

  const onViewableItemsChanged = useCallback(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      if (viewableItems && viewableItems.length > 0) {
        const focusedIndex = viewableItems?.[0].index || 0;
        setIndex(focusedIndex);
        loaded.current.add(focusedIndex);
      }
    },
    [loaded]
  );

  const viewabilityConfig: ViewabilityConfig = {
    itemVisiblePercentThreshold: 50,
  };

  const renderItem = useCallback(
    ({ index: idx, item }: ListRenderItemInfo<ImageView>) => {
      if (!loaded.current.has(idx)) {
        return <View style={{ ...itemSize }} />;
      }
      return (
        <Pressable onPress={() => onImagePress && onImagePress(item)}>
          <ImageSlider {...itemSize} index={idx} uri={item.thumb} />
        </Pressable>
      );
    },
    [itemSize, loaded]
  );

  return (
    <View
      className="flex-1"
      onLayout={(ev) => {
        setItemSize(ev.nativeEvent.layout);
      }}
    >
      <FlatList
        horizontal
        pagingEnabled
        bounces={false}
        data={images}
        initialScrollIndex={initialIndex}
        initialNumToRender={3}
        renderItem={renderItem}
        accessibilityHint="swipe left and right"
        showsHorizontalScrollIndicator={false}
        keyExtractor={(_, idx) => String(idx)}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        removeClippedSubviews
      />
      {images.length > 1 && (
        <SliderIndicator index={index} indicator={images.length} />
      )}
    </View>
  );
};

export default MediaSlider;
