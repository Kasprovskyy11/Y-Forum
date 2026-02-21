import { useRouter } from "@tanstack/react-router";
import { useEffect, useState } from "react";

interface PostProps {
  id: number;
  name: string;
  username: string;
  date?: string;
  text: string;
  profilePhoto?: string;
  photo: string;
  likes: number;
}

export default function Post({
  id,
  name,
  username,
  date,
  text,
  photo,
  profilePhoto,
  likes,
}: PostProps) {
  const [longText, setLongText] = useState(false);
  const [altText, setAltText] = useState("");
  const Router = useRouter();
  useEffect(() => {
    if (text.length > 500) {
      setAltText(text.slice(0, 500));
      setLongText(true);
    }
  }, [text]);

  //* Alternatywna forma:
  // PostProps) {
  //   const Router = useRouter();
  //   const longText = text.length > 500;
  //   const altText = longText ? text.slice(0, 500) : text;
  //   return (
  return (
    <>
      <div className="bg-black w-[80vw] overflow-y-auto md:w-2/3 flex flex-col py-5 border border-[#2F3336] rounded-2xl">
        <div className="h-[20%] flex justify-evenly items-center">
          <div className="bg-white rounded-full w-10 h-10"></div>
          <p
            className="text-white"
            onClick={() => {
              Router.navigate({ to: `/users/${}` });
            }}
          >
            {username}
          </p>
          <p className="text-white opacity-60">{name}</p>
          <p className="text-white opacity-60">
            {date ? new Date(date).toLocaleDateString() : "brak daty"}
          </p>
          <p className="text-white opacity-60">...</p>
        </div>
        <div className="min-h-[80%] text-white text-center py-5 px-2 lg:p-5">
          {longText ? (
            <>
              <p>
                {altText}{" "}
                <span
                  onClick={() => Router.navigate({ to: `/posts/${id}` })}
                  className="text-blue-400 cursor-pointer"
                >
                  Zobacz więcej
                </span>
              </p>
            </>
          ) : (
            text
          )}
        </div>
      </div>
    </>
  );
}
