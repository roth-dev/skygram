import React from "react";
import { View } from "@/components/ui/view";
import { cn } from "@/lib/utils";

const VStack = React.forwardRef<
  React.ElementRef<typeof View>,
  React.ComponentPropsWithoutRef<typeof View>
>(({ className, ...props }, ref) => (
  <View ref={ref} {...props} className={cn("flex flex-col gap-1", className)} />
));

VStack.displayName = "VStack";

const HStack = React.forwardRef<
  React.ElementRef<typeof View>,
  React.ComponentPropsWithoutRef<typeof View>
>(({ className, ...props }, ref) => (
  <View
    ref={ref}
    {...props}
    className={cn("flex flex-row gap-2 items-center", className)}
  />
));

HStack.displayName = "HStack";

export { VStack, HStack };
