import {
  TextInput,
  StyleSheet,
  ListRenderItemInfo,
  TouchableOpacity,
} from "react-native";
import { useCallback, useRef, useState } from "react";
import { useAgent } from "@/state/session";
import { router } from "expo-router";
import { List } from "@/components/List";
import Layout from "@/components/Layout";
import { useSearchUser } from "@/state/queries/search-user";
import { AppBskyActorDefs } from "@atproto/api";
import UserAvatar from "@/components/UserAvatar";
import { HStack, Text, View, VStack } from "@/components/ui";
import { sanitizeDisplayName } from "@/lib/strings/display-names";
import { Button } from "@/components/ui/button";
import Spacer from "@/components/ui/spacer";

export default function Search() {
  const agent = useAgent();
  const [results, setResults] = useState<AppBskyActorDefs.ProfileView[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { searchUser } = useSearchUser();

  const query = useRef<string>("");

  const handleSearch = useCallback(
    (value?: string) => {
      setIsLoading(true);
      searchUser(value ?? query.current)
        .then((r) => {
          setResults(r.data.actors);
        })
        .finally(() => {
          setIsLoading(false);
        });
    },
    [query]
  );

  return (
    <Layout.Tab safeArea>
      <View style={styles.searchBar}>
        <TextInput
          style={styles.input}
          placeholder="Search users..."
          onChangeText={(value) => {
            query.current = value;
          }}
          onSubmitEditing={(e) => handleSearch(e.nativeEvent.text)}
          returnKeyType="search"
        />
      </View>

      <List
        data={results}
        renderItem={({
          item,
        }: ListRenderItemInfo<AppBskyActorDefs.ProfileView>) => (
          <TouchableOpacity
            onPress={() => {
              router.push({
                pathname: "/user-profile/[did]",
                params: {
                  did: item.did,
                },
              });
            }}
          >
            <VStack className="gap-10 py-3 flex-1 px-3 border-b-[1px] border-slate-200">
              <HStack className="flex-1">
                <UserAvatar avatar={item.avatar} className="w-14 h-14" />
                <VStack>
                  {!!item.displayName && (
                    <Text font="bold" numberOfLines={1}>
                      {sanitizeDisplayName(item.displayName)}
                    </Text>
                  )}

                  <Text style={styles.handle}>@{item.handle}</Text>
                </VStack>
                <Spacer />
                {!item.viewer?.following && (
                  <Button>
                    <Button.Text
                      className="text-white"
                      size="base"
                      font="semiBold"
                    >
                      Follow
                    </Button.Text>
                  </Button>
                )}
              </HStack>
            </VStack>
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item.did}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>
              {isLoading ? "Searching..." : "No results found"}
            </Text>
          </View>
        }
      />
    </Layout.Tab>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  searchBar: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  input: {
    backgroundColor: "#f5f5f5",
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
  },
  userItem: {
    flexDirection: "row",
    padding: 16,
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  userInfo: {
    flex: 1,
  },
  displayName: {
    fontSize: 16,
    fontWeight: "600",
  },
  handle: {
    fontSize: 14,
    color: "#666",
  },
  emptyState: {
    padding: 20,
    alignItems: "center",
  },
  emptyText: {
    color: "#666",
    fontSize: 16,
  },
});
