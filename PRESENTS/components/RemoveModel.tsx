import { GiftType, UserTypes } from "@/@types/userTypes";
import storage from "@/storage/store"; // Adjust the import path as necessary
import { QueryClient, useMutation } from "@tanstack/react-query";
import React, { useState } from "react";
import { Button, Modal, StyleSheet, Text, View } from "react-native";
interface RemoveModelProps {
  visible?: boolean;
  onClose?: () => void;
  title?: GiftType | null;
  refetch: () => void; // Added refetch function to allow refreshing the gift list after deletion
}
export default function RemoveModel({
  visible,
  onClose,
  title,
  refetch,
}: RemoveModelProps) {
  const queryClient = new QueryClient();
  const [modalVisible, setModalVisible] = useState(visible);
  const mutation = useMutation({
    mutationFn: async () => {
      const user: UserTypes = await storage.load({ key: "user" });

      const deleteGiftInfo = {
        userId: user.user._id,
        giftId: title?._id,
      };
      try {
        const res = await fetch("http://10.100.102.11:3000/gifts/delete", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(deleteGiftInfo),
        });
        const data = await res.json();
        if (!res.ok) {
          console.log(data);
          throw new Error("Failed to delete gift");
        }

        console.log("Gift deleted successfully:", data);
      } catch (error) {
        console.error("Error deleting gift:", error);
        throw error; // Re-throw the error to handle it in the UI if needed
      }
    },
  });
  const handleSubmit = async () => {
    await mutation.mutateAsync();
    queryClient.invalidateQueries({ queryKey: ["userGifts"] });
    if (refetch) refetch();
  };
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={() => {
        setModalVisible(!modalVisible);
      }}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text style={styles.modalText}>
            Are you sure you want to remove {title?.giftName}?
          </Text>
          <View style={{ flexDirection: "row", gap: 10 }}>
            <Button
              color={"#ff4d4d"} // Red color for the button
              title="Cancel"
              onPress={() => onClose && onClose()}
            />
            <Button
              color={"#4CAF50"} // Green color for the button
              title="Confirm"
              onPress={() => {
                // Handle confirmation logic here
                console.log(`Confirmed removal of ${title}`);
                handleSubmit();
                onClose && onClose();
              }}
            />
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
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
  },
});
