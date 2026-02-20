import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHouse, faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import DeepSeek from "../../../assets/deepseek.png";
import YLogo from "../../../assets/YLogo.png";

export default function LeftPanel() {
  return (
    <div className="h-full w-full border-r-2 border-[#D9D9D9] hidden lg:inline">
      <img src={YLogo} className="p-6 w-24" />
      <div className="flex flex-col justify-evenly items-start text-white text-3xl h-1/3 p-6">
        <div className="cursor-pointer flex items-center gap-4 w-full">
          <div className="w-8 flex justify-center">
            <FontAwesomeIcon icon={faHouse} />
          </div>
          <p className="text-2xl">Home</p>
        </div>

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
      <div className="flex justify-center h-[40%] items-end">
        <button className="w-3/4 h-12 bg-white rounded-2xl cursor-pointer">
          Post
        </button>
      </div>
    </div>
  );
}
