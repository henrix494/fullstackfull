import express from "express";
import { giftController } from "../controllers/giftController";
const router = express.Router();
// Define routes for gift operations
router.get("/", async (req, res) => {
  try {
    await giftController.getAllGifts(req, res);
  } catch (err) {
    console.error("Error in GET /gifts:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});
router.post("/new", async (req, res) => {
  console.log("hit");
  try {
    await giftController.createGift(req, res);
  } catch (err) {
    console.error("Error in POST /gifts:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});
router.post("/delete", async (req, res) => {
  try {
    await giftController.deleteGift(req, res);
  } catch (err) {
    console.error("Error in POST /gifts/delete:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
