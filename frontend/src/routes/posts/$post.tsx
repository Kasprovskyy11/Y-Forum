import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/posts/$post")({
  component: PostPage,
});

function PostPage() {
  const { post } = Route.useParams();
  return <div>{post}</div>;
}
