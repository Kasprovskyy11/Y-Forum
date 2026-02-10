import { createFileRoute, useRouter } from "@tanstack/react-router";
import Post from "../components/posts/Post";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  const user = localStorage.getItem("user");
  const Router = useRouter();
  if (!user) {
    Router.navigate({ to: "/login" });
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

  return (
    <div className="">
      <h3>Jeśli tu jesteś to jesteś zalogowany jako {user}</h3>
      <div className="flex flex-col items-center w-screen">
        {postExamples.map((post) => {
          return (
            <Post name={post.name} username={post.username} text={post.text} />
          );
        })}
      </div>
    </div>
  );
}
