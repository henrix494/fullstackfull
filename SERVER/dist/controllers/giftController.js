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
exports.giftController = void 0;
const User_1 = __importDefault(require("../models/User"));
exports.giftController = {
    getAllGifts: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { userId } = req.query;
        if (!userId) {
            return res.status(400).json({ error: "User ID is required" });
        }
        try {
            const user = yield User_1.default.findById(userId).select("username listOfGifts");
            if (!user) {
                return res.status(404).json({ error: "User not found" });
            }
            // Gifts are plain objects, just add the username field
            //@ts-ignore
            const gifts = (user.listOfGifts || []).map((gift) => {
                var _a, _b, _c;
                return (Object.assign(Object.assign({}, ((_c = (_b = (_a = gift.toObject) === null || _a === void 0 ? void 0 : _a.call(gift)) !== null && _b !== void 0 ? _b : gift._doc) !== null && _c !== void 0 ? _c : gift)), { username: user.username }));
            });
            return res.status(200).json(gifts);
        }
        catch (error) {
            console.error("Error fetching gifts:", error);
            return res.status(500).json({ error: "Internal server error" });
        }
    }),
    getGiftById: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        // Logic to get a gift by ID
    }),
    createGift: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        // Logic to create a new gift
        const { userId, giftName, giftLink, giftPrice, giftDescription } = req.body;
        if (!userId || !giftName || !giftLink || !giftPrice || !giftDescription) {
            return res.status(400).json({ error: "All fields are required" });
        }
        try {
            const user = yield User_1.default.findById(userId);
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
            yield user.save();
            return res.status(201).json(newGift);
        }
        catch (error) {
            console.error("Error creating gift:", error);
            return res.status(500).json({ error: "Internal server error" });
        }
    }),
    updateGift: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        // Logic to update a gift
    }),
    deleteGift: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { userId, giftId } = req.body;
        if (!userId || !giftId) {
            return res
                .status(400)
                .json({ error: "User ID and Gift ID are required" });
        }
        try {
            const user = yield User_1.default.findById(userId);
            if (!user) {
                return res.status(404).json({ error: "User not found" });
            }
            user.listOfGifts = user.listOfGifts || [];
            user.listOfGifts = user.listOfGifts.filter((gift) => { var _a; return ((_a = gift._id) === null || _a === void 0 ? void 0 : _a.toString()) !== giftId; });
            yield user.save();
            return res.status(200).json({ message: "Gift deleted successfully" });
        }
        catch (error) {
            console.error("Error deleting gift:", error);
            return res.status(500).json({ error: "Internal server error" });
        }
    }),
};
//# sourceMappingURL=giftController.js.map