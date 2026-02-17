import { useEffect, useState } from "react";
import { getPosts } from "../../services/getPostsService";
import type { postInterface } from "../../services/getPostsService";
import Post from "./Post";

export default function PostLayout() {
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const data: postInterface[] = await getPosts();
        setPosts(data);
      } catch (error) {
        console.error("Failed to fetch posts:", error);
      }
    };

    fetchPosts();
  }, []);

  const [posts, setPosts] = useState<postInterface[]>([]);
  return (
    <div className="flex flex-col items-center w-screen">
      {posts.length === 0 ? (
        <p className="text-red-600">Brak postów</p>
      ) : (
        posts.map((post) => {
          return (
            <Post
              key={post.name + post.text}
              name={post.name}
              username={post.username}
              text={post.text}
              photo={post.photo}
              likes={post.likes}
            />
          );
        })
      )}
    </div>
  );
}
