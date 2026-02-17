import { createFileRoute, useRouter } from "@tanstack/react-router";
import Post from "../components/posts/Post";
import axios from "axios";
import { useEffect, useState } from "react";
import MobileMain from "../components/UI/MobileMain";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  const user = localStorage.getItem("user");
  const Router = useRouter();
  if (!user) {
    Router.navigate({ to: "/login" });
  }

  interface postInterface {
    name: string;
    username: string;
    text: string;
    photo: string;
    likes: number;
  }

  const [posts, setPosts] = useState<postInterface[]>([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get("http://localhost/getPosts.php");
        console.log(response);
        console.log(response.data);
        setPosts(response.data);
      } catch (error) {
        console.error("Failed to fetch posts:", error);
      }
    };

    fetchPosts();
  }, []);

  return (
    <div className="">
      <MobileMain />
      <div className="flex flex-col items-center w-screen">
        {posts.map((post) => {
          return (
            <Post
              name={post.name}
              username={post.username}
              text={post.text}
              photo={post.photo}
              likes={post.likes}
            />
          );
        })}
      </div>
    </div>
  );
}
