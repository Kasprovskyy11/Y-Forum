import { useState } from "react";
import YLogo from "../../assets/YLogo.png";
import Tabs from "./MobileUIComponents/Tabs";
import MainPostCreate from "../posts/MainPostCreate";

export default function MobileMain() {
  const [active, setActive] = useState(1);

  return (
    <>
      <header className="w-full">
        <div className="h-38 lg:h-auto lg:p-6 w-full flex flex-col justify-between items-center border-b-2 border-[#D9D9D9] text-white">
          <div className="lg:hidden">
            <img src={YLogo} className="w-12" alt="Logo Y" />
          </div>
          <div className="flex justify-start w-full px-6 lg:hidden">
            <div className="bg-red-950 rounded-full w-10 h-10"></div>
          </div>
          <div className="flex justify-evenly w-full pb-4">
            <Tabs
              text={"For you"}
              onClickFunction={() => {
                setActive(1);
              }}
              activeState={active}
              id={1}
            />
            <Tabs
              text={"Followed"}
              onClickFunction={() => {
                setActive(2);
              }}
              activeState={active}
              id={2}
            />
          </div>
        </div>
        <MainPostCreate />
      </header>
    </>
  );
}
