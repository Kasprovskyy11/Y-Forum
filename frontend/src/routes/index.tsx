import { createFileRoute, useRouter } from "@tanstack/react-router";
import Post from "../components/posts/Post";
import axios from "axios";
import { useEffect, useState } from "react";

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

  const postExamples = [
    {
      name: "adolf",
      username: "@adolf",
      text: "sajhsjaksjaksjakjskajsk ajksjaks ajkskajsk jkasjk ",
      photo: "/",

      likes: 123,
    },
    {
      name: "addam",
      username: "@addamf",
      text: "sasas ajksjaks ajkskajsk jkasjk ",
      photo: "/",
      likes: 123,
    },
  ];

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
      <h3>Jeśli tu jesteś to jesteś zalogowany jako {user}</h3>
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
