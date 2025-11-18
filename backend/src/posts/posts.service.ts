import { Post } from "../db/sequelize.js";

export function getAll(userId: number) {
  return Post.findAll({ where: { userId } });
}

export function add(title: string, description?: string, userId?: number) {
  return Post.create({ title, description, userId });
}

export function update(postId: number, updates: { title?: string; completed?: boolean }) {
  return Post.update(updates, { where: { id: postId } });
}

export function remove(postId: number) {
  return Post.destroy({ where: { id: postId } });
}