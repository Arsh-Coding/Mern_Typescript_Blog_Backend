import { Request, Response } from "express";
import Post from "../models/Post";

export const createPost = async (req: Request, res: Response) => {
  try {
    const { title, content } = req.body;

    const newPost = await Post.create({
      title,
      content,
      author: req.userId,
    });

    res.status(201).json(newPost);
  } catch (err) {
    res.status(500).json({ message: "Failed to create post" });
  }
};

export const getAllPosts = async (_: Request, res: Response) => {
  try {
    const posts = await Post.find().populate("author", "username");
    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch posts" });
  }
};

export const getPostById = async (req: Request, res: Response) => {
  try {
    const post = await Post.findById(req.params.id).populate(
      "author",
      "username"
    );
    if (!post) return res.status(404).json({ message: "Post not found" });
    res.json(post);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch post" });
  }
};

// PUT /posts/:id
export const updatePost = async (req: Request, res: Response) => {
  const { id } = req.params;
  const post = await Post.findById(id);
  if (!post) return res.status(404).json({ message: "Post not found" });

  if (post.author.toString() !== req.userId)
    return res.status(403).json({ message: "Not authorized" });

  post.title = req.body.title;
  post.content = req.body.content;
  await post.save();

  res.json({ message: "Post updated", post });
};

// DELETE /posts/:id
export const deletePost = async (req: Request, res: Response) => {
  const { id } = req.params;
  const post = await Post.findById(id);
  if (!post) return res.status(404).json({ message: "Post not found" });

  if (post.author.toString() !== req.userId)
    return res.status(403).json({ message: "Not authorized" });

  await post.deleteOne();
  res.json({ message: "Post deleted" });
};
