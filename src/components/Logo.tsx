import { assets } from "assets/images";
import { Image } from "expo-image";
import { memo } from "react";

export default memo(function Logo({
  width = 50,
  height = 50,
}: {
  width?: number;
  height?: number;
}) {
  return (
    <Image source={assets.LOGO} contentFit="cover" style={{ width, height }} />
  );
});
