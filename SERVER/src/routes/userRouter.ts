import express from "express";
import { userController } from "../controllers/userController";
const router = express.Router();
router.get("/userGiftList", async (req, res) => {
  try {
    await userController.getUserGiftList(req, res);
  } catch (error) {
    console.error("Error in GET /userGiftList:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});
router.post("/addUserGiftList", async (req, res) => {
  try {
    await userController.addUserGiftList(req, res);
  } catch (error) {
    console.error("Error in POST /addUserGiftList:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});
router.patch("/deleteUserGiftList", async (req, res) => {
  try {
    await userController.deleteUserGiftList(req, res);
  } catch (error) {
    console.error("Error in PATCH /deleteUserGiftList:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});
export default router;
