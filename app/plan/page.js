"use client";

import { useSession } from "next-auth/react";
import { useState, useEffect, useRef } from "react";
import SideBar from "@/components/Sidebar";
import { redirect } from "next/navigation";
import Breadcrumb from "@/components/Breadcrumb";
import Footer from "@/components/Footer";
import SubmitButton from "@/components/SubmitButton";
import Link from "next/link";
import Translator from "@/translator";
import ReactToPrint from "react-to-print";
import Barcode from "@/components/Barcode";
import QRCode from "react-qr-code";
import GenQRcode from "@/components/QRcode";

export default function Plan() {
  const session = useSession();
  const role = session?.data?.data?.role;
  const componentRef = useRef();

  const [plan, setPlan] = useState([]);
  const [encryptedBarcode, setEncryptedBarcode] = useState([]);

  useEffect(() => {
    if (session?.status === "authenticated") {
      if (role[0] !== "m") redirect("/");
    } else if (session?.status === "unauthenticated") {
      redirect("/");
    }
    refreshData();
  }, [session, role]);

  const fetchData = async () => {
    const res = await fetch(process.env.NEXT_PUBLIC_API_URL + `plan`, {
      method: "GET",
    });
    if (!res.ok) {
      throw new Error("Failed to fetch data");
    }
    return await res.json();
  };

  const refreshData = async () => {
    const data = await fetchData();
    setPlan(data);
  };

  const fetchBarcodeData = async (planID) => {
    const barcodeData = await fetchBarcode(planID);
    await setEncryptedBarcode(barcodeData);
  };

  const fetchBarcode = async (planID) => {
    const res = await fetch(
      process.env.NEXT_PUBLIC_API_URL +
        `plan/barcode/${planID}?limit=999999999&page=1`
    );
    if (!res.ok) {
      throw new Error("Failed to fetch data.");
    }
    return await res.json();
  };

  return (
    <>
      <div className="flex w-screen h-screen">
        <SideBar className="flex w-auto h-auto" />
        <div className="flex flex-col w-full h-full">
          <Breadcrumb className="w-auto h-auto" />
          <div className="flex flex-col bg-white w-full h-full overflow-y-auto whitespace-nowrap place-items-center pt-5">
            <div className="w-full flex px-20 place-content-between">
              <div className="flex place-items-center place-content-center">
                <h2 className="text-black font-bold font-['Sarabun'] text-2xl">
                  แผนการผลิต
                </h2>
              </div>
              <div className="flex">
                <Link href="/plan/history">
                  <SubmitButton text="ประวัติแผนการผลิต" />
                </Link>
                <Link href="/plan/add" className="ml-3">
                  <SubmitButton text="เพิ่มแผนการผลิต" />
                </Link>
              </div>
            </div>
            <div className="w-full h-auto mt-[50px]">
              <h3 className="text-black font-normal font-['Sarabun'] text-xl ml-40">
                แผนกำลังดำเนินการ
              </h3>
              {plan?.data?.map((productionPlan) => {
                return (
                  <div
                    key={productionPlan.ID}
                    className="ml-10 mr-20 mt-20 pb-10 flex flex-col place-content-center place-items-center border border-[#cecece] rounded-xl shadow-lg"
                  >
                    <div className="w-full flex place-content-between px-5 mt-2">
                      <div className="flex">
                        <h3 className="text-black text-xl font-bold font-['Sarabun']">
                          {productionPlan.planName}
                        </h3>
                        <button className="h-full bg-white underline decoration-black rounded-lg ml-5">
                          <ReactToPrint
                            trigger={() => (
                              <h4 className="text-black text-xl font-normal font-['Sarabun']">
                                ปริ้นท์บาร์โค้ด
                              </h4>
                            )}
                            content={() => componentRef.current}
                            onBeforeGetContent={async () => {
                              await fetchBarcodeData(productionPlan.ID);
                              return new Promise((resolve) => {
                                setTimeout(() => {
                                  resolve();
                                }, 1);
                              });
                            }}
                          />
                        </button>
                      </div>
                      <div className="flex place-items-center">
                        <h3 className="text-gray-500 text-base font-normal font-['Sarabun'] mr-3">
                          {productionPlan.startDate.split("T")[0]} -{" "}
                          {productionPlan.endDate.split("T")[0]}
                        </h3>
                        <h3 className="text-[#ff6600] bg-[#ffea8f] text-center w-36 rounded-xl text-xl font-bold font-['Sarabun']">
                          กำลังดำเนินการ
                        </h3>
                      </div>
                    </div>
                    <h4 className="text-gray-500 w-full text-base font-normal font-['Sarabun'] ml-16 mt-5">
                      รายละเอียด
                    </h4>
                    <div className="w-[92%] h-auto my-[20px] flex flex-col place-content-start">
                      {productionPlan.productionLot.map((productionLot) => {
                        return (
                          <div key={productionLot.ID}>
                            <h3 className="text-black font-bold mt-10">
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
                              {productionLot.productionSub.map(
                                (productionSub) => {
                                  return (
                                    <div
                                      key={productionSub.ID}
                                      className="text-black"
                                    >
                                      <div className="flex flex-row w-full h-12 hover:bg-gray-200">
                                        <div className="w-4/12 text-start text-lg font-['Sarabun'] flex place-items-center place-content-start overflow-hidden">
                                          {Translator.item.icon}
                                          <h5 className="ml-1">
                                            {
                                              productionSub.formulaProject
                                                .toItem.name
                                            }
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
                                }
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="flex flex-col-reverse place-content-center">
              <Footer />
            </div>
          </div>
        </div>
      </div>
      <div className="hidden">
        <div ref={componentRef}>
          <div className="flex flex-wrap w-full h-full bg-white">
            {encryptedBarcode?.data?.map((data) => {
              // return <Barcode key={data.ID} value={data.encryptIDValue} />

              // return <QRCode key={data.ID} value={data.encryptIDValue} size={40} className="m-1" />
              return <GenQRcode key={data.ID} value={data.ID} encrypted={data.encryptIDValue} />;
            })}
          </div>
        </div>
      </div>
    </>
  );
}
