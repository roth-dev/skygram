import React, { useCallback, useState } from "react";
import { FeedSourceInfo } from "@/state/queries/feed";
import { useSession } from "@/state/session";
import { RenderTabBarFnProps } from "../pager/Pager";
import { HomeHeaderLayout } from "./HomeHeaderLayout";
import * as DropdownMenu from "zeego/dropdown-menu";
import { Button } from "../ui/button";
import { HStack, View } from "../ui";
import Logo from "../Logo";
import Spacer from "../ui/spacer";
import ExpoIcon from "../ui/icon";

function HeaderDropdown({
  pinnedNames,
  onChange,
}: {
  pinnedNames: string[];
  onChange: (index: number) => void;
}) {
  const [selected, setSelected] = useState("Discover");

  const onSelectPinnedName = useCallback(
    (index: number) => {
      setSelected(pinnedNames[index]);
      onChange(index);
    },
    [onChange, pinnedNames]
  );

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger>
        <Button variant="ghost" className="items-center">
          <Button.Text size="2xl" font="semiBold">
            {selected}
          </Button.Text>
          <Button.Icon name="chevron-down" />
        </Button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content>
        {pinnedNames.map((name, index) => {
          return (
            <DropdownMenu.Item
              onSelect={() => onSelectPinnedName(index)}
              key={name}
            >
              <DropdownMenu.ItemTitle style={{ fontSize: 12 }}>
                {name}
              </DropdownMenu.ItemTitle>
              {name === selected && (
                <DropdownMenu.ItemIcon
                  ios={{
                    name: "checkmark",
                  }}
                  androidIconName="check"
                />
              )}
            </DropdownMenu.Item>
          );
        })}
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
}

export function HomeHeader(
  props: RenderTabBarFnProps & {
    testID?: string;
    onPressSelected: () => void;
    feeds: FeedSourceInfo[];
  }
) {
  const { feeds } = props;
  const { hasSession } = useSession();

  const hasPinnedCustom = React.useMemo<boolean>(() => {
    if (!hasSession) return false;
    return feeds.some((tab) => {
      const isFollowing = tab.uri === "following";
      return !isFollowing;
    });
  }, [feeds, hasSession]);

  const items = React.useMemo(() => {
    const pinnedNames = feeds.map((f) => f.displayName);
    if (!hasPinnedCustom) {
      return pinnedNames.concat("Feeds ✨");
    }
    return pinnedNames;
  }, [hasPinnedCustom, feeds]);

  const onPressFeedsLink = React.useCallback(
    () => {
      // navigation.navigate('Feeds')
    },
    [
      // navigation
    ]
  );

  const onSelect = React.useCallback(
    (index: number) => {
      if (!hasPinnedCustom && index === items.length - 1) {
        onPressFeedsLink();
      } else if (props.onSelect) {
        props.onSelect(index);
      }
    },
    [items.length, onPressFeedsLink, props, hasPinnedCustom]
  );

  return (
    <HomeHeaderLayout tabBarAnchor={props.tabBarAnchor}>
      <HStack>
        <View className="w-[120px]">
          <HeaderDropdown onChange={onSelect} pinnedNames={items} />
        </View>
        <Spacer />
        <View className="w-[120px] items-center">
          <Logo />
        </View>
        <Spacer />
        <View className="w-[120px] items-end">
          <HStack className="right-3">
            <Button variant="secondary" shape="rounded" size="icon">
              <ExpoIcon name="chatbubble-ellipses-outline" size="lg" />
            </Button>
            <Button variant="secondary" shape="rounded" size="icon">
              <ExpoIcon name="notifications-outline" size="lg" />
            </Button>
          </HStack>
        </View>
      </HStack>
    </HomeHeaderLayout>
  );
}
