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
exports.createdummyData = createdummyData;
exports.addGift = addGift;
const User_1 = __importDefault(require("../models/User"));
function createdummyData() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const existingUser = yield User_1.default.findOne({ username: "dummyUser" });
            if (existingUser) {
                console.log("Dummy user already exists");
                return;
            }
            const dummyUser = new User_1.default({
                username: "dummyUser",
                email: "dummyUser@example.com",
                password: "dummyPassword",
                listOfGifts: [
                    {
                        giftName: "Sample Gift",
                        giftLink: "https://example.com/sample-gift",
                        giftImage: "https://example.com/sample-gift-image.jpg",
                        giftPrice: 19.99,
                        giftDescription: "This is a sample gift description.",
                    },
                ],
            });
            yield dummyUser.save();
            console.log("Dummy user created");
        }
        catch (error) {
            console.error("Error creating dummy user:", error);
        }
    });
}
function addGift() {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        try {
            const userToAdd = yield User_1.default.findOne({ username: "dummyUser" });
            if (!userToAdd) {
                console.error("User not found");
                return;
            }
            const newGift = {
                giftName: "New Gift",
                giftLink: "https://example.com/new-gift",
                giftImage: "https://example.com/new-gift-image.jpg",
                giftPrice: 29.99,
                giftDescription: "This is a new gift description.",
            };
            (_a = userToAdd.listOfGifts) === null || _a === void 0 ? void 0 : _a.push(newGift);
            yield userToAdd.save();
            console.log("New gift added");
        }
        catch (error) {
            console.error("Error adding gift:", error);
        }
    });
}
//# sourceMappingURL=addTodb.js.map