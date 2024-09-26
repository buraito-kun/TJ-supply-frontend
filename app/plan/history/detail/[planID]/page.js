"use client";

import SideBar from "@/components/Sidebar";
import Breadcrumb from "@/components/Breadcrumb";
import Footer from "@/components/Footer";
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { redirect } from "next/navigation";
import Link from "next/link";
import BackButton from "@/components/BackButton";
import Translator from "@/translator";

export default function PlanHistoryDetail({ params }) {
  const session = useSession();
  const role = session?.data?.data?.role;

  const [plan, setPlan] = useState({});

  useEffect(() => {
    if (session?.status === "authenticated") {
    } else if (session?.status === "unauthenticated") {
      redirect("/");
    }
    const fetchData = async () => {
      const data = await fetchPlanData();
      setPlan(data);
    };
    fetchData();
  }, [session, role]);

  const fetchPlanData = async () => {
    const res = await fetch(
      process.env.NEXT_PUBLIC_API_URL + `plan/${params.planID}`
    );
    if (!res.ok) {
      throw new Error("Failed to fetch data");
    }
    return await res.json();
  };

  return (
    <>
      <div className="flex w-screen h-screen">
        <SideBar className="flex w-auto h-auto" />
        <div className="flex flex-col w-full h-full">
          <Breadcrumb className="w-auto h-auto" />
          <div className="flex flex-col bg-white w-full h-full overflow-y-auto whitespace-nowrap place-items-center pt-[50px]">
            <div className="flex flex-row w-full place-items-center">
              <Link href="/plan/history" className="ml-20">
                <BackButton text="ย้อนกลับ" />
              </Link>
              <h2 className="ml-20 text-black text-2xl font-bold font-['Sarabun']">
                รายละเอียดแผนการผลิต
              </h2>
            </div>
            <div className="w-full h-full mt-[50px]">
              <h3 className="text-black font-normal font-['Sarabun'] text-xl ml-40">
                ข้อมูลแผนการผลิต
              </h3>
              <div
                key={plan?.data?.ID}
                className="ml-10 mr-20 mt-10 flex flex-col place-content-center place-items-center border border-[#cecece] rounded-xl"
              >
                <div className="w-full flex place-content-between px-5 mt-2">
                  <div className="flex">
                    <h3 className="text-black text-xl font-bold font-['Sarabun']">
                      {plan?.data?.planName}
                    </h3>
                  </div>
                  <div className="flex place-items-center">
                    <h3 className="text-gray-500 text-base font-normal font-['Sarabun'] mr-3">
                      {plan?.data?.startDate.split("T")[0]} -{" "}
                      {plan?.data?.endDate.split("T")[0]}
                    </h3>
                    <h3 className="text-[#13A452] bg-[#adff9d] text-center w-16 rounded-xl text-xl font-bold font-['Sarabun']">
                      สำเร็จ
                    </h3>
                  </div>
                </div>
                <h4 className="text-gray-500 w-full text-base font-normal font-['Sarabun'] ml-16 mt-5">
                  รายละเอียด
                </h4>
                <div className="w-[92%] h-auto my-[20px] flex flex-col place-content-start">
                  {plan?.data?.productionLot.map((productionLot) => {
                    return (
                      <div key={productionLot.ID}>
                        <h3 className="text-black font-bold mt-5">
                          {productionLot.name}
                        </h3>
                        <div className="mt-5">
                          <div className="text-black font-bold">
                            <div className="bg-[#6494d3] rounded-t-3xl flex flex-row h-10 place-items-center">
                              <div className="w-4/12 text-center text-lg font-bold font-['Sarabun']">
                                ชื่อสิ่งของ
                              </div>
                              <div className="w-4/12 text-center text-lg font-bold font-['Sarabun']">
                                ชื่อสูตรการผลิต
                              </div>
                              <div className="w-2/12 text-center text-lg font-bold font-['Sarabun']">
                                สถานะ
                              </div>
                              <div className="w-1/12 text-center text-lg font-bold font-['Sarabun']">
                                ปัจจุบัน
                              </div>
                              <div className="w-1/12 text-center text-lg font-bold font-['Sarabun']">
                                เป้าหมาย
                              </div>
                            </div>
                          </div>
                          {productionLot.productionSub.map((productionSub) => {
                            return (
                              <div
                                key={productionSub.ID}
                                className="text-black"
                              >
                                <div className="flex flex-row w-full h-12 hover:bg-gray-200">
                                  <div className="w-4/12 text-start text-lg font-['Sarabun'] flex place-items-center place-content-start overflow-hidden">
                                    {Translator.item.icon}
                                    <h5 className="ml-1">
                                      {productionSub.formulaProject.toItem.name}
                                    </h5>
                                  </div>
                                  <div className="w-4/12 text-start text-lg font-['Sarabun'] flex place-items-center place-content-start overflow-hidden">
                                    {Translator.formula.icon}
                                    <h5 className="ml-1">
                                      {productionSub.formulaProject.name}
                                    </h5>
                                  </div>
                                  <div className="w-2/12 text-start text-lg font-['Sarabun'] flex place-items-center place-content-center">
                                    {productionSub.amountCurrent >=
                                    productionSub.amountRequire ? (
                                      <h3 className="text-[#13A452] bg-[#adff9d] w-12 text-sm rounded-xl text-center">
                                        สำเร็จ
                                      </h3>
                                    ) : (
                                      <h3 className="text-[#ff6600] bg-[#ffea8f] w-24 text-sm rounded-xl text-center">
                                        รอการประกอบ
                                      </h3>
                                    )}
                                  </div>
                                  <div className="w-1/12 text-start text-lg font-['Sarabun'] flex place-items-center place-content-center">
                                    <h5>{productionSub.amountCurrent}</h5>
                                  </div>
                                  <div className="w-1/12 text-start text-lg font-['Sarabun'] flex place-items-center place-content-center">
                                    <h5>{productionSub.amountRequire}</h5>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
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
