import { View, VStack, HStack, Text } from "@/components/ui";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useProfileQuery } from "@/state/queries/profile";
import { useSession } from "@/state/session";
import { useState } from "react";
import { Image } from "expo-image";
import { TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Layout from "@/components/Layout";
import * as ImagePicker from "expo-image-picker";
import { useAgent } from "@/state/session";
import { Textarea } from "@/components/ui/textarea";

export default function EditProfileScreen() {
  const { currentAccount } = useSession();
  const agent = useAgent();
  const { data: profile, refetch } = useProfileQuery({
    did: currentAccount?.did,
  });

  const [displayName, setDisplayName] = useState(profile?.displayName || "");
  const [description, setDescription] = useState(profile?.description || "");
  const [avatar, setAvatar] = useState(profile?.avatar);
  const [banner, setBanner] = useState(profile?.banner);
  const [isLoading, setIsLoading] = useState(false);

  const pickImage = async (type: "avatar" | "banner") => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: type === "avatar" ? [1, 1] : [16, 9],
      quality: 0.8,
    });

    if (!result.canceled) {
      if (type === "avatar") {
        setAvatar(result.assets[0].uri);
      } else {
        setBanner(result.assets[0].uri);
      }
    }
  };

  const handleSave = async () => {
    if (!currentAccount?.did) return;

    setIsLoading(true);
    try {
      // TODO: Implement image upload to blob storage
      // For now, we'll just update the profile text fields
      await agent.api.com.atproto.repo.putRecord({
        repo: currentAccount.did,
        collection: "app.bsky.actor.profile",
        rkey: "self",
        record: {
          $type: "app.bsky.actor.profile",
          displayName,
          description,
          // avatar and banner will be added after implementing blob storage
        },
      });

      await refetch();
      // TODO: Add success toast/notification
    } catch (error) {
      console.error("Failed to update profile:", error);
      // TODO: Add error toast/notification
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout.Screen title="Edit Profile">
      <VStack className="flex-1 p-4 gap-4">
        {/* Banner Section */}
        <TouchableOpacity
          className="w-full h-32 bg-neutral-200 rounded-lg overflow-hidden"
          onPress={() => pickImage("banner")}
        >
          {banner ? (
            <Image
              source={{ uri: banner }}
              style={{ width: "100%", height: "100%" }}
              contentFit="cover"
            />
          ) : (
            <View className="w-full h-full items-center justify-center">
              <Ionicons name="image-outline" size={32} color="#666" />
              <Text className="text-neutral-500 mt-2">Add banner image</Text>
            </View>
          )}
        </TouchableOpacity>

        {/* Avatar Section */}
        <TouchableOpacity
          className="w-24 h-24 -mt-12 ml-4 rounded-full border-4 border-white overflow-hidden"
          onPress={() => pickImage("avatar")}
        >
          {avatar ? (
            <Image
              source={{ uri: avatar }}
              style={{ width: "100%", height: "100%" }}
              contentFit="cover"
            />
          ) : (
            <View className="w-full h-full items-center justify-center bg-neutral-200">
              <Ionicons name="person-outline" size={32} color="#666" />
            </View>
          )}
        </TouchableOpacity>

        {/* Form Fields */}
        <VStack className="gap-4 mt-4">
          <VStack className="gap-2">
            <Text className="text-sm font-medium">Display Name</Text>
            <Input
              value={displayName}
              onChangeText={setDisplayName}
              placeholder="Enter your display name"
            />
          </VStack>

          <VStack className="gap-2">
            <Text className="text-sm font-medium">Bio</Text>
            <Textarea
              value={description}
              onChangeText={setDescription}
              placeholder="Tell us about yourself"
              className="h-24"
            />
          </VStack>

          <Button onPress={handleSave} className="mt-4" disabled={isLoading}>
            <Button.Text>
              {isLoading ? "Saving..." : "Save Changes"}
            </Button.Text>
          </Button>
        </VStack>
      </VStack>
    </Layout.Screen>
  );
}
