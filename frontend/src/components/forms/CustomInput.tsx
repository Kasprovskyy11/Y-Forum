interface CustomInputProps {
  type: string;
  placeholder: string;
}

export default function CustomInput({ type, placeholder }: CustomInputProps) {
  return (
    <input
      type={type}
      placeholder={placeholder}
      className="border-2 border-[#868686] outline-none text-white text-center w-full h-12 rounded-md"
    ></input>
  );
}
