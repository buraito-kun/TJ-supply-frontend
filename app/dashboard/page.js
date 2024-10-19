"use client";

import SideBar from "/components/Sidebar";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { redirect } from "next/navigation";
import Breadcrumb from "@/components/Breadcrumb";
import Footer from "@/components/Footer";
import Income from "@/components/dashboard/income";
import Expense from "@/components/dashboard/expense";
import Total from "@/components/dashboard/total";
import TopSellingProduct from "@/components/dashboard/topSellingProduct";
import ProductDemand from "@/components/dashboard/productDemand";
import QcPassFail from "@/components/dashboard/qcPassFail";
import PicknpayCount from "@/components/dashboard/picknpayCount";
import TopWorker from "@/components/dashboard/topWorker";

export default function Dashboard() {
  const session = useSession();
  const role = session?.data?.data?.role;

  useEffect(() => {
    if (session?.status === "authenticated") {
      if (role[0] !== "m") redirect("/");
    } else if (session?.status === "unauthenticated") {
      redirect("/");
    }
  }, [session, role]);

  return (
    <>
      <div className="flex w-screen h-screen">
        <SideBar className="flex w-auto h-auto" />
        <div className="flex flex-col w-full h-full">
          <Breadcrumb className="w-auto h-auto" />
          <div className="flex flex-col bg-gray-100 w-full h-full overflow-y-auto whitespace-nowrap place-items-center">
            <div className="w-full flex flex-wrap pl-5 pr-5 pt-5">
              <div className="w-1/4 h-[400px]">
                <div className="w-full h-full p-2">
                  <Income />
                </div>
              </div>
              <div className="w-1/4 h-[400px]">
                <div className="w-full h-full p-2">
                  <Expense />
                </div>
              </div>
              <div className="w-1/4 h-[400px]">
                <div className="w-full h-full p-2">
                  <Total />
                </div>
              </div>
              <div className="w-1/4 h-[400px]">
                <div className="w-full h-full p-2">
                  <TopSellingProduct />
                </div>
              </div>
              <div className="w-1/4 h-[400px]">
                <div className="w-full h-full p-2">
                  <ProductDemand />
                </div>
              </div>
              <div className="w-1/4 h-[400px]">
                <div className="w-full h-full p-2">
                  <QcPassFail />
                </div>
              </div>
              <div className="w-1/4 h-[400px]">
                <div className="w-full h-full p-2">
                  <PicknpayCount />
                </div>
              </div>
              <div className="w-1/4 h-[400px]">
                <div className="w-full h-full p-2">
                  <TopWorker />
                </div>
              </div>
            </div>
            <div className="flex flex-col-reverse place-content-center">
              <Footer />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
