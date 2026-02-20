import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { getPostData } from "../../services/getPostDataService";
import type { PostData } from "../../services/getPostDataService";

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
  return <div>{data?.text}</div>;
}
