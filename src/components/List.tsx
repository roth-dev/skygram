import React, { memo } from "react";
import { RefreshControl, ViewToken } from "react-native";
import {
  FlatListPropsWithLayout,
  runOnJS,
  useSharedValue,
} from "react-native-reanimated";
import { updateActiveVideoViewAsync } from "@haileyok/bluesky-video";
import { useAnimatedScrollHandler } from "@/hooks/useAnimatedScrollHandler_FIXED";
import { useDedupe } from "@/hooks/useDedupe";
import { useScrollHandlers } from "@/lib/ScrollContext";
import { isAndroid, isIOS } from "@/platform/detection";
import { useTheme } from "@react-navigation/native";
import { addStyle } from "@/lib/styles";
import { useBottomBarOffset } from "@/hooks/useBottomBarOffset";
import { FlatList_INTERNAL } from "./Views";

export type ListMethods = FlatList_INTERNAL;

export type ListProps<ItemT = any> = Omit<
  FlatListPropsWithLayout<ItemT>,
  | "onMomentumScrollBegin" // Use ScrollContext instead.
  | "onMomentumScrollEnd" // Use ScrollContext instead.
  | "onScroll" // Use ScrollContext instead.
  | "onScrollBeginDrag" // Use ScrollContext instead.
  | "onScrollEndDrag" // Use ScrollContext instead.
  | "refreshControl" // Pass refreshing and/or onRefresh instead.
  | "contentOffset" // Pass headerOffset instead.
  | "progressViewOffset" // Can't be an animated value
> & {
  onScrolledDownChange?: (isScrolledDown: boolean) => void;
  headerOffset?: number;
  refreshing?: boolean;
  onRefresh?: () => void;
  onItemSeen?: (item: ItemT) => void;
  desktopFixedHeight?: number | boolean;
  // Web only prop to contain the scroll to the container rather than the window
  disableFullWindowScroll?: boolean;
  sideBorders?: boolean;
  progressViewOffset?: number;
};
export type ListRef = React.MutableRefObject<ListMethods | null>;

const SCROLLED_DOWN_LIMIT = 200;

let List = React.forwardRef<ListMethods, ListProps>(
  (
    {
      onScrolledDownChange,
      refreshing,
      onRefresh,
      onItemSeen,
      headerOffset,
      style,
      progressViewOffset,
      automaticallyAdjustsScrollIndicatorInsets = false,
      ...props
    },
    ref
  ): React.ReactElement => {
    const theme = useTheme();
    const isScrolledDown = useSharedValue(false);
    const dedupe = useDedupe(400);

    const paddingBottom = useBottomBarOffset();

    function handleScrolledDownChange(didScrollDown: boolean) {
      onScrolledDownChange?.(didScrollDown);
    }

    const {
      onBeginDrag: onBeginDragFromContext,
      onEndDrag: onEndDragFromContext,
      onScroll: onScrollFromContext,
      onMomentumEnd: onMomentumEndFromContext,
    } = useScrollHandlers();

    const scrollHandler = useAnimatedScrollHandler({
      onBeginDrag(e, ctx) {
        onBeginDragFromContext?.(e, ctx);
      },
      onEndDrag(e, ctx) {
        runOnJS(updateActiveVideoViewAsync)();
        onEndDragFromContext?.(e, ctx);
      },
      onScroll(e, ctx) {
        onScrollFromContext?.(e, ctx);

        const didScrollDown = e.contentOffset.y > SCROLLED_DOWN_LIMIT;
        if (isScrolledDown.get() !== didScrollDown) {
          isScrolledDown.set(didScrollDown);
          if (onScrolledDownChange != null) {
            runOnJS(handleScrolledDownChange)(didScrollDown);
          }
        }

        if (isIOS) {
          runOnJS(dedupe)(updateActiveVideoViewAsync);
        }
      },
      onMomentumEnd(e, ctx) {
        runOnJS(updateActiveVideoViewAsync)();
        onMomentumEndFromContext?.(e, ctx);
      },
    });

    const [onViewableItemsChanged, viewabilityConfig] = React.useMemo(() => {
      if (!onItemSeen) {
        return [undefined, undefined];
      }
      return [
        (info: {
          viewableItems: Array<ViewToken>;
          changed: Array<ViewToken>;
        }) => {
          for (const item of info.changed) {
            if (item.isViewable) {
              onItemSeen(item.item);
            }
          }
        },
        {
          itemVisiblePercentThreshold: 40,
          minimumViewTime: 0.5e3,
        },
      ];
    }, [onItemSeen]);

    let refreshControl;
    if (refreshing !== undefined || onRefresh !== undefined) {
      refreshControl = (
        <RefreshControl
          key={theme.colors.border}
          refreshing={refreshing ?? false}
          onRefresh={onRefresh}
          tintColor={theme.colors.border}
          progressViewOffset={progressViewOffset ?? headerOffset}
        />
      );
    }

    let contentOffset;
    if (!!headerOffset) {
      style = addStyle(style, {
        paddingTop: headerOffset,
      });

      contentOffset = { x: 0, y: headerOffset * -1 };
    }

    return (
      <FlatList_INTERNAL
        showsVerticalScrollIndicator={!isAndroid}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        {...props}
        automaticallyAdjustsScrollIndicatorInsets={
          automaticallyAdjustsScrollIndicatorInsets
        }
        contentContainerStyle={[
          { paddingBottom: paddingBottom },
          props.contentContainerStyle,
        ]}
        scrollIndicatorInsets={{
          top: headerOffset,
          right: 1,
          ...props.scrollIndicatorInsets,
        }}
        recycleItems
        indicatorStyle={theme.dark ? "white" : "black"}
        contentOffset={contentOffset}
        refreshControl={refreshControl}
        estimatedItemSize={250}
        drawDistance={100}
        waitForInitialLayout={true}
        scrollEventThrottle={1}
        onScroll={scrollHandler}
        style={style}
        // @ts-expect-error FlatList_INTERNAL ref type is wrong -sfn
        ref={ref}
      />
    );
  }
);
List.displayName = "List";
//@ts-ignore
List = memo(List);

export { List };
