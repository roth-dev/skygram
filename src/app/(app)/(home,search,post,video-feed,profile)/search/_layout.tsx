import {
  View,
  Text,
  TextInput,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Image,
} from "react-native";
import { useState } from "react";
import { useAgent } from "@/state/session";
import { router } from "expo-router";
import { List } from "@/components/List";
import Layout from "@/components/Layout";

export default function Search() {
  const agent = useAgent();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async () => {
    if (!query.trim() || !agent) return;

    setIsLoading(true);
    try {
      const response = await agent.searchActors({ term: query });
      setResults(response.data.actors);
    } catch (error) {
      console.error("Search error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout.Tab safeArea>
      <View style={styles.searchBar}>
        <TextInput
          style={styles.input}
          placeholder="Search users..."
          value={query}
          onChangeText={setQuery}
          onSubmitEditing={handleSearch}
          returnKeyType="search"
        />
      </View>

      <List
        data={results}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => {
              router.push(`/user-profile/${item.did}`);
            }}
            style={styles.userItem}
          >
            <Image
              source={{
                uri:
                  item?.avatar ||
                  `https://ui-avatars.com/api/?name=${item.handle}`,
              }}
              style={styles.avatar}
            />
            <View style={styles.userInfo}>
              <Text style={styles.displayName}>{item.displayName}</Text>
              <Text style={styles.handle}>@{item.handle}</Text>
            </View>
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
