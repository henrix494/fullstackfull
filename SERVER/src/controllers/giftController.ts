import express from "express";
import User from "../models/User";
export const giftController = {
  getAllGifts: async (req: express.Request, res: express.Response) => {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }

    try {
      const user = await User.findById(userId).select("username listOfGifts");

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      // Gifts are plain objects, just add the username field
      //@ts-ignore
      const gifts = (user.listOfGifts || []).map((gift) => ({
        //@ts-ignore
        ...(gift.toObject?.() ?? gift._doc ?? gift),
        username: user.username,
      }));

      return res.status(200).json(gifts);
    } catch (error) {
      console.error("Error fetching gifts:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  },

  getGiftById: async (req: express.Request, res: express.Response) => {
    // Logic to get a gift by ID
  },
  createGift: async (req: express.Request, res: express.Response) => {
    // Logic to create a new gift
    const { userId, giftName, giftLink, giftPrice, giftDescription } = req.body;
    if (!userId || !giftName || !giftLink || !giftPrice || !giftDescription) {
      return res.status(400).json({ error: "All fields are required" });
    }
    try {
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      const newGift = {
        giftName,
        giftLink,
        giftPrice,
        giftDescription,
      };
      user.listOfGifts = user.listOfGifts || [];
      user.listOfGifts.push(newGift);
      await user.save();
      return res.status(201).json(newGift);
    } catch (error) {
      console.error("Error creating gift:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  },
  updateGift: async (req: express.Request, res: express.Response) => {
    // Logic to update a gift
  },
  deleteGift: async (req: express.Request, res: express.Response) => {
    const { userId, giftId } = req.body;

    if (!userId || !giftId) {
      return res
        .status(400)
        .json({ error: "User ID and Gift ID are required" });
    }
    try {
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      user.listOfGifts = user.listOfGifts || [];
      user.listOfGifts = user.listOfGifts.filter(
        (gift) => gift._id?.toString() !== giftId
      );

      await user.save();
      return res.status(200).json({ message: "Gift deleted successfully" });
    } catch (error) {
      console.error("Error deleting gift:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  },
};
