interface TabsInterface {
  text: string;
  onClickFunction: () => void;
  activeState: number;
  id: number;
}

export default function Tabs({
  text,
  onClickFunction,
  activeState,
  id,
}: TabsInterface) {
  return (
    <div
      className="flex flex-col items-center cursor-pointer"
      onClick={() => {
        onClickFunction();
      }}
    >
      <p>{text}</p>
      <div
        className={`h-1 bg-blue-600 rounded-2xl w-full transform scale-x-0 origin-left transition-transform duration-300 ${
          activeState === id ? "scale-x-100" : "scale-x-0"
        }`}
      ></div>
    </div>
  );
}
