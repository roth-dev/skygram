import React, {
  forwardRef,
  PropsWithChildren,
  useCallback,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import PagerView, {
  PagerViewOnPageScrollEventData,
  PagerViewOnPageSelectedEvent,
  PagerViewOnPageSelectedEventData,
  PageScrollStateChangedNativeEventData,
} from "react-native-pager-view";
import Animated, {
  runOnJS,
  SharedValue,
  useEvent,
  useHandler,
  useSharedValue,
} from "react-native-reanimated";
import { View } from "../ui";

export type PageSelectedEvent = PagerViewOnPageSelectedEvent;

export interface PagerRef {
  setPage: (index: number) => void;
  setPageWithoutAnimated: (index: number) => void;
}

export interface RenderTabBarFnProps {
  selectedPage: number;
  onSelect?: (index: number) => void;
  tabBarAnchor?: JSX.Element | null | undefined; // Ignored on native.
  dragProgress: SharedValue<number>; // Ignored on web.
  dragState: SharedValue<"idle" | "dragging" | "settling">; // Ignored on web.
}
export type RenderTabBarFn = (props: RenderTabBarFnProps) => JSX.Element;

interface Props {
  lazy?: boolean;
  initialPage?: number;
  swipeEnabled?: boolean;
  renderTabBar: RenderTabBarFn;
  onPageSelected?: (index: number) => void;
  onPageScrollStateChanged?: (
    scrollState: "idle" | "dragging" | "settling"
  ) => void;
  testID?: string;
}

const AnimatedPagerView = Animated.createAnimatedComponent(PagerView);

export const Pager = forwardRef<PagerRef, PropsWithChildren<Props>>(
  function PagerImpl(
    {
      lazy,
      children,
      initialPage = 0,
      renderTabBar,
      onPageScrollStateChanged: parentOnPageScrollStateChanged,
      onPageSelected: parentOnPageSelected,
      testID,
      swipeEnabled = true,
    }: PropsWithChildren<Props>,
    ref
  ) {
    const [selectedPage, setSelectedPage] = useState(initialPage);
    const pagerView = useRef<PagerView>(null);
    const loadedPages = useRef(new Set([initialPage])); // Track loaded pages
    const [isIdle, setIsIdle] = useState(true);

    useImperativeHandle(ref, () => ({
      setPage: (index: number) => {
        pagerView.current?.setPage(index);
      },
      setPageWithoutAnimated: (index: number) => {
        pagerView.current?.setPageWithoutAnimation(index);
      },
    }));

    const onPageSelectedJSThread = useCallback(
      (nextPosition: number) => {
        setSelectedPage(nextPosition);
        loadedPages.current.add(nextPosition);
        parentOnPageSelected?.(nextPosition);
      },
      [lazy, setSelectedPage, parentOnPageSelected]
    );

    const onTabBarSelect = useCallback(
      (index: number) => {
        pagerView.current?.setPage(index);
      },
      [pagerView]
    );

    const dragState = useSharedValue<"idle" | "settling" | "dragging">("idle");
    const dragProgress = useSharedValue(selectedPage);
    const didInit = useSharedValue(false);
    const handlePageScroll = usePagerHandlers(
      {
        onPageScroll(e: PagerViewOnPageScrollEventData) {
          "worklet";
          if (didInit.get() === false) {
            // On iOS, there's a spurious scroll event with 0 position
            // even if a different page was supplied as the initial page.
            // Ignore it and wait for the first confirmed selection instead.
            return;
          }
          dragProgress.set(e.offset + e.position);
        },
        onPageScrollStateChanged(e: PageScrollStateChangedNativeEventData) {
          "worklet";
          runOnJS(setIsIdle)(e.pageScrollState === "idle");
          if (dragState.get() === "idle" && e.pageScrollState === "settling") {
            // This is a programmatic scroll on Android.
            // Stay "idle" to match iOS and avoid confusing downstream code.
            return;
          }
          dragState.set(e.pageScrollState);
          parentOnPageScrollStateChanged?.(e.pageScrollState);
        },
        onPageSelected(e: PagerViewOnPageSelectedEventData) {
          "worklet";
          didInit.set(true);
          runOnJS(onPageSelectedJSThread)(e.position);
        },
      },
      [parentOnPageScrollStateChanged]
    );

    const drawerGesture = Gesture.Native(); // noop for web
    const nativeGesture =
      Gesture.Native().requireExternalGestureToFail(drawerGesture);

    return (
      <View testID={testID} className="flex-1 native:overflow-hidden">
        {renderTabBar({
          selectedPage,
          onSelect: onTabBarSelect,
          dragProgress,
          dragState,
        })}
        <GestureDetector gesture={nativeGesture}>
          <AnimatedPagerView
            ref={pagerView}
            style={{ flex: 1 }}
            initialPage={initialPage}
            scrollEnabled={swipeEnabled}
            onPageScroll={handlePageScroll}
          >
            {React.Children.map(children, (child, index) =>
              lazy && !loadedPages.current.has(index) ? null : child
            )}
          </AnimatedPagerView>
        </GestureDetector>
      </View>
    );
  }
);

function usePagerHandlers(
  handlers: {
    onPageScroll: (e: PagerViewOnPageScrollEventData) => void;
    onPageScrollStateChanged: (
      e: PageScrollStateChangedNativeEventData
    ) => void;
    onPageSelected: (e: PagerViewOnPageSelectedEventData) => void;
  },
  dependencies: unknown[]
) {
  const { doDependenciesDiffer } = useHandler(handlers as any, dependencies);
  const subscribeForEvents = [
    "onPageScroll",
    "onPageScrollStateChanged",
    "onPageSelected",
  ];
  return useEvent(
    (event) => {
      "worklet";
      const { onPageScroll, onPageScrollStateChanged, onPageSelected } =
        handlers;
      if (event.eventName.endsWith("onPageScroll")) {
        onPageScroll(event as any as PagerViewOnPageScrollEventData);
      } else if (event.eventName.endsWith("onPageScrollStateChanged")) {
        onPageScrollStateChanged(
          event as any as PageScrollStateChangedNativeEventData
        );
      } else if (event.eventName.endsWith("onPageSelected")) {
        onPageSelected(event as any as PagerViewOnPageSelectedEventData);
      }
    },
    subscribeForEvents,
    doDependenciesDiffer
  );
}
