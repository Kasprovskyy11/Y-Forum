import { createFileRoute, useRouter } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  const Router = useRouter();
  const user = localStorage.getItem("user");

  if (!user) {
    Router.navigate({ to: "/login" });
  }
  return (
    <div className="p-2">
      <h3>Jeśli tu jesteś to jesteś zalogowany</h3>
    </div>
  );
}
