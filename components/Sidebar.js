"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Translator from "@/translator";

export default function SideBar() {
  const session = useSession();
  const currentUrl = usePathname().split("/");
  currentUrl.shift();
  const role = session?.data?.data?.role;

  const signoutAction = async () => {
    const res = await fetch(process.env.NEXT_PUBLIC_API_URL + "user/logout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userID: session.data.data.ID }),
    });
    if (!res.ok) {
      throw new Error("Failed to fetch data");
    }
    signOut();
  };

  var menus = {};

  if (role) {
    if (role[0] === "m") {
      menus.dashboard = Translator.dashboard;
      menus.user = Translator.user;
      menus.item = Translator.item;
      menus.formula = Translator.formula;
      menus.plan = Translator.plan;
      menus.construct = Translator.construct;
      menus.qc = Translator.qc;
    }
    if (role[4] === "a") {
      menus.user = Translator.user;
    }
    if (role[5] === "f") {
      menus.item = Translator.item;
    }
    if (role[1] === "s") {
      menus.item = Translator.item;
      menus.construct = Translator.construct;
    }
    if (role[3] === "w") {
      menus.item = Translator.item;
      menus.construct = Translator.construct;
    }
    if (role[2] === "t") {
      menus.qc = Translator.qc;
    }
  }

  return (
    <>
      <div className="w-[350px] h-screen bg-white flex flex-col border-r-black border-r-2">
        <div className="w-full h-40 flex flex-wrap">
          <div className="w-full h-2/3 flex justify-center place-items-center">
            {role ? (
              <Link
                href={
                  role[0] === "m"
                    ? "/dashboard"
                    : role[1] === "s" || role[3] === "w"
                    ? "/item"
                    : "/qc"
                }
              >
                <Image
                  className="w-[260px] h-[60px]"
                  src="/logo.png"
                  width={260}
                  height={60}
                  alt="logo"
                  priority={true}
                />
              </Link>
            ) : null}
          </div>
          <div className="w-full h-1/3 flex">
            <h2 className="w-full h-full text-black text-2xl font-normal font-['Sarabun'] flex place-items-center justify-center">
              ผู้ใช้: {session?.data?.data?.name} {session?.data?.data?.surname}
            </h2>
          </div>
        </div>
        <div className="w-full h-[65px] text-black text-3xl font-bold font-['Sarabun'] text-left flex place-items-center border-t-[2px] border-t-black">
          <span className="ml-[20px]">รายการ</span>
        </div>
        <div className="w-full h-full overflow-y-auto">
          {Object.keys(menus).map((menu) => {
            if (currentUrl.includes(menu)) {
              return (
                <Link href={"/" + menu} key={menu}>
                  <div className="w-full h-[70px] flex place-items-center bg-gray-200 hover:bg-gray-300">
                    <div className="ml-[20px] mr-[10px] w-[40px] h-[40px]">
                      <div className="flex place-items-center place-content-center h-full scale-[133.33%]">
                        {menus[menu].icon}
                      </div>
                    </div>
                    <div className="w-full h-full">
                      <h3 className="w-full h-full text-black text-2xl font-normal font-['Sarabun'] flex place-items-center justify-start pl-5">
                        {menus[menu].name}
                      </h3>
                    </div>
                  </div>
                </Link>
              );
            } else {
              return (
                <Link href={"/" + menu} key={menu}>
                  <div className="w-full h-[70px] flex place-items-center hover:bg-gray-200">
                    <div className="ml-[20px] mr-[10px] w-[40px] h-[40px]">
                      <div className="flex place-items-center place-content-center h-full scale-[133.33%]">
                        {menus[menu].icon}
                      </div>
                    </div>
                    <div className="w-full h-full">
                      <h3 className="w-full h-full text-black text-2xl font-normal font-['Sarabun'] flex place-items-center justify-start pl-5">
                        {menus[menu].name}
                      </h3>
                    </div>
                  </div>
                </Link>
              );
            }
          })}
        </div>
        <div className="flex w-full h-[60px]">
          <button
            onClick={signoutAction}
            className="flex place-self-end w-[114px] h-[60px]"
          >
            <div className="w-full h-[60px]">
              <div className="w-full h-[60px] bg-red-400 hover:bg-red-500 flex place-items-center justify-center">
                <div className="scale-[133.33%] rotate-180">
                  {Translator.logout.icon}
                </div>
              </div>
            </div>
          </button>
          <Link
            href="/setting"
            className="w-[236px] h-[60px] flex place-self-end"
          >
            <div className="w-full h-[60px]">
              <div className="w-full h-[60px] left-0 top-0 bg-slate-400 hover:bg-slate-500 flex justify-center place-items-center">
                <div className="scale-[133.33%] rotate-180">
                  {Translator.setting.icon}
                </div>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </>
  );
}
