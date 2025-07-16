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
const giftController_1 = require("../controllers/giftController");
const router = express_1.default.Router();
// Define routes for gift operations
router.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield giftController_1.giftController.getAllGifts(req, res);
    }
    catch (err) {
        console.error("Error in GET /gifts:", err);
        res.status(500).json({ error: "Internal server error" });
    }
}));
router.post("/new", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("hit");
    try {
        yield giftController_1.giftController.createGift(req, res);
    }
    catch (err) {
        console.error("Error in POST /gifts:", err);
        res.status(500).json({ error: "Internal server error" });
    }
}));
router.post("/delete", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield giftController_1.giftController.deleteGift(req, res);
    }
    catch (err) {
        console.error("Error in POST /gifts/delete:", err);
        res.status(500).json({ error: "Internal server error" });
    }
}));
exports.default = router;
//# sourceMappingURL=giftRouter.js.map