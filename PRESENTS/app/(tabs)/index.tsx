import { Collapsible } from "@/components/Collapsible";
import { HelloWave } from "@/components/HelloWave";
import NavBar from "@/components/NavBar";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import storage from "@/storage/store";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { useRef, useState } from "react";
import {
  Animated,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { GiftType } from "@/@types/userTypes";
import RemoveModel from "@/components/RemoveModel";
import { useQuery } from "@tanstack/react-query";
import { Redirect } from "expo-router";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
export default function HomeScreen() {
  const [isModelVisible, setIsModalVisible] = useState(false);
  const [selctedItem, setSelectedItem] = useState<GiftType | null>(null);
  const handleModal = (item: GiftType) => {
    setIsModalVisible(true);
    setSelectedItem(item);
  };
  const scrollY = useRef(new Animated.Value(0)).current;
  const HEADER_HEIGHT = 200;

  const {
    data: profile,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["userProfile"],
    queryFn: async () => {
      return await storage.load({ key: "user" });
    },
  });
  const { data: gifts, refetch: refetchGifts } = useQuery({
    queryKey: ["userGifts", profile?.user?._id],
    enabled: !!profile?.user?._id,
    queryFn: async () => {
      try {
        const res = await fetch(
          `http://10.100.102.11:3000/gifts?userId=${profile.user._id}`
        );
        if (!res.ok) throw new Error("Failed to fetch gifts");

        const data = await res.json();
        console.log("Gifts fetched successfully:", data);

        return data;
      } catch (error) {
        console.error("Error fetching gifts:", error);
        throw error;
      }
    },
  });

  const { data: listOfUsers, refetch: refetchList } = useQuery({
    queryKey: ["listOfUsers"],
    enabled: !!profile?.user?._id,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    queryFn: async () => {
      try {
        const res = await fetch(
          `http://10.100.102.11:3000/user/userGiftList?userId=${profile.user._id}`
        );
        if (!res.ok) throw new Error("Failed to fetch users");
        const data = await res.json();
        console.log("Users fetched successfully:", data);
        return data;
      } catch (error) {
        console.error("Error fetching users:", error);
        throw error;
      }
    },
  });
  const {
    data: multiGifts,
    isLoading: isMultiLoading,
    refetch: refechMulti,
  } = useQuery({
    queryKey: ["multiUserGifts", listOfUsers],
    enabled: !!profile?.user?._id && !!listOfUsers,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    queryFn: async () => {
      const responses = await Promise.all(
        listOfUsers.map(async (id: string) => {
          const res = await fetch(
            `http://10.100.102.11:3000/gifts?userId=${id}`
          );
          if (!res.ok) throw new Error(`Failed to fetch gifts for user ${id}`);
          const json = await res.json();
          return { userId: id, gifts: json };
        })
      );
      return responses;
    },
  });
  const combinedGifts = [
    ...(gifts?.map((g: GiftType) => ({
      ...g,
      userId: profile?.user?._id,
      section: "My Gifts",
    })) || []),
    ...(multiGifts?.flatMap((entry) =>
      entry.gifts.map((g: GiftType) => ({
        ...g,
        userId: entry.userId,
        section: "Other Gifts",
      }))
    ) || []),
  ];
  if (!profile) {
    return <Redirect href="/(tabs)/login/login" />;
  }
  console.log("Combined Gifts:", combinedGifts[0]?.username);
  return (
    <SafeAreaProvider>
      <SafeAreaView>
        <NavBar
          onGiftAdded={refetch}
          refechMulti={refechMulti}
          refetchList={refetchList}
          combinedGifts={combinedGifts}
        />

        <Animated.FlatList
          data={combinedGifts}
          keyExtractor={(item, index) =>
            item._id?.toString?.() || `${item.username}-${index}`
          }
          ListHeaderComponent={
            <>
              <Animated.View
                style={{
                  height: scrollY.interpolate({
                    inputRange: [0, HEADER_HEIGHT],
                    outputRange: [HEADER_HEIGHT, 80],
                    extrapolate: "clamp",
                  }),
                  overflow: "hidden",
                  borderBottomLeftRadius: 24,
                  borderBottomRightRadius: 24,
                  marginBottom: 0,
                  elevation: 4,
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.15,
                  shadowRadius: 8,
                }}
              >
                <View style={{ flex: 1 }}>
                  <Image
                    source={require("@/assets/images/image.png")}
                    style={styles.reactLogo}
                  />
                  <LinearGradient
                    colors={["rgba(0,0,0,0.4)", "rgba(0,0,0,0.05)"]}
                    style={StyleSheet.absoluteFill}
                  />
                </View>
              </Animated.View>
              <ThemedView style={styles.headerContent}>
                <ThemedText type="title" style={styles.headerTitle}>
                  Welcome {profile?.user?.username || profile?.username}
                </ThemedText>
                <HelloWave />
              </ThemedView>
            </>
          }
          renderItem={({ item, index }) => {
            console.log("test", item);
            const showSectionHeader =
              index === 0 || item.section !== combinedGifts[index - 1]?.section;

            return (
              <View>
                {showSectionHeader && (
                  <Text style={styles.sectionHeader}>{item.section}</Text>
                )}
                <LinearGradient
                  colors={["#1f1f2e", "#2a2a3c"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.card}
                >
                  <Text style={{ color: "#aaa", marginBottom: 6 }}>
                    👤 User ID: {item.username}
                  </Text>

                  <Collapsible title={item.giftName}>
                    <Text style={styles.listDescription}>
                      {item.giftDescription}
                    </Text>
                    <Text style={styles.listContent}>
                      💰 Price:{" "}
                      <Text style={{ color: "#ffd700", fontWeight: "bold" }}>
                        {item.giftPrice} ₪
                      </Text>
                    </Text>
                    <Text style={styles.listContent}>
                      🔗 Link:{" "}
                      <Text style={{ color: "#4f8cff" }}>{item.giftLink}</Text>
                    </Text>
                    {item.userId === profile?.user?._id && (
                      <TouchableOpacity
                        style={styles.removeButton}
                        onPress={() => handleModal(item)}
                      >
                        <Text style={styles.removeButtonText}>Remove</Text>
                      </TouchableOpacity>
                    )}
                  </Collapsible>
                </LinearGradient>
              </View>
            );
          }}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: scrollY } } }],
            { useNativeDriver: false }
          )}
          scrollEventThrottle={16}
          contentContainerStyle={{ padding: 16, paddingTop: 0 }}
        />
        <RemoveModel
          visible={isModelVisible}
          title={selctedItem}
          refetch={refetchGifts}
          onClose={() => setIsModalVisible(false)}
        />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: "#1e1e28",
    borderRadius: 16,
    padding: 16,
    marginTop: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 4,
  },
  removeButton: {
    backgroundColor: "#ff4d4d",
    borderRadius: 12,
    padding: 10,
    alignItems: "center",
    marginTop: 10,
    alignSelf: "flex-start",
  },

  removeButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  headerTitle: {
    color: "#f9f9f9",
    fontSize: 30,
    fontWeight: "bold",
    letterSpacing: 0.8,
    textShadowColor: "rgba(0,0,0,0.5)",
    textShadowOffset: { width: 0, height: 3 },
    textShadowRadius: 8,
  },
  reactLogo: {
    height: "100%",
    width: "100%",
    resizeMode: "cover",
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  card: {
    backgroundColor: "linear-gradient(145deg, #1f1f2e, #2a2a3c)", // Not supported in RN, so fallback:
    borderRadius: 22,
    padding: 20,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: "#333444",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 4,
  },
  listContent: {
    color: "#e8e8f2",
    paddingVertical: 6,
    fontSize: 17,
    fontWeight: "600",
    borderBottomWidth: 1,
    borderBottomColor: "#333444",
    marginBottom: 6,
  },
  listDescription: {
    fontSize: 14,
    color: "#b0b0c3",
    marginBottom: 8,
    fontStyle: "italic",
  },
  sectionHeader: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
    marginTop: 24,
    marginBottom: 12,
    paddingLeft: 4,
    borderBottomWidth: 1,
    borderBottomColor: "#333444",
  },
});
