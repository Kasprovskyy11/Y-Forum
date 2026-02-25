import { useRouter } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import config from "../../config.json";

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
  const [showLightbox, setShowLightbox] = useState(false);
  const Router = useRouter();

  useEffect(() => {
    if (text.length > 500) {
      setAltText(text.slice(0, 500));
      setLongText(true);
    }
  }, [text]);

  return (
    <>
      <div className="bg-black w-[80vw] md:w-2/3 flex flex-col h-screen border border-[#2F3336] rounded-2xl overflow-hidden hover:bg-[#080808] transition-colors duration-200 cursor-pointer h-auto">
        {/* Header */}
        <div className="flex items-center gap-3 px-4 pt-4 pb-2 h-screen">
          <img
            src={`http://localhost/${profilePhoto}` || undefined}
            className="rounded-full w-10 h-10 cursor-pointer flex-shrink-0 object-cover ring-2 ring-transparent hover:ring-[#1D9BF0] transition-all"
            onClick={(e) => {
              e.stopPropagation();
              Router.navigate({ to: `/users/${name}` });
            }}
          />
          <div className="flex items-center gap-2 flex-wrap">
            <p
              className="text-white font-bold hover:underline cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                Router.navigate({ to: `/users/${name}` });
              }}
            >
              {username}
            </p>
            <p className="text-[#5B7083] text-sm">@{name}</p>
            <p className="text-[#5B7083] text-sm">·</p>
            <p className="text-[#5B7083] text-sm">
              {date ? new Date(date).toLocaleDateString() : "brak daty"}
            </p>
          </div>
          <p className="text-[#5B7083] ml-auto hover:text-white transition-colors">
            ···
          </p>
        </div>

        {/* Treść */}
        <div
          className="text-white text-[15px] leading-relaxed px-4 pb-3"
          onClick={() => Router.navigate({ to: `/posts/${id}` })}
        >
          {longText ? (
            <p>
              {altText}
              <span
                onClick={() => Router.navigate({ to: `/posts/${id}` })}
                className="text-[#1D9BF0] cursor-pointer hover:underline"
              >
                {" "}
                Zobacz więcej
              </span>
            </p>
          ) : (
            text
          )}
        </div>

        {/* Zdjęcie */}
        {photo && photo !== "null" && photo !== "/" && (
          <div
            className="mx-4 mb-3 rounded-2xl border border-[#2F3336] overflow-hidden h-screen flex items-center justify-center bg-black"
            onClick={() => Router.navigate({ to: `/posts/${id}` })}
          >
            <img
              src={`http://${config.path}/${photo}`}
              alt={altText || "post photo"}
              loading="lazy"
              onClick={(e) => {
                e.stopPropagation();
                setShowLightbox(true);
              }}
              className="w-full object-contain cursor-pointer"
            />
          </div>

          // {showLightbox && (
          //   <div
          //     className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
          //     onClick={() => setShowLightbox(false)}
          //   >
          //     <img
          //       src={`http://${config.path}/${photo}`}
          //       alt={altText || "post photo"}
          //       className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-lg"
          //     />
          //   </div>
          // )}
        )}

        {/* Footer — lajki */}
        <div className="flex items-center gap-1 px-4 pb-4 text-[#5B7083]">
          <button className="hover:text-pink-500 transition-colors text-lg">
            🤍
          </button>
          <span className="text-sm">{likes}</span>
        </div>
      </div>
    </>
  );
}
