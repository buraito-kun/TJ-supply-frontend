"use client";

import SideBar from "@/components/Sidebar";
import Breadcrumb from "@/components/Breadcrumb";
import Footer from "@/components/Footer";
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { redirect, useRouter } from "next/navigation";
import Link from "next/link";
import BackButton from "@/components/BackButton";
import SubmitButton from "@/components/SubmitButton";
import Swal from "sweetalert2";
import Select from "react-select";

export default function FormulaInfo({ params }) {
  const session = useSession();
  const router = useRouter();
  const role = session?.data?.data?.role;

  const [formulaData, setFormulaData] = useState([]);

  useEffect(() => {
    if (session?.status === "authenticated") {
      if (role[0] !== "m") redirect("/");
    } else if (session?.status === "unauthenticated") {
      redirect("/");
    }
    fetchData();
  }, [session, role]);

  const fetchData = async () => {
    const formulaData = await fetchFormulaData();
    setFormulaData(formulaData);
  };

  const fetchFormulaData = async () => {
    const res = await fetch(
      process.env.NEXT_PUBLIC_API_URL + `formula/${params.formulaProjectID}`,
      { method: "GET" }
    );
    if (!res.ok) {
      throw new Error("Failed to fetch formula project detail");
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
              <div className="flex place-items-center">
                <Link href="/formula" className="ml-20">
                  <BackButton text="ย้อนกลับ" />
                </Link>
                <h2 className="ml-20 text-black text-2xl font-bold font-['Sarabun']">
                  ข้อมูลสูตรการผลิต
                </h2>
              </div>
            </div>
            <div className="bg-white w-full h-auto flex flex-col place-items-center place-content-center">
              <div className="w-[1000px] h-auto flex flex-col place-items-center place-content-between border-black border-2 rounded-[15px]">
                <div className="mx-10 my-10 w-[90%] h-auto flex flex-col text-black text-xl font-['Sarabun']">
                  <div className="w-full h-auto mb-5 flex text-black">
                    <label className="w-[100%]">
                      <h4 className="text-xl font-normal font-['Sarabun']">
                        ชื่อสูตรการผลิต
                        <span className="text-red-600">&nbsp;*</span>
                      </h4>
                      <input
                        className="h-[50px] w-full border border-black mt-1 px-3 text-2xl font-normal font-['Sarabun'] rounded-md cursor-not-allowed"
                        type="text"
                        maxLength={100}
                        value={formulaData?.data?.detail?.name}
                        disabled
                      />
                    </label>
                  </div>
                  <div className="w-full h-auto mb-5 flex text-black">
                    <div className="w-3/4 h-full flex">
                      <label className="w-[100%]">
                        <h4 className="text-xl font-normal font-['Sarabun']">
                          สินค้าที่จะผลิต
                          <span className="text-red-600">&nbsp;*</span>
                        </h4>
                        <Select
                          closeMenuOnSelect={true}
                          // isMulti
                          value={{
                            value: formulaData?.data?.detail?.toItem?.ID,
                            label: formulaData?.data?.detail?.toItem?.name,
                          }}
                          isDisabled
                        />
                      </label>
                    </div>
                    <div className="w-[5%] h-full"></div>
                    <div className="w-1/4 h-full flex">
                      <label className="w-[100%]">
                        <h4 className="text-xl font-normal font-['Sarabun']">
                          ค่าใช้จ่ายเครื่องจักร
                          <span className="text-red-600">&nbsp;*</span>
                        </h4>
                        <input
                          className="h-[50px] w-full border border-black mt-1 px-3 text-2xl font-normal font-['Sarabun'] rounded-md cursor-not-allowed"
                          type="number"
                          min={0}
                          value={formulaData?.data?.detail?.costFormula}
                          disabled
                        />
                      </label>
                    </div>
                  </div>
                  <div className="w-full h-auto mb-5 flex text-black">
                    <div className="w-full h-full">
                      <label className="w-auto h-auto">
                        <h4 className="text-xl font-normal font-['Sarabun']">
                          รายละเอียด
                        </h4>
                        <textarea
                          className="bg-white border border-black w-full h-[150px] min-h-[50px] max-h-[150px] rounded-lg text-2xl font-normal font-['Sarabun'] px-2 py-2 cursor-not-allowed"
                          maxLength={200}
                          value={formulaData?.data?.detail?.detail}
                          disabled
                        ></textarea>
                      </label>
                    </div>
                  </div>
                  <div className="w-full h-auto mb-5 flex text-black">
                    <label className="w-[100%]">
                      <h4 className="text-xl font-normal font-['Sarabun']">
                        ส่วนประกอบ/วัตถุดิบ
                        <span className="text-red-600">&nbsp;*</span>
                      </h4>
                      <Select
                        closeMenuOnSelect={false}
                        isMulti
                        value={formulaData?.data?.materials?.map((data) => ({
                          value: data.ID,
                          label: data.item.name,
                        }))}
                        isDisabled
                      />
                    </label>
                  </div>
                  <div className="w-full h-auto mb-5 flex flex-wrap place-content-between text-black">
                    {formulaData?.data?.materials?.map((data) => {
                      return (
                        <div
                          key={data.value}
                          className="w-[48%] h-auto flex mt-3"
                        >
                          <label className="w-[100%]">
                            <h4 className="text-xl font-normal font-['Sarabun'] text-ellipsis overflow-hidden">
                              {data.item.name}
                              <span className="text-red-600">&nbsp;*</span>
                            </h4>
                            <input
                              className="h-[50px] w-full border border-black mt-1 px-3 text-2xl font-normal font-['Sarabun'] rounded-md cursor-not-allowed"
                              type="number"
                              min={1}
                              value={data.amount}
                              disabled
                            />
                          </label>
                        </div>
                      );
                    })}
                  </div>
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
