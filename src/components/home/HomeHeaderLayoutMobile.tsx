import React from "react";
import { View } from "react-native";
import Animated from "react-native-reanimated";
import { msg } from "@lingui/macro";
import { useLingui } from "@lingui/react";

import { HITSLOP_10 } from "@/constants";
// import {PressableScale} from '#/lib/custom-animations/PressableScale'
// import {useHaptics} from '#/lib/haptics'
import { useMinimalShellHeaderTransform } from "@/hooks/useMinimalShellTransform";
import { emitSoftReset } from "@/state/events";
import { useSession } from "@/state/session";
import { useShellLayout } from "@/state/shell/shell-layout";
import { Text } from "../ui";
import { SafeAreaView } from "react-native-safe-area-context";
// import {Logo} from '#/view/icons/Logo'
// import {atoms as a, useTheme} from '#/alf'
// import {ButtonIcon} from '#/components/Button'
// import {Hashtag_Stroke2_Corner0_Rounded as FeedsIcon} from '#/components/icons/Hashtag'
// import * as Layout from '#/components/Layout'
// import {Link} from '#/components/Link'

export function HomeHeaderLayoutMobile({
  children,
}: {
  children: React.ReactNode;
  tabBarAnchor: JSX.Element | null | undefined;
}) {
  // const t = useTheme()
  // const {_} = useLingui()
  const { headerHeight } = useShellLayout();
  const headerMinimalShellTransform = useMinimalShellHeaderTransform();
  const { hasSession } = useSession();
  // const playHaptic = useHaptics()

  return (
    <Animated.View
      style={[
        {
          top: 0,
          left: 0,
          right: 0,
        },
        headerMinimalShellTransform,
      ]}
      className="absolute z-10 bg-primary-foregroun"
      onLayout={(e) => {
        headerHeight.set(e.nativeEvent.layout.height);
      }}
    >
      {children}
    </Animated.View>
  );
}
