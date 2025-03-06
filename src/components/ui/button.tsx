import * as React from "react";
import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import { TouchableOpacity, TouchableOpacityProps } from "react-native";
import { Slot } from "expo-router";
import { IconSymbol, IconSymbolProps } from "./IconSymbol";
import { Text, TextProps } from "./text";
import { isWeb } from "@/platform/detection";
import LoadingSpinner from "../LoadingSpinner";

const buttonVariants = cva(
  isWeb
    ? "flex-row inline-flex bg-white dark:bg-primary items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0"
    : "flex-row inline-flex bg-white dark:bg-primary items-center justify-center gap-2 rounded-md",
  {
    variants: {
      variant: {
        default: "bg-blue-500 text-primary-foreground hover:bg-blue-400",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-neutral-200 text-secondary-foreground hover:bg-secondary/80 dark:border dark:border-white",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 web:py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends TouchableOpacityProps,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  isLoading?: boolean;
  loadingColor?: string;
}

const Button = ({
  className,
  variant,
  size,
  asChild = false,
  isLoading = false,
  loadingColor = "white",
  disabled,
  children,
  ...props
}: ButtonProps) => {
  const Comp = asChild ? Slot : TouchableOpacity;

  return (
    <Comp
      {...props}
      disabled={disabled || isLoading} // Disable button while loading
      className={cn(
        buttonVariants({ variant, size, className }),
        isLoading && "opacity-80"
      )}
    >
      {children}
      {!!isLoading && (
        <LoadingSpinner color={loadingColor} durationMs={700} size={18} />
      )}
    </Comp>
  );
};

Button.Text = function (props: React.PropsWithChildren<TextProps>) {
  return <Text {...props} />;
};

Button.Icon = function (props: React.PropsWithChildren<IconSymbolProps>) {
  return <IconSymbol {...props} />;
};

Button.displayName = "Button";

export { Button, buttonVariants };
