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
exports.getMe = exports.login = exports.register = void 0;
const User_1 = __importDefault(require("../models/User"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_1 = require("../validators/user");
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const parsed = user_1.registerSchema.safeParse(req.body);
    if (!parsed.success)
        return res.status(400).json(parsed.error);
    const { username, email, password } = parsed.data;
    const existing = yield User_1.default.findOne({ email });
    if (existing)
        return res.status(400).json({ message: "Email already exists" });
    const hashed = yield bcryptjs_1.default.hash(password, 10);
    const user = new User_1.default({ username, email, password: hashed });
    yield user.save();
    const token = jsonwebtoken_1.default.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: "1d",
    });
    res.status(201).json({
        token,
        user: {
            id: user._id,
            username: user.username,
            email: user.email,
        },
    });
});
exports.register = register;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const parsed = user_1.loginSchema.safeParse(req.body);
    if (!parsed.success)
        return res.status(400).json(parsed.error);
    const { email, password } = parsed.data;
    const user = yield User_1.default.findOne({ email });
    if (!user)
        return res.status(400).json({ message: "Invalid credentials" });
    const match = yield bcryptjs_1.default.compare(password, user.password);
    if (!match)
        return res.status(400).json({ message: "Invalid credentials" });
    const token = jsonwebtoken_1.default.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: "1d",
    });
    res.json({
        token,
        user: { id: user._id, username: user.username, email: user.email },
    });
});
exports.login = login;
const getMe = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield User_1.default.findById(req.userId).select("-password");
    if (!user)
        return res.status(404).json({ message: "User not found" });
    res.json({ user });
});
exports.getMe = getMe;
