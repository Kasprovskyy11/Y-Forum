import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHouse, faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import DeepSeek from "../../../assets/deepseek.png";
import { Link } from "@tanstack/react-router";

export default function LowerPanel() {
  return (
    <div className="w-full h-24 flex justify-evenly items-center lg:hidden">
      <Link to="/">
        <FontAwesomeIcon icon={faHouse} className="text-white text-4xl" />
      </Link>
      <FontAwesomeIcon
        icon={faMagnifyingGlass}
        className="text-white text-4xl"
      />
      <a href="https://www.deepseek.com/en/" target="_blank">
        <img src={DeepSeek} className="w-12" />
      </a>
    </div>
  );
}
