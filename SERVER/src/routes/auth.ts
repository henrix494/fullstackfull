import express from "express";
import { authController } from "../controllers/authController";
const router = express.Router();
router.post("/login", async (req, res) => {
  try {
    await authController.login(req, res);
  } catch (err) {
    console.error("Error in GET /auth/login:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});
router.post("/register", async (req, res) => {
  try {
    await authController.register(req, res);
  } catch (err) {
    console.error("Error in POST /auth/register:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});
export default router;
