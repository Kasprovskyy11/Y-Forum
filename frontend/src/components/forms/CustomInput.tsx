import type React from "react";

interface CustomInputProps {
  type: string;
  placeholder: string;
  onChangeFunction?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function CustomInput({
  type,
  placeholder,
  onChangeFunction,
}: CustomInputProps) {
  return (
    <input
      type={type}
      placeholder={placeholder}
      maxLength={32}
      onChange={onChangeFunction}
      className="border-2 border-[#868686] outline-none text-white text-center w-full h-12 rounded-md"
    ></input>
  );
}
