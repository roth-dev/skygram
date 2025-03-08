/**
 * Copyright (c) JOB TODAY S.A. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import { StyleSheet, TouchableOpacity, ViewStyle } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
// import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome'
// import {msg} from '@lingui/macro'
// import { useLingui } from "@lingui/react";

import { createHitslop } from "@/constants";
import { Ionicons } from "@expo/vector-icons";

type Props = {
  onRequestClose: () => void;
};

const HIT_SLOP = createHitslop(16);

const ImageDefaultHeader = ({ onRequestClose }: Props) => {
  const { top } = useSafeAreaInsets();
  return (
    <TouchableOpacity
      style={[styles.closeButton, { top }, styles.blurredBackground]}
      onPress={onRequestClose}
      hitSlop={HIT_SLOP}
      accessibilityRole="button"
      accessibilityLabel={"Close image"}
      accessibilityHint={`Closes viewer for header image`}
      onAccessibilityEscape={onRequestClose}
    >
      <Ionicons name="close" color={"#fff"} size={22} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  closeButton: {
    width: 44,
    marginRight: 10,
    height: 44,
    alignSelf: "flex-end",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 22,
    backgroundColor: "#00000077",
  },
  blurredBackground: {
    backdropFilter: "blur(10px)",
    WebkitBackdropFilter: "blur(10px)",
  } as ViewStyle,
});

export default ImageDefaultHeader;
