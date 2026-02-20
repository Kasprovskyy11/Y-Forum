import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { getPostData } from "../../services/getPostDataService";
import type { PostData } from "../../services/getPostDataService";
import LeftPanel from "../../components/UI/DesktopUI/LeftPanel";
import LowerPanel from "../../components/UI/MobileUIComponents/LowerPanel";

export const Route = createFileRoute("/posts/$post")({
  component: PostPage,
});

function PostPage() {
  const { post } = Route.useParams();
  const [data, setData] = useState<PostData>();

  useEffect(() => {
    const fetchPostData = async () => {
      try {
        const postData: PostData = await getPostData(post);
        console.log(post);
        console.log(postData);
        setData(postData);
      } catch (error) {
        console.log(error);
      }
    };

    fetchPostData();
  }, [post]);

  return (
    <div className="flex flex-col h-screen items-center lg:grid lg:grid-cols-[1fr_4fr_0fr] ">
      <LeftPanel />

      {/* Middle column - scrollable */}
      <div className="h-screen overflow-y-auto text-white">
        <div className="m-6 border border-[#2F3336] min-h-[80vh]">
          <div className="border-b border-[#2F3336] flex flex-wrap items-center gap-4 p-4 lg:gap-20 lg:pl-10">
            <div className="w-16 h-16 rounded-full bg-white flex-shrink-0"></div>
            <p className="font-medium">{data?.username}</p>
            <p className="opacity-60">{data?.name}</p>
            <p className="opacity-60">{data?.date}</p>
          </div>
          <div className="p-4 lg:p-12">
            <p className="whitespace-pre-wrap">{data?.text}</p>
          </div>
        </div>
      </div>

      {/* Right panel - fixed */}
      <div className="h-screen overflow-y-auto">
        <LowerPanel />
      </div>
    </div>
  );
}
