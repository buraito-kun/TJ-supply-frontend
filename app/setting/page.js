"use client";

import { useSession } from "next-auth/react";
import { useEffect } from "react";
import SideBar from "@/components/Sidebar";
import { redirect } from "next/navigation";
import Breadcrumb from "@/components/Breadcrumb";
import Footer from "@/components/Footer";

export default function Setting() {
  const session = useSession();
  const role = session?.data?.data?.role;

  useEffect(() => {
    if (session?.status === "authenticated") {
    } else if (session?.status === "unauthenticated") {
      redirect("/");
    }
  }, [session]);

  return (
    <>
      <div className="flex w-screen h-screen">
        <SideBar className="flex w-auto h-auto" />
        <div className="flex flex-col w-full h-full">
          <Breadcrumb className="w-auto h-auto" />
          <div className="flex flex-col bg-gray-700 w-full h-full overflow-y-auto whitespace-nowrap place-items-center pt-[20px]">
            {/* <div className="bg-red-500 w-[500px] h-[500px] flex flex-col flex-shrink-0">

            </div>
            <div className="bg-green-500 w-[500px] h-[500px] flex flex-shrink-0">

            </div>
            <div className="bg-blue-500 w-[500px] h-[500px] flex flex-shrink-0">

            </div>
            <div className="bg-purple-500 w-[500px] h-[500px] flex flex-shrink-0">

            </div>
            <div className="bg-yellow-500 w-[500px] h-[500px] flex flex-shrink-0">

            </div> */}
            <div className="flex flex-col-reverse place-content-center">
              <Footer />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
