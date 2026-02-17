import { useEffect, useState } from "react";

interface PostProps {
  name: string;
  username: string;
  date?: Date;
  text: string;
  profilePhoto?: string;
  photo: string;
  likes: number;
}

export default function Post({
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
  useEffect(() => {
    if (text.length > 500) {
      setAltText(text.slice(0, 500));
      setLongText(true);
    }
  }, [text]);
  return (
    <>
      <div className="bg-black w-[80vw] max-h-[60vh] flex flex-col py-5">
        <div className="h-[20%] flex justify-evenly items-center">
          <div className="bg-white rounded-full w-10 h-10"></div>
          <p className="text-white">{name}</p>
          <p className="text-white opacity-60">{username}</p>
          <p className="text-white opacity-60">{}</p>
          <p className="text-white opacity-60">...</p>
        </div>
        <div className="h-[80%] text-white text-center py-5">
          {longText ? (
            <>
              <p>
                {altText} <span className="text-blue-400">Zobacz więcej</span>
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
