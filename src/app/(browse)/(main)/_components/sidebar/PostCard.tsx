"use client";

import { Post } from "@prisma/client";
import { FC } from "react";
import Link from "next/link";
import { addPostView } from "@/actions/blog.actions";
import { usePathname } from "next/navigation";

interface Props {
  post: Post;
}

const PostCard: FC<Props> = ({ post }) => {
  const pathname = usePathname();

  return (
    <Link
      href={`/post/${post.id}`}
      key={post.id}
      className="text-wrap underline text-sm font-semibold"
      onClick={async () => {
        if (!pathname.includes(post.id)) {
          await addPostView(post.id);
        }
      }}
    >
      {post.title.slice(0, 110)}
      {post.title.length > 110 && "..."}
    </Link>
  );
};

export { PostCard };
