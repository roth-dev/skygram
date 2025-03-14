import React, { useCallback, useMemo, useRef, useState } from "react";
import {
  FlatList,
  FlatListProps,
  InteractionManager,
  ListRenderItemInfo,
  ViewabilityConfig,
  ViewToken,
} from "react-native";
import { HStack, View } from "./ui";
import { AppBskyEmbedImages } from "@atproto/api";
import { Image } from "expo-image";
import { cn } from "@/lib/utils";
import { useLightboxControls } from "@/state/lightbox";
import { AutoSizedImage } from "./AutoSizeImage";
import { MeasuredDimensions, runOnJS, runOnUI } from "react-native-reanimated";
import { Dimensions } from "./lightbox/ImageViewing/@types";
import { HandleRef, measureHandle } from "@/hooks/useHandleRef";

type ImageView = AppBskyEmbedImages.ViewImage;

type Props<T = any> = Omit<FlatListProps<T>, "data" | "renderItem"> & {
  images: ImageView[];
  duration?: number;
  initialIndex?: number;
  onImagePress?: (item: ImageView) => void;
};

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
const MediaSlider = ({ images, initialIndex, onImagePress }: Props) => {
  const { openLightbox } = useLightboxControls();

  const [index, setIndex] = useState(0);

  const dimensions = useRef<Dimensions>({ width: 0, height: 0 });

  const loaded = useRef(new Set([0]));

  const items = useMemo(() => {
    return images.map((img) => ({
      uri: img.fullsize,
      thumbUri: img.thumb,
      alt: img.alt,
      dimensions: img.aspectRatio ?? null,
    }));
  }, [images]);

  const _openLightbox = useCallback(
    (
      thumbRects: (MeasuredDimensions | null)[],
      fetchedDims: (Dimensions | null)[]
    ) => {
      openLightbox({
        index,
        images: items.map((item, i) => ({
          ...item,
          thumbRect: thumbRects[i],
          thumbDimensions: fetchedDims[i] ?? null,
          type: "image",
        })),
      });
    },
    [items, index]
  );
  const onPress = useCallback(
    (refs: HandleRef, dims: Dimensions | null) => {
      const handle = refs.current;
      const rects = measureHandle(handle);

      runOnUI(() => {
        "worklet";
        runOnJS(_openLightbox)([rects], [dims]);
      })();
    },
    [_openLightbox]
  );

  const onPressIn = (_: number) => {
    InteractionManager.runAfterInteractions(() => {
      Image.prefetch(items.map((i) => i.uri));
    });
  };

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

  const aspectRatio = useMemo(() => {
    if (images.length > 0) {
      const imgs = images as AppBskyEmbedImages.ViewImage[];
      return (
        (imgs[0].aspectRatio?.width ?? 1) / (imgs[0].aspectRatio?.height ?? 1)
      );
    }

    return 1;
  }, [images]);

  const viewabilityConfig: ViewabilityConfig = {
    itemVisiblePercentThreshold: 50,
  };

  const renderItem = useCallback(
    ({ index: idx, item }: ListRenderItemInfo<ImageView>) => {
      if (!loaded.current.has(idx)) {
        return <View style={[dimensions.current]} />;
      }
      return (
        <View style={[dimensions.current]}>
          <AutoSizedImage
            image={item}
            onPressIn={() => onPressIn(0)}
            onPress={(ref, dims) => onPress(ref, dims)}
          />
        </View>
      );
    },
    [dimensions, loaded, onPress, onPressIn]
  );

  return (
    <View
      style={{ aspectRatio }}
      onLayout={(ev) => {
        dimensions.current = {
          width: ev.nativeEvent.layout.width,
          height: ev.nativeEvent.layout.height,
        };
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
        getItemLayout={(_, index) => ({
          length: dimensions.current.width,
          offset: dimensions.current.width * index,
          index,
        })}
      />
      {images.length > 1 && (
        <SliderIndicator index={index} indicator={images.length} />
      )}
    </View>
  );
};

export default MediaSlider;
