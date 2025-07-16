import express from "express";
import User from "../models/User"; // Assuming you have a User model defined
export const authController = {
  login: async (req: express.Request, res: express.Response) => {
    // Logic for user login
    const { username, password } = req.body;
    if (!username || !password) {
      return res
        .status(400)
        .json({ error: "Username and password are required" });
    }
    try {
      const user = await User.find({
        username: username,
      });
      if (user.length === 0) {
        return res.status(404).json({ error: "User not found" });
      } else {
        const isPasswordValid = user[0].password === password; // Replace with proper password hashing check
        if (!isPasswordValid) {
          return res.status(401).json({ error: "Invalid password" });
        }
        return res
          .status(200)
          .json({ message: "Login successful", user: user[0] });
      }
    } catch (error) {
      console.error("Error during login:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  },
  register: async (req: express.Request, res: express.Response) => {
    // Logic for user registration
    if (!req.body) {
      return res.status(400).json({ error: "Request body is required" });
    }
    const { email, username, password } = await req.body;
    if (!email || !username || !password) {
      return res
        .status(400)
        .json({ error: "Email, username and password are required" });
    }
    try {
      const existingUser = await User.find({ username: username });
      if (existingUser.length > 0) {
        return res.status(409).json({ error: "User already exists" });
      }
      const newUser = new User({ email, username, password }); // Replace with proper password hashing
      await newUser.save();
      return res
        .status(201)
        .json({ message: "User registered successfully", user: newUser });
    } catch (error) {
      console.error("Error during registration:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  },
};
