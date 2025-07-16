import express from "express";
import User from "../models/User";
export const userController = {
  getUserGiftList: async (req: express.Request, res: express.Response) => {
    const { userId } = req.query;
    try {
      const user = await User.findById(userId).select("ListOfUsers");
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      return res.status(200).json(user.ListOfUsers || []);
    } catch (error) {
      console.error("Error in getUserGiftList:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  },
  addUserGiftList: async (req: express.Request, res: express.Response) => {
    const { userId, toAddUserId } = req.body;
    if (!userId || !toAddUserId) {
      return res
        .status(400)
        .json({ error: "User ID and To Add User ID are required" });
    }
    try {
      const userToFind = await User.findById(toAddUserId);
      if (!userToFind) {
        return res.status(404).json({ error: "User to add not found" });
      }
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      user?.ListOfUsers?.push(toAddUserId);
      await user.save();
      return res.status(200).json({ message: "User added to gift list" });
    } catch (error) {
      console.error("Error in addUserGiftList:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  },
  deleteUserGiftList: async (req: express.Request, res: express.Response) => {
    const { userId, toDeleteUserId } = req.body;
    if (!userId || !toDeleteUserId) {
      return res
        .status(400)
        .json({ error: "User ID and To Delete User ID are required" });
    }
    try {
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      user.ListOfUsers = user.ListOfUsers?.filter(
        (id) => id.toString() !== toDeleteUserId
      );
      await user.save();
      return res.status(200).json({ message: "User removed from gift list" });
    } catch (error) {
      console.error("Error in deleteuserGiftList:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  },
};
