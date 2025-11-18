import Link from "next/link";
import { Post as PostType } from "../types/Post";

const Post: React.FC<{ post: PostType }> = ({ post }) => {
  return (
    <Link href={`/dashboard/${post.id}`}>
      <h3>{post.title}</h3>
    </Link>
  )
}

export default Post;