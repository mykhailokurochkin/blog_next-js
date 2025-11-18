import { Post, User } from "../db/sequelize.js";

export function getAllPosts() {
  return Post.findAll({
    order: [['createdAt', 'DESC']]
  });
}

export function getById(postId: number) {
  return Post.findByPk(postId);
}

export function add(title: string, description?: string, content?: string, userId?: number) {
  const postData: any = { title, userId };
  if (description) postData.description = description;
  if (content) postData.content = content;
  if (userId) {
    return User.findByPk(userId).then((user: any) => {
      if (user) {
        postData.author = user.email;
      }
      return Post.create(postData);
    });
  }
  return Post.create(postData);
}

export function update(postId: number, updates: { title?: string; completed?: boolean }) {
  return Post.update(updates, { where: { id: postId } });
}

export function remove(postId: number) {
  return Post.destroy({ where: { id: postId } });
}