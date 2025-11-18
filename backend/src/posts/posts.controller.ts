import { Router, Request, Response } from "express";
import { add, getAll, update, remove } from "./posts.service.js";
import { Post } from "../db/sequelize.js";
import { adminOnly, authMiddleware } from '../middleware.js';

const postsRouter = Router();

postsRouter.get('/', async (req: Request, res: Response) => {
  const userId = req.query.userId as string;

  if (!userId) {
    return res.status(400).json({ error: "Missing userId in query parameters" });
  }

  try {
    const posts = await getAll(Number(userId));
    return res.status(200).json({ posts: posts as Post[] });
  } catch (error) {
    console.error('Failed to fetch posts:', error);
    return res.status(500).json({ error: "Failed to fetch posts", details: (error as Error).message });
  }
});

postsRouter.post('/', authMiddleware, adminOnly, async (req: Request, res: Response) => {
  const { title, description, userId } = req.body.post;
  if (typeof title !== 'string' || !userId) {
    return res.status(400).json({ error: "Invalid or missing post in request body" });
  }

  try {
    const newPost = await add(title, description, Number(userId));
    return res.status(201).json({ post: newPost });
  } catch (error) {
    console.error('Error creating post:', error);
    return res.status(500).json({ error: "Failed to create post", details: (error as Error).message });
  }
});

postsRouter.put('/:id', authMiddleware, adminOnly, async (req: Request, res: Response) => {
  const { id } = req.params;
  const { updates } = req.body;

  if (!id || !updates) {
    return res.status(400).json({ error: "Invalid or missing id or updates in request" });
  }

  try {
    await update(Number(id), updates);
    return res.status(200).json({ success: true });
  } catch (error) {
    return res.status(500).json({ error: "Failed to update post" });
  }
});

postsRouter.delete('/:id', authMiddleware, adminOnly, async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ error: "Invalid or missing id in request" });
  }

  try {
    await remove(Number(id));
    return res.status(200).json({ success: true });
  } catch (error) {
    return res.status(500).json({ error: "Failed to delete post" });
  }
});

export default postsRouter;