import { Post } from "../db/sequelize.js";

export function getAll(userId: number) {
  return Post.findAll({ where: { userId } });
}

export function add(title: string, description?: string, content?: string, userId?: number) {
  const postData: any = { title, userId };
  if (description) postData.description = description;
  if (content) postData.content = content;
  return Post.create(postData);
}

export function update(postId: number, updates: { title?: string; completed?: boolean }) {
  return Post.update(updates, { where: { id: postId } });
}

export function remove(postId: number) {
  return Post.destroy({ where: { id: postId } });
}