interface CustomButtonProps {
  text: string;
}

export default function CustomButton({ text }: CustomButtonProps) {
  return (
    <div className="bg-white text-black text-xl font-bold w-full h-12 flex justify-center items-center rounded-md hover:bg-gray-200 cursor-pointer">
      <p>{text}</p>
    </div>
  );
}
