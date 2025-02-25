import React from "react";
import { Text as BaseText } from "react-native";
import { cn } from "@/lib/utils";
import { cva, VariantProps } from "class-variance-authority";

const textVariants = cva("dark:text-white text-black", {
  variants: {
    size: {
      xs: "text-xs",
      sm: "text-sm",
      base: "text-base",
      lg: "text-lg",
      xl: "text-xl",
      "2xl": "text-2xl",
      "3xl": "text-3xl",
      "4xl": "text-4xl",
      "5xl": "text-5xl",
    },
    font: {
      thin: "font-thin",
      normal: "font-normal",
      bold: "font-bold",
      semiBold: "font-semibold",
      extrabold: "font-extrabold",
    },
  },
  defaultVariants: {
    size: "base",
    font: "normal",
  },
});

interface TextProps
  extends React.ComponentPropsWithoutRef<typeof BaseText>,
    VariantProps<typeof textVariants> {}

const Text = React.forwardRef<React.ElementRef<typeof BaseText>, TextProps>(
  ({ className, size, font, ...props }, ref) => (
    <BaseText
      ref={ref}
      className={cn(textVariants({ size, font }), className)}
      {...props}
    />
  )
);

Text.displayName = "Text";

export { Text };
