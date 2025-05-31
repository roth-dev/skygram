import { HStack, Text, VStack } from "@/components/ui";
import { Ionicons } from "@expo/vector-icons";
import { Link, RelativePathString } from "expo-router";
import { useCallback } from "react";
import { ScrollView, View } from "react-native";

interface SelectList {
  title: string;
  icon?: string | null;
  routeName?: string;
}
interface Section {
  title?: string;
  data: SelectList[];
}

export default function SettingScreen() {
  const sections: Section[] = [
    {
      data: [
        {
          title: "Account",
          icon: "person-outline",
          routeName: "account-settings",
        },
      ],
    },
    {
      title: "General",
      data: [
        {
          title: "Appearance",
          icon: "color-palette-outline",
          routeName: "appearance",
        },
        {
          title: "Languages",
          icon: "language-outline",
          routeName: "language",
        },
        {
          title: "Accessibility",
          routeName: "accessibility",
          icon: "accessibility-outline",
        },
      ],
    },
    {
      title: "Privacy",
      data: [
        {
          title: "Policy",
          icon: "document-text-outline",
          routeName: "policy",
        },
      ],
    },
    {
      title: "About",
      data: [
        {
          title: "App Version",
        },
      ],
    },
  ];

  const renderItem = useCallback(
    ({ item, index }: { item: Section; index: number }) => {
      return (
        <VStack key={index}>
          {!!item.title && (
            <Text
              size="lg"
              font="semiBold"
              role="heading"
              className="text-neutral-300"
            >
              {item.title}
            </Text>
          )}
          <View className="py-4 gap-2">
            {item.data.map((item, key) => {
              return (
                <View key={key}>
                  <Link
                    disabled={!item.routeName}
                    href={
                      `/(app)/(modal)/${item.routeName}` as RelativePathString
                    }
                  >
                    <HStack className="py-2">
                      {!!item.icon && <Ionicons name={item.icon} size={18} />}

                      <Text className="flex-1">{item.title}</Text>
                      {!!item.routeName && (
                        <Ionicons name="chevron-forward" size={18} />
                      )}
                    </HStack>
                  </Link>
                </View>
              );
            })}
          </View>
        </VStack>
      );
    },
    []
  );

  return (
    <View className="flex-1 bg-white">
      <ScrollView contentContainerClassName="flex-1 p-4 top-[50px]">
        {sections.map((item, index) => renderItem({ item, index }))}
      </ScrollView>
    </View>
  );
}
