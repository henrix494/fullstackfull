import { UserTypes } from "@/@types/userTypes";
import storage from "@/storage/store";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import React from "react";
import { Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface SettingModelProps {
  visible?: boolean;
  onClose?: () => void;
  combinedGifts?: any[];
  refetchList?: () => void;
  refetchMulti?: () => void;
}

export default function SettingModel({
  visible,
  onClose,
  combinedGifts,
  refetchList,
  refetchMulti,
}: SettingModelProps) {
  const queryClient = useQueryClient();
  // Handler for removing a user (replace with your logic)
  const mutation = useMutation({
    mutationFn: async (id: string) => {
      const user: UserTypes = await storage.load({ key: "user" });
      const removeUserInfo = {
        userId: user.user._id,
        toDeleteUserId: id,
      };
      try {
        const res = await fetch(
          "http://10.100.102.11:3000/user/deleteUserGiftList",
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(removeUserInfo),
          }
        );
        if (!res.ok) {
          throw new Error("Failed to remove user");
        }
        const data = await res.json();
        console.log("User removed successfully:", data);
      } catch (error) {
        console.error("Error removing user:", error);
        throw error; // Re-throw the error to handle it in the UI if needed
      }
      // TODO: Implement remove logic
    },
  });
  const handleRemoveUser = async (id: string) => {
    await mutation.mutateAsync(id);
    queryClient.invalidateQueries({ queryKey: ["listOfUsers"] });
    queryClient.invalidateQueries({ queryKey: ["multiUserGifts"] });
    if (refetchList) refetchList();
    if (refetchMulti) refetchMulti();

    alert(`Remove user: ${id}`);
  };
  return (
    <Modal animationType="slide" transparent={true} visible={visible}>
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text style={styles.modalText}>Users</Text>
          {combinedGifts?.length === 0 && (
            <Text style={styles.noUsersText}>No users found.</Text>
          )}
          {combinedGifts?.map((gift, index) => (
            <View key={index} style={styles.userCard}>
              <Text style={styles.username}>{gift.username}</Text>
              <TouchableOpacity
                style={styles.removeBtn}
                onPress={() => handleRemoveUser(gift.userId)}
              >
                <Text style={styles.removeBtnText}>Remove</Text>
              </TouchableOpacity>
            </View>
          ))}
          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={[styles.actionBtn, { backgroundColor: "#ff4d4d" }]}
              onPress={() => onClose && onClose()}
            >
              <Text style={styles.actionBtnText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionBtn, { backgroundColor: "#4CAF50" }]}
              onPress={() => onClose && onClose()}
            >
              <Text style={styles.actionBtnText}>Confirm</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
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
});
