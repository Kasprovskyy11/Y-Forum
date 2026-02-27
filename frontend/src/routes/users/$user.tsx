import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import type { postInterface } from "../../services/getPostsService";
import { getUserData } from "../../services/getUserDataService.ts";
import type { UserData } from "../../services/getUserDataService.ts";
import Post from "../../components/posts/Post";
import LowerPanel from "../../components/UI/MobileUIComponents/LowerPanel.tsx";
import LeftPanel from "../../components/UI/DesktopUI/LeftPanel.tsx";
import { useUser } from "../../contexts/userContext.tsx";
import config from "../../config.json";

export const Route = createFileRoute("/users/$user")({
  component: RouteComponent,
});

function RouteComponent() {
  const { user } = Route.useParams();
  const [userData, setUserData] = useState<UserData>();
  const [userPosts, setUserPosts] = useState<postInterface[]>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const Router = useRouter();
  const loggedUser = useUser();
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const providedData: UserData = await getUserData(user);
        setUserData(providedData);
        setUserPosts(providedData.posts);
        setLoading(false);
      } catch (error) {
        console.error(error);
        setError(true);
      }
    };
    fetchUserData();
  }, [user]);

  useEffect(() => {
    console.log(userData);
    console.log(userPosts);
  }, [userData, userPosts]);

  const handleLogout = () => {
    loggedUser.setUser(null);
    localStorage.clear();
    Router.navigate({ to: "/login" });
  };

  return (
    <div
      className="lg:grid lg:grid-cols-[1fr_4fr_0fr] h-screen [&::-webkit-scrollbar]:w-2
  [&::-webkit-scrollbar-track]:bg-gray-100
  [&::-webkit-scrollbar-thumb]:bg-gray-300
  dark:[&::-webkit-scrollbar-track]:bg-neutral-700
  dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500"
    >
      <LeftPanel />
      <div className="flex flex-col overflow-y-auto items-center justify-evenly gap-4 w-full">
        {error ? (
          <p>Error</p>
        ) : loading ? (
          <p className="text-white">Loading</p>
        ) : (
          <div className="w-full">
            <div className="m-6 border border-[#D9D9D9] rounded-2xl">
              <div>
                <img
                  src={`${config.path}/${userData?.profilePicture}`}
                  className="w-16 h-16 lg:w-32 lg:h-32 rounded-full m-6"
                />
              </div>
              <div className="m-8 flex justify-start gap-8 lg:text-2xl items-center">
                <p className="text-white">{userData?.username}</p>
                <p className="text-white opacity-60">{userData?.name}</p>
                <p className="text-white opacity-60 text-xl">
                  {userData?.birth_date}
                </p>
                <p className="text-white opacity-60 text-xl">
                  Total posts: {userPosts?.length}
                </p>
              </div>
              <div>
                {loggedUser?.user?.name === user && (
                  <button
                    className="w-1/4 h-12 bg-red-600 rounded-2xl m-6 text-white"
                    onClick={handleLogout}
                  >
                    Wyloguj się
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {userPosts
          ? userPosts.map((post) => (
              <Post
                id={post.id}
                text={post.text}
                name={post.name}
                username={post.username}
                likes={post.likes}
                photo={post.photo}
                profilePhoto={post.profilePhoto}
                date={post.date}
              />
            ))
          : null}
      </div>

      <div className="fixed bottom-0 left-0 w-full lg:h-screen lg:overflow-y-auto lg:hidden">
        <LowerPanel />
      </div>
    </div>
  );
}
