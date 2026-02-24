import { useEffect, useState } from "react";
import { getPosts } from "../../services/getPostsService";
import type { postInterface } from "../../services/getPostsService";
import Post from "./Post";

interface PostLayoutProps {
  search: string;
}

export default function PostLayout({ search }: PostLayoutProps) {
  const [posts, setPosts] = useState<postInterface[]>([]);

  // const postTemp = [
  //   {
  //     id: 1,
  //     name: "test",
  //     username: "testowy",
  //     text: "lorem",
  //     photo: "/",
  //     // date: Date;,
  //     likes: 123,
  //   },
  // ];

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

  return (
    <div
      className="flex-1 min-h-0 overflow-y-auto flex flex-col items-center md:w-full gap-6 p-6 [&::-webkit-scrollbar]:w-2
  [&::-webkit-scrollbar-track]:bg-gray-100
  [&::-webkit-scrollbar-thumb]:bg-gray-300
  dark:[&::-webkit-scrollbar-track]:bg-neutral-700
  dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500"
    >
      {search ? (
        posts
          .filter(
            (post) =>
              post.text.toLowerCase().includes(search.toLowerCase()) ||
              post.name.toLowerCase().includes(search.toLowerCase()) ||
              post.username.toLowerCase().includes(search.toLowerCase()),
          )
          .map((post) => (
            <Post
              key={post.name + post.text}
              id={post.id}
              name={post.name}
              username={post.username}
              text={post.text}
              photo={post.photo}
              profilePhoto={post.profilePhoto}
              likes={post.likes}
              date={post.date}
            />
          ))
      ) : posts.length === 0 ? (
        <p className="text-red-600 mt-4">Brak postów</p>
      ) : (
        posts.map((post) => (
          <Post
            key={post.name + post.text}
            id={post.id}
            name={post.name}
            username={post.username}
            text={post.text}
            photo={post.photo}
            profilePhoto={post.profilePhoto}
            likes={post.likes}
            date={post.date}
          />
        ))
      )}
    </div>
  );
}
