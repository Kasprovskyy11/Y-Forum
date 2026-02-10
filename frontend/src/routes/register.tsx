import { createFileRoute, Link } from "@tanstack/react-router";
import CustomButton from "../components/forms/CustomButton";
import CustomInput from "../components/forms/CustomInput";
import YLogo from "../assets/YLogo.png";
import ProfilePhoto from "../assets/profile.png";
import { useState, useRef } from "react";

export const Route = createFileRoute("/register")({
  component: RouteComponent,
});

function RouteComponent() {
  const [stage, setStage] = useState(0);
  const [photo, setPhoto] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setPhoto(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="w-screen h-screen bg-black flex justify-center items-center flex-col">
      <div className="h-screen w-screen p-6 flex justify-center items-center flex-col gap-20 lg:w-[30vw] md:w-[50vh]">
        <img src={YLogo} className="scale-50 lg:scale-100"></img>
        <h1 className="text-white font-bold text-3xl">Create an account</h1>
        {stage == 0 ? (
          <>
            <div className="w-full flex flex-col justify-center gap-5">
              <CustomInput type="text" placeholder="email" />
              <CustomInput type="password" placeholder="password" />
              <CustomInput type="date" placeholder="data urodzenia" />
            </div>
            <div className="w-full flex flex-col justify-center items-center gap-5">
              <CustomButton
                text="Confirm"
                onClickFunction={() => setStage(1)}
              />
              <Link to="/login" className="text-blue-500 hover:text-blue-600">
                I have an account
              </Link>
            </div>
          </>
        ) : (
          <>
            <div className="w-full flex flex-col justify-center gap-5">
              <CustomInput type="text" placeholder="username" />
              <CustomInput type="text" placeholder="displayed username" />
              <div className="flex justify-center items-center">
                <img
                  src={photo || ProfilePhoto}
                  className="w-32 h-32 rounded-full object-cover border-2 border-gray-600"
                  alt="Profile"
                />
              </div>
              <div className="flex justify-center items-center">
                <label className="text-white flex flex-col gap-2">
                  Profile photo
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    ref={fileInputRef}
                    className="text-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-500 file:text-white hover:file:bg-blue-600"
                  />
                </label>
              </div>
            </div>
            <div className="w-full flex flex-col justify-center items-center gap-5">
              <CustomButton
                text="Register"
                // onClickFunction={() => setStage(1)}
              />
              <Link to="/login" className="text-blue-500 hover:text-blue-600">
                I have an account
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
