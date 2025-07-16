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
exports.userController = void 0;
const User_1 = __importDefault(require("../models/User"));
exports.userController = {
    getUserGiftList: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { userId } = req.query;
        try {
            const user = yield User_1.default.findById(userId).select("ListOfUsers");
            if (!user) {
                return res.status(404).json({ error: "User not found" });
            }
            return res.status(200).json(user.ListOfUsers || []);
        }
        catch (error) {
            console.error("Error in getUserGiftList:", error);
            return res.status(500).json({ error: "Internal server error" });
        }
    }),
    addUserGiftList: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        const { userId, toAddUserId } = req.body;
        if (!userId || !toAddUserId) {
            return res
                .status(400)
                .json({ error: "User ID and To Add User ID are required" });
        }
        try {
            const userToFind = yield User_1.default.findById(toAddUserId);
            if (!userToFind) {
                return res.status(404).json({ error: "User to add not found" });
            }
            const user = yield User_1.default.findById(userId);
            if (!user) {
                return res.status(404).json({ error: "User not found" });
            }
            (_a = user === null || user === void 0 ? void 0 : user.ListOfUsers) === null || _a === void 0 ? void 0 : _a.push(toAddUserId);
            yield user.save();
            return res.status(200).json({ message: "User added to gift list" });
        }
        catch (error) {
            console.error("Error in addUserGiftList:", error);
            return res.status(500).json({ error: "Internal server error" });
        }
    }),
    deleteUserGiftList: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        const { userId, toDeleteUserId } = req.body;
        if (!userId || !toDeleteUserId) {
            return res
                .status(400)
                .json({ error: "User ID and To Delete User ID are required" });
        }
        try {
            const user = yield User_1.default.findById(userId);
            if (!user) {
                return res.status(404).json({ error: "User not found" });
            }
            user.ListOfUsers = (_a = user.ListOfUsers) === null || _a === void 0 ? void 0 : _a.filter((id) => id.toString() !== toDeleteUserId);
            yield user.save();
            return res.status(200).json({ message: "User removed from gift list" });
        }
        catch (error) {
            console.error("Error in deleteuserGiftList:", error);
            return res.status(500).json({ error: "Internal server error" });
        }
    }),
};
//# sourceMappingURL=userController.js.map