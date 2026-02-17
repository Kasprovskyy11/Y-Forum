import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useEffect } from "react";
import MobileMain from "../components/UI/MobileMain";
import PostLayout from "../components/posts/PostLayout";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  const Router = useRouter();

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (!user) {
      Router.navigate({ to: "/login" });
    }
  }, []);

  return (
    <div className="flex flex-col h-screen">
      <MobileMain />
      <PostLayout />
    </div>
  );
}
