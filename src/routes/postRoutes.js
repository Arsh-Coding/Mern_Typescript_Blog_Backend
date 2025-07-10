"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const PostController_1 = require("../controllers/PostController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = express_1.default.Router();
router.get("/", PostController_1.getAllPosts);
router.get("/:id", PostController_1.getPostById);
router.post("/", authMiddleware_1.protect, PostController_1.createPost);
router.put("/:id", authMiddleware_1.protect, PostController_1.updatePost);
router.delete("/:id", authMiddleware_1.protect, PostController_1.deletePost);
exports.default = router;
