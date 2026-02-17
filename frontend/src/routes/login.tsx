import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import CustomInput from "../components/forms/CustomInput";
import CustomButton from "../components/forms/CustomButton";
import YLogo from "../assets/YLogo.png";
import { loginHandler, type LoginInterface } from "../services/loginService";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/login")({
  component: RouteComponent,
});

function RouteComponent() {
  const Router = useRouter();
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  // useEffect(() => {}, []);

  useEffect(() => {
    if (localStorage.getItem("user")) {
      Router.navigate({ to: "/" });
    }
  }, [Router]);

  const handleLogin = async () => {
    try {
      const data: LoginInterface = await loginHandler(login, password);
      console.log(data);
      if (data.success === 1) {
        localStorage.setItem("user", login);
        Router.navigate({ to: "/" });
      } else {
        setError("Błąd logowania, spróuj ponownie");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLogin(e.target.value);
  };
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  return (
    <div className="w-screen h-screen bg-black flex justify-center items-center flex-col">
      <div className="h-screen w-screen p-6 flex justify-center items-center flex-col gap-20 lg:w-[30vw] md:w-[50vh]">
        <img src={YLogo} className="scale-50 lg:scale-100" alt="Y Logo"></img>
        <h1 className="text-white font-bold text-3xl">Login to Y</h1>
        <div className="w-full flex flex-col justify-center items-center gap-5">
          <CustomInput
            type="text"
            placeholder="account name"
            onChangeFunction={handleLoginChange}
          />
          {/* <input type="text" onChange={handleLoginChange}></input> */}
          <CustomInput
            type="password"
            placeholder="password"
            onChangeFunction={handlePasswordChange}
          />
          <p className="text-red-600">{error}</p>
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
