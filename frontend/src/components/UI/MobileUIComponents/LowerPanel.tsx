import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHouse, faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import DeepSeek from "../../../assets/deepseek.png";

export default function LowerPanel() {
  return (
    <div className="w-full h-24 flex justify-evenly items-center">
      <FontAwesomeIcon icon={faHouse} className="text-white text-4xl" />
      <FontAwesomeIcon
        icon={faMagnifyingGlass}
        className="text-white text-4xl"
      />
      <img src={DeepSeek} className="w-12" />
    </div>
  );
}
