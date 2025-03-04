import React from "react";
import { View as BaseView } from "react-native";
import { cn } from "@/lib/utils";

const View = React.forwardRef<
  React.ElementRef<typeof BaseView>,
  React.ComponentPropsWithoutRef<typeof BaseView>
>(({ className, ...props }, ref) => (
  <BaseView
    ref={ref}
    className={cn("dark:bg-primary bg-white", className)}
    {...props}
  />
));

View.displayName = "View";

export { View };
