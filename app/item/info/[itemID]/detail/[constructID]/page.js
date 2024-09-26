"use client";

import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import SideBar from "@/components/Sidebar";
import Breadcrumb from "@/components/Breadcrumb";
import { redirect } from "next/navigation";
import Footer from "@/components/Footer";
import Link from "next/link";
import BackButton from "@/components/BackButton";

export default function ItemDetail({ params }) {
  const session = useSession();
  const role = session?.data?.data?.role;
  const [constructData, setConstructData] = useState({});
  const [showFormula, setShowFormula] = useState(false);

  useEffect(() => {
    if (session?.status === "authenticated") {
      if (role[0] !== "m") redirect("/");
    } else if (session?.status === "unauthenticated") {
      redirect("/");
    }
    refreshData();
  }, [session, role]);

  const fetchConstructData = async () => {
    const res = await fetch(
      process.env.NEXT_PUBLIC_API_URL + `construct/${params.constructID}`,
      {
        method: "GET",
      }
    );
    if (!res.ok) {
      throw new Error("Failed to fetch data");
    }
    return await res.json();
  };

  const refreshData = async () => {
    const constructData = await fetchConstructData();
    setConstructData(constructData);
  };

  return (
    <>
      <div className="flex w-screen h-screen">
        <SideBar className="flex w-auto h-auto" />
        <div className="flex flex-col w-full h-full">
          <Breadcrumb className="w-auto h-auto" />
          <div className="flex flex-col bg-white w-full h-full overflow-y-auto whitespace-nowrap place-items-center pt-[50px]">
            <div className="flex flex-row w-full place-items-center">
              <div className="flex place-items-center">
                <Link href={`/item/info/${params.itemID}`} className="ml-20">
                  <BackButton text="ย้อนกลับ" />
                </Link>
                <h2 className="ml-20 text-black text-2xl font-bold font-['Sarabun']">
                  รายละเอียดการผลิต
                </h2>
              </div>
            </div>
            <div className="bg-white w-full h-auto flex flex-col place-items-center place-content-center">
              <div className="w-[1000px] h-auto flex flex-col place-items-center place-content-between border-black border-2 rounded-[15px]">
                <div className="mx-10 my-10 w-[90%] h-auto flex flex-col text-black text-xl font-['Sarabun']">
                  <div className="w-full h-auto mb-5 flex text-black">
                    <label className="w-[100%]">
                      <h4 className="text-xl font-normal font-['Sarabun']">
                        ชื่อล็อตการผลิต
                      </h4>
                      <input
                        className="h-[50px] w-full border border-black mt-1 px-3 text-2xl font-normal font-['Sarabun'] rounded-md cursor-not-allowed"
                        type="text"
                        maxLength={100}
                        placeholder="ชื่อล็อตการผลิต"
                        value={
                          constructData?.data?.productionSub?.productionLot
                            ?.name
                        }
                        disabled
                      />
                    </label>
                  </div>
                  <div className="w-full h-auto mb-5 flex text-black">
                    <label className="w-[100%]">
                      <h4 className="text-xl font-normal font-['Sarabun']">
                        รหัสสินค้า
                      </h4>
                      <input
                        className="h-[50px] w-full border border-black mt-1 px-3 text-2xl font-normal font-['Sarabun'] rounded-md cursor-not-allowed"
                        type="text"
                        maxLength={100}
                        placeholder="รหัสสินค้า"
                        value={constructData?.data?.ID}
                        disabled
                      />
                    </label>
                  </div>
                  <div className="w-full h-auto mb-5 flex text-black">
                    <label className="w-[100%]">
                      <h4 className="text-xl font-normal font-['Sarabun']">
                        ชื่อสินค้าที่ต้องการผลิต
                      </h4>
                      <input
                        className="h-[50px] w-full border border-black mt-1 px-3 text-2xl font-normal font-['Sarabun'] rounded-md cursor-not-allowed"
                        type="text"
                        maxLength={100}
                        placeholder="ชื่อสินค้าที่ต้องการผลิต"
                        value={constructData?.data?.item?.name}
                        disabled
                      />
                    </label>
                  </div>
                  <div className="w-full h-auto mb-5 flex text-black">
                    <label className="w-[100%]">
                      <h4 className="text-xl font-normal font-['Sarabun']">
                        ชื่อสูตรการผลิต{" "}
                        {showFormula ? "(แสดงน้อยลง)" : "(แสดงเพิ่มเติม)"}
                      </h4>
                      <input
                        className="h-[50px] w-full border border-black mt-1 px-3 text-2xl font-normal font-['Sarabun'] rounded-md text-left"
                        type="button"
                        maxLength={100}
                        placeholder="ชื่อสูตรการผลิต"
                        value={
                          constructData?.data?.productionSub?.formulaProject
                            ?.name
                        }
                        onClick={() => {
                          setShowFormula(!showFormula);
                        }}
                      />
                    </label>
                  </div>
                  {showFormula && (
                    <div className="flex flex-wrap place-content-between border-black border rounded-[15px] px-5 pb-5">
                      {showFormula &&
                        constructData?.data?.productionSub?.formulaProject?.formulaItem?.map(
                          (data) => {
                            return (
                              <div
                                key={data.item.ID}
                                className="w-[48%] h-auto flex mt-3"
                              >
                                <label className="w-[100%]">
                                  <h4 className="text-xl font-normal font-['Sarabun'] text-ellipsis overflow-hidden">
                                    {data.item.name}
                                  </h4>
                                  <input
                                    className="h-[50px] w-full border border-black mt-1 px-3 text-2xl font-normal font-['Sarabun'] rounded-md cursor-not-allowed"
                                    type="number"
                                    min={1}
                                    defaultValue={data.amount}
                                    disabled
                                  />
                                </label>
                              </div>
                            );
                          }
                        )}
                    </div>
                  )}
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
