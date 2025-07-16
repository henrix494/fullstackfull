"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authController = void 0;
const User_1 = __importDefault(require("../models/User")); // Assuming you have a User model defined
exports.authController = {
    login: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        // Logic for user login
        const { username, password } = req.body;
        if (!username || !password) {
            return res
                .status(400)
                .json({ error: "Username and password are required" });
        }
        try {
            const user = yield User_1.default.find({
                username: username,
            });
            if (user.length === 0) {
                return res.status(404).json({ error: "User not found" });
            }
            else {
                const isPasswordValid = user[0].password === password; // Replace with proper password hashing check
                if (!isPasswordValid) {
                    return res.status(401).json({ error: "Invalid password" });
                }
                return res
                    .status(200)
                    .json({ message: "Login successful", user: user[0] });
            }
        }
        catch (error) {
            console.error("Error during login:", error);
            return res.status(500).json({ error: "Internal server error" });
        }
    }),
    register: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        // Logic for user registration
        if (!req.body) {
            return res.status(400).json({ error: "Request body is required" });
        }
        const { email, username, password } = yield req.body;
        if (!email || !username || !password) {
            return res
                .status(400)
                .json({ error: "Email, username and password are required" });
        }
        try {
            const existingUser = yield User_1.default.find({ username: username });
            if (existingUser.length > 0) {
                return res.status(409).json({ error: "User already exists" });
            }
            const newUser = new User_1.default({ email, username, password }); // Replace with proper password hashing
            yield newUser.save();
            return res
                .status(201)
                .json({ message: "User registered successfully", user: newUser });
        }
        catch (error) {
            console.error("Error during registration:", error);
            return res.status(500).json({ error: "Internal server error" });
        }
    }),
};
//# sourceMappingURL=authController.js.map