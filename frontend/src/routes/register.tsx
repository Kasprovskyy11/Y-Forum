import { createFileRoute, Link } from "@tanstack/react-router";
import CustomButton from "../components/forms/CustomButton";
import CustomInput from "../components/forms/CustomInput";
import YLogo from "../assets/YLogo.png";

export const Route = createFileRoute("/register")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="w-screen h-screen bg-black flex justify-center items-center flex-col">
      <div className="h-screen w-screen p-6 flex justify-center items-center flex-col gap-20 lg:w-[30vw] md:w-[50vh]">
        <img src={YLogo} className="scale-50 lg:scale-100"></img>
        <h1 className="text-white font-bold text-3xl">Create an account</h1>
        <div className="w-full flex flex-col justify-center gap-5">
          <CustomInput type="text" placeholder="email" />
          <CustomInput type="password" placeholder="password" />
          <CustomInput type="date" placeholder="data urodzenia" />
        </div>
        <div className="w-full flex flex-col justify-center items-center gap-5">
          <CustomButton text="Register" />
          <Link to="/login" className="text-blue-500 hover:text-blue-600">
            I have an account
          </Link>
        </div>
      </div>
    </div>
  );
}
