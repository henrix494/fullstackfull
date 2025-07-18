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
const express_1 = __importDefault(require("express"));
const userController_1 = require("../controllers/userController");
const router = express_1.default.Router();
router.get("/userGiftList", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield userController_1.userController.getUserGiftList(req, res);
    }
    catch (error) {
        console.error("Error in GET /userGiftList:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}));
router.post("/addUserGiftList", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield userController_1.userController.addUserGiftList(req, res);
    }
    catch (error) {
        console.error("Error in POST /addUserGiftList:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}));
router.patch("/deleteUserGiftList", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield userController_1.userController.deleteUserGiftList(req, res);
    }
    catch (error) {
        console.error("Error in PATCH /deleteUserGiftList:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}));
exports.default = router;
//# sourceMappingURL=userRouter.js.map