import { createFileRoute, Link } from "@tanstack/react-router";
import CustomInput from "../components/forms/CustomInput";
import CustomButton from "../components/forms/CustomButton";
import YLogo from "../assets/YLogo.png";
import axios from "axios";
import { useState } from "react";

export const Route = createFileRoute("/login")({
  component: RouteComponent,
});

interface LoginInterface {
  success: number;
  admin: number;
}

function RouteComponent() {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const response = await axios.post<LoginInterface>(
        "http://localhost/logowanie.php",
        {
          login: login,
          password: password,
        },
      );

      console.log(response.data);
    } catch (error) {
      console.error("dupa blada", error);
    }
  };

  const handleLoginChange = (e) => {
    setLogin(e.target.value);
  };
  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  return (
    <div className="w-screen h-screen bg-black flex justify-center items-center flex-col">
      <div className="h-screen w-screen p-6 flex justify-center items-center flex-col gap-20 lg:w-[30vw] md:w-[50vh]">
        <img src={YLogo} className="scale-50 lg:scale-100"></img>
        <h1 className="text-white font-bold text-3xl">Login to Y</h1>
        <div className="w-full flex flex-col justify-center gap-5">
          <CustomInput
            type="text"
            placeholder="email"
            onChangeFunction={handleLoginChange}
          />
          {/* <input type="text" onChange={handleLoginChange}></input> */}
          <CustomInput
            type="password"
            placeholder="password"
            onChangeFunction={handlePasswordChange}
          />
        </div>
        <div className="w-full flex flex-col justify-center items-center gap-5">
          <CustomButton text="Login" onClickFunction={handleLogin} />
          <Link to="/register" className="text-blue-500 hover:text-blue-600">
            I don't have an account
          </Link>
        </div>
      </div>
    </div>
  );
}
