import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHouse, faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import DeepSeek from "../../../assets/deepseek.png";
import YLogo from "../../../assets/YLogo.png";
import { Link, useRouter } from "@tanstack/react-router";
import { useUser } from "../../../contexts/userContext";
import config from "../../../config.json";

export default function LeftPanel() {
  const Router = useRouter();
  const { user } = useUser();
  const name = user?.name;
  const profilePhoto = user?.profilePicture;
  return (
    <div className="h-full w-full border-r-2 border-[#D9D9D9] hidden lg:inline">
      <img src={YLogo} className="p-6 w-24" />
      <div className="flex flex-col justify-evenly items-start text-white text-3xl h-1/3 p-6">
        <Link to="/" className="flex gap-4 w-full cursor-pointer">
          <div className="w-8 flex justify-center">
            <FontAwesomeIcon icon={faHouse} />
          </div>
          <p className="text-2xl">Home</p>
        </Link>

        <div className="cursor-pointer flex items-center gap-4 w-full">
          <div className="w-8 flex justify-center">
            <FontAwesomeIcon icon={faMagnifyingGlass} />
          </div>
          <p className="text-2xl">Explore</p>
        </div>

        <a
          href="https://www.deepseek.com/en/"
          target="_blank"
          className="cursor-pointer flex items-center gap-4 w-full"
        >
          <div className="w-8 flex justify-center">
            <img src={DeepSeek} className="w-8 h-8" />
          </div>
          <p className="text-2xl">DeepSeek</p>
        </a>
      </div>

      <div className="flex flex-col justify-evenly items-center h-[40%] mt-[20%]">
        <div
          className="flex w-full items-center gap-2 cursor-pointer"
          onClick={() => {
            Router.navigate({ to: `/users/${name}` });
          }}
        >
          <img
            src={`${config.path}/${profilePhoto}`} // teraz bierze faktyczne profilowe
            className="w-16 h-16 rounded-full self-start ml-10"
            alt="Profile"
          />
          <p className="text-white text-md">{name}</p>
        </div>

        <button
          className="w-3/4 h-12 bg-white rounded-2xl cursor-pointer"
          onClick={() => Router.navigate({ to: "/addPost" })}
        >
          Post
        </button>
      </div>
    </div>
  );
}
