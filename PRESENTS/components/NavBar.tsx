import { UserTypes } from "@/@types/userTypes";
import storage from "@/storage/store";
import { Ionicons } from "@expo/vector-icons";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { router } from "expo-router";
import { useState } from "react";
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Clipboard,
} from "react-native";
import SettingModel from "./SettingModel";

export default function NavBar({
  onMenuPress,
  onGiftAdded,
  refetchList,
  refechMulti,
  combinedGifts,
}: {
  onMenuPress?: () => void;
  onGiftAdded?: () => void;
  refetchList?: () => void;
  combinedGifts?: any[];
}) {
  const [settingsModelVisible, setSettingsModelVisible] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);
  const [addGiftVisible, setAddGiftVisible] = useState(false);
  const [addGiftListVisible, setAddGiftListVisible] = useState(false);
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [giftName, setGiftName] = useState("");
  const [giftLink, setGiftlink] = useState("");
  const [userid, setUserId] = useState("");
  const handleMenuPress = () => {
    setMenuVisible(true);
    if (onMenuPress) onMenuPress();
  };
  const queryClient = useQueryClient();
  const handleClose = () => setMenuVisible(false);
  const settingsModelVisibleHandler = () => {
    setSettingsModelVisible(true);
  };
  const handleLogOut = () => {
    storage
      .remove({ key: "user" })
      .then(() => {
        router.replace("/(tabs)/login/login");
        setMenuVisible(false);
        queryClient.clear();
        if (onMenuPress) onMenuPress();
      })

      .catch((err) => {
        console.error("Failed to log out:", err);
      });
  };

  const handleAddGift = () => {
    setAddGiftVisible(true);
  };

  const handleAddGiftClose = () => {
    setAddGiftVisible(false);
    setDescription("");
    setPrice("");
  };
  const mutation = useMutation({
    mutationFn: async () => {
      const user: UserTypes = await storage.load({ key: "user" });
      const giftData = {
        userId: user.user._id,
        giftName: giftName,
        giftLink: giftLink,
        giftPrice: price,
        giftDescription: description,
      };
      try {
        const res = await fetch("http://10.100.102.11:3000/gifts/new", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(giftData),
        });
        if (!res.ok) {
          throw new Error("Failed to add gift");
        }
        const data = await res.json();
        console.log("Gift added successfully:", data);
      } catch (error) {
        console.error("Error adding gift:", error);
      }
    },
  });
  const handleGiftSubmit = async () => {
    await mutation.mutateAsync();
    queryClient.invalidateQueries({ queryKey: ["userGifts"] });
    if (onGiftAdded) onGiftAdded(); // <-- trigger refetch
    setAddGiftVisible(false);
  };
  const handleCopyUserId = async () => {
    const user: UserTypes = await storage.load({ key: "user" });
    const userId = user.user._id;
    Clipboard.setString(userId);
    alert("User ID copied to clipboard! Send this to your friend.");
  };
  const addUserToGiftListMutation = useMutation({
    mutationFn: async () => {
      const user: UserTypes = await storage.load({ key: "user" });
      const addUserToGiftListJSON = {
        userId: user.user._id,
        toAddUserId: userid,
      };
      try {
        const res = await fetch(
          "http://10.100.102.11:3000/user/addUserGiftList",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(addUserToGiftListJSON),
          }
        );
        const data = await res.json();
        if (!res.ok) {
          console.error("Failed to add user to gift list:", data);
        }
      } catch (error) {
        console.error("Error adding user to gift list:", error);
      }
    },
  });
  const handleAddUserToGiftList = async () => {
    await addUserToGiftListMutation.mutateAsync();

    // Invalidate the list of users first
    queryClient.invalidateQueries({ queryKey: ["listOfUsers"] });

    // Then invalidate the multiUserGifts query, which depends on the listOfUsers
    queryClient.invalidateQueries({ queryKey: ["multiUserGifts"] });

    // Optionally refetch explicitly to update combinedGifts immediately
    if (refetchList) refetchList();
    if (refechMulti) refechMulti();

    setAddGiftListVisible(false); // Close modal after success
  };
  return (
    <>
      <View
        style={{
          paddingLeft: 18,
          alignContent: "center",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          paddingVertical: 8,
        }}
      >
        {/* Hamburger Menu */}
        <TouchableOpacity
          onPress={handleMenuPress}
          style={{
            padding: 8,
            marginRight: 10,
            borderRadius: 8,
            backgroundColor: "rgba(255,255,255,0.07)",
          }}
          activeOpacity={0.7}
        >
          <Ionicons name="menu" size={28} color="#fff" />
        </TouchableOpacity>
        {/* Title */}
        <Text
          style={{
            color: "white",
            fontSize: 12,
            fontWeight: "bold",
            textTransform: "uppercase",
            letterSpacing: 1,
            textAlign: "left",
            fontFamily: "SpaceMono",
            flex: 1,
            marginLeft: 8,
          }}
        >
          Buy me a gift
        </Text>
        {/* Add a gift button */}
        <TouchableOpacity onPress={handleAddGift}>
          <Text
            style={{
              color: "white",
              fontSize: 16,
              fontWeight: "bold",
              textTransform: "uppercase",
              letterSpacing: 1,
              textAlign: "left",
              fontFamily: "SpaceMono",
              marginRight: 8,
            }}
          >
            Add a gift
          </Text>
        </TouchableOpacity>
      </View>
      {/* Hamburger Menu Modal */}
      <Modal
        visible={menuVisible}
        transparent
        animationType="fade"
        onRequestClose={handleClose}
      >
        <Pressable
          style={{
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.4)",
            justifyContent: "flex-start",
            alignItems: "flex-start",
          }}
          onPress={handleClose}
        >
          <View
            style={{
              width: 220,
              backgroundColor: "#222",
              paddingVertical: 24,
              paddingHorizontal: 18,
              borderTopRightRadius: 18,
              borderBottomRightRadius: 18,
              marginTop: 60,
              elevation: 8,
              shadowColor: "#000",
              shadowOffset: { width: 2, height: 2 },
              shadowOpacity: 0.2,
              shadowRadius: 8,
            }}
          >
            <Text
              style={{
                color: "#fff",
                fontSize: 18,
                marginBottom: 18,
                fontWeight: "bold",
              }}
            >
              Menu
            </Text>
            <TouchableOpacity
              onPress={handleCopyUserId}
              style={{ marginBottom: 16 }}
            >
              <Text style={{ color: "#4f8cff", fontSize: 16 }}>
                Send an invite
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                setMenuVisible(false); // Close the menu first!
                setAddGiftListVisible(true); // Then open the invite modal
              }}
              style={{ marginBottom: 16 }}
            >
              <Text style={{ color: "#4f8cff", fontSize: 16 }}>
                Add a gift List
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={settingsModelVisibleHandler}
              style={{ marginBottom: 16 }}
            >
              <Text style={{ color: "#4f8cff", fontSize: 16 }}>Settings</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleLogOut}>
              <Text style={{ color: "#ff4f4f", fontSize: 16 }}>Logout</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Modal>
      {/* Add Gift Modal */}
      <Modal
        visible={addGiftVisible}
        transparent
        animationType="slide"
        onRequestClose={handleAddGiftClose}
      >
        <Pressable
          style={{
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.5)",
            justifyContent: "center",
            alignItems: "center",
          }}
          onPress={handleAddGiftClose}
        >
          <Pressable
            style={{
              width: 320,
              backgroundColor: "#23232b",
              borderRadius: 20,
              padding: 24,
              elevation: 10,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.2,
              shadowRadius: 12,
              alignItems: "center",
            }}
            onPress={(e) => e.stopPropagation()}
          >
            <Text
              style={{
                color: "#fff",
                fontSize: 22,
                fontWeight: "bold",
                marginBottom: 18,
              }}
            >
              Add a Gift
            </Text>
            <TextInput
              style={{
                width: "100%",
                backgroundColor: "#333",
                borderRadius: 10,
                padding: 12,
                color: "#fff",
                fontSize: 16,
                marginBottom: 14,
                borderWidth: 1,
                borderColor: "#444",
              }}
              placeholder="Gift name"
              placeholderTextColor="#aaa"
              value={giftName}
              onChangeText={setGiftName}
              keyboardType="default"
            />
            <TextInput
              style={{
                width: "100%",
                backgroundColor: "#333",
                borderRadius: 10,
                padding: 12,
                color: "#fff",
                fontSize: 16,
                marginBottom: 14,
                borderWidth: 1,
                borderColor: "#444",
              }}
              placeholder="Gift Description"
              placeholderTextColor="#aaa"
              value={description}
              onChangeText={setDescription}
            />
            <TextInput
              style={{
                width: "100%",
                backgroundColor: "#333",
                borderRadius: 10,
                padding: 12,
                color: "#fff",
                fontSize: 16,
                marginBottom: 14,
                borderWidth: 1,
                borderColor: "#444",
              }}
              placeholder="Gift Price"
              placeholderTextColor="#aaa"
              value={price}
              onChangeText={setPrice}
              keyboardType="numeric"
            />
            <TextInput
              style={{
                width: "100%",
                backgroundColor: "#333",
                borderRadius: 10,
                padding: 12,
                color: "#fff",
                fontSize: 16,
                marginBottom: 14,
                borderWidth: 1,
                borderColor: "#444",
              }}
              placeholder="Gift Link"
              placeholderTextColor="#aaa"
              value={giftLink}
              onChangeText={setGiftlink}
              keyboardType="default"
            />
            <TouchableOpacity
              onPress={handleGiftSubmit}
              style={{
                backgroundColor: "#4f8cff",
                borderRadius: 10,
                paddingVertical: 12,
                paddingHorizontal: 32,
                marginTop: 8,
              }}
            >
              <Text style={{ color: "#fff", fontWeight: "bold", fontSize: 16 }}>
                Add Gift
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleAddGiftClose}
              style={{ marginTop: 12 }}
            >
              <Text style={{ color: "#aaa" }}>Cancel</Text>
            </TouchableOpacity>
          </Pressable>
        </Pressable>
      </Modal>
      <Modal
        animationType="slide"
        transparent={true}
        visible={addGiftListVisible}
        onRequestClose={() => {
          setAddGiftListVisible(false);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>Enter an Invite</Text>
            <TextInput
              style={{
                width: "100%",
                backgroundColor: "#333",
                borderRadius: 10,
                padding: 14,
                color: "#fff",
                fontSize: 16,
                marginBottom: 18,
                borderWidth: 1,
                borderColor: "#4f8cff",
                textAlign: "center",
              }}
              placeholder="Paste invite code here"
              placeholderTextColor="#aaa"
              value={userid}
              onChangeText={setUserId}
              autoCapitalize="none"
              autoCorrect={false}
            />
            <TouchableOpacity
              style={{
                backgroundColor: "#4f8cff",
                borderRadius: 10,
                paddingVertical: 12,
                paddingHorizontal: 32,
                marginTop: 8,
                width: "100%",
                alignItems: "center",
              }}
              onPress={() => {
                // Handle invite logic here
                handleAddUserToGiftList();
              }}
            >
              <Text style={{ color: "#fff", fontWeight: "bold", fontSize: 16 }}>
                Submit Invite
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setAddGiftListVisible(false)}
              style={{ marginTop: 14 }}
            >
              <Text style={{ color: "#aaa" }}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <SettingModel
        visible={settingsModelVisible}
        onClose={() => setSettingsModelVisible(false)}
        combinedGifts={combinedGifts}
        refetchList={refetchList}
      />
    </>
  );
}
const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalView: {
    width: 300,
    backgroundColor: "#23232b",
    borderRadius: 20,
    padding: 24,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },
  noUsersText: {
    color: "#aaa",
    fontStyle: "italic",
    marginBottom: 16,
  },
  userCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2a2a3c",
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 18,
    marginBottom: 12,
    width: 220,
    justifyContent: "space-between",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  username: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "600",
  },
  removeBtn: {
    backgroundColor: "#ff4d4d",
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 14,
    marginLeft: 12,
  },
  removeBtnText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 14,
  },
  buttonRow: {
    flexDirection: "row",
    gap: 14,
    marginTop: 18,
    justifyContent: "center",
    width: "100%",
  },
  actionBtn: {
    flex: 1,
    borderRadius: 10,
    paddingVertical: 10,
    marginHorizontal: 4,
    alignItems: "center",
  },
  actionBtnText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
    letterSpacing: 0.5,
  },
  // ...other styles from NavBar...
});
