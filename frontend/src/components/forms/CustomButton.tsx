interface CustomButtonProps {
  text: string;
  onClickFunction?: () => void;
  disabled?: boolean;
}

export default function CustomButton({
  text,
  onClickFunction,
  disabled,
}: CustomButtonProps) {
  return (
    <button
      className={`bg-white text-black text-xl font-bold w-full h-12 flex justify-center items-center rounded-md hover:bg-gray-200 cursor-pointer ${disabled ? "opacity-50" : null}`}
      onClick={onClickFunction}
      disabled={disabled}
    >
      <p>{text}</p>
    </button>
  );
}
