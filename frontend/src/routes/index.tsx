import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import MobileMain from "../components/UI/MobileMain";
import PostLayout from "../components/posts/PostLayout";
import LowerPanel from "../components/UI/MobileUIComponents/LowerPanel";
import LeftPanel from "../components/UI/DesktopUI/LeftPanel";
import RightPanel from "../components/UI/DesktopUI/RightPanel";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  const Router = useRouter();

  const [search, setSearch] = useState("");

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (!user) {
      Router.navigate({ to: "/login" });
    }
  }, [Router]);

  return (
    <div className="flex flex-col h-screen items-center lg:grid lg:grid-cols-[1fr_3fr_1fr]">
      <LeftPanel />
      <div className="w-full flex flex-col h-screen items-center">
        <MobileMain />
        <PostLayout search={search} />
        <LowerPanel />
      </div>
      <RightPanel
        onChangeFunction={(e: React.ChangeEvent<HTMLInputElement>) =>
          setSearch(e.target.value)
        }
      />
    </div>
  );
}
