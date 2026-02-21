import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import type { postInterface } from "../../services/getPostsService";
import Post from "../../components/posts/Post";

export const Route = createFileRoute("/users/$user")({
  component: RouteComponent,
});

interface userPosts {
  posts: postInterface[];
}

function RouteComponent({ posts }: userPosts) {
  const { user } = Route.useParams();
  const [userData, setUserData] = useState();
  useEffect(() => {});

  return (
    <div>
      {posts.map((post) => (
        <Post
          id={post.id}
          name={post.name}
          username={post.username}
          text={post.text}
          date={post.date}
          likes={post.likes}
          photo={post.photo}
        />
      ))}
    </div>
  );
}
