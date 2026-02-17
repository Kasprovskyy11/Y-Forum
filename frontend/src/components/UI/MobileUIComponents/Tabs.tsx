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
        className={`w-full h-1 bg-blue-600 rounded-2xl px-8 duration-300 ${activeState == id ? null : "opacity-0"}`}
      ></div>
    </div>
  );
}
