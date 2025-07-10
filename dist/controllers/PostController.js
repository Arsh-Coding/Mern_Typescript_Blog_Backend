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
exports.deletePost = exports.updatePost = exports.getPostById = exports.getAllPosts = exports.createPost = void 0;
const Post_1 = __importDefault(require("../models/Post"));
const createPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { title, content } = req.body;
        const newPost = yield Post_1.default.create({
            title,
            content,
            author: req.userId,
        });
        res.status(201).json(newPost);
    }
    catch (err) {
        res.status(500).json({ message: "Failed to create post" });
    }
});
exports.createPost = createPost;
const getAllPosts = (_, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const posts = yield Post_1.default.find().populate("author", "username");
        res.json(posts);
    }
    catch (err) {
        res.status(500).json({ message: "Failed to fetch posts" });
    }
});
exports.getAllPosts = getAllPosts;
const getPostById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const post = yield Post_1.default.findById(req.params.id).populate("author", "username");
        if (!post)
            return res.status(404).json({ message: "Post not found" });
        res.json(post);
    }
    catch (err) {
        res.status(500).json({ message: "Failed to fetch post" });
    }
});
exports.getPostById = getPostById;
// PUT /posts/:id
const updatePost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const post = yield Post_1.default.findById(id);
    if (!post)
        return res.status(404).json({ message: "Post not found" });
    if (post.author.toString() !== req.userId)
        return res.status(403).json({ message: "Not authorized" });
    post.title = req.body.title;
    post.content = req.body.content;
    yield post.save();
    res.json({ message: "Post updated", post });
});
exports.updatePost = updatePost;
// DELETE /posts/:id
const deletePost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const post = yield Post_1.default.findById(id);
    if (!post)
        return res.status(404).json({ message: "Post not found" });
    if (post.author.toString() !== req.userId)
        return res.status(403).json({ message: "Not authorized" });
    yield post.deleteOne();
    res.json({ message: "Post deleted" });
});
exports.deletePost = deletePost;
