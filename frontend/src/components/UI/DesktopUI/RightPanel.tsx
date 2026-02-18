import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface PanelProps {
  onChangeFunction: (e) => void;
}

export default function RightPanel({ onChangeFunction }: PanelProps) {
  return (
    <div className="h-full w-full border-l-2 border-[#D9D9D9] lg:flex flex-col items-center hidden">
      <div className="relative w-9/10 m-6">
        <FontAwesomeIcon
          icon={faMagnifyingGlass}
          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm"
        />
        <input
          type="text"
          placeholder="Search..."
          className="w-full h-8 rounded-full border border-[#D9D9D9] outline-none text-white p-2 pl-8"
          onChange={onChangeFunction}
        />
      </div>
    </div>
  );
}
