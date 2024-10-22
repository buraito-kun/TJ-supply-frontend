"use client";

import SideBar from "@/components/Sidebar";
import Breadcrumb from "@/components/Breadcrumb";
import Footer from "@/components/Footer";
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { redirect } from "next/navigation";
import Link from "next/link";
import Pagination from "@/components/Pagination";
import BackButton from "@/components/BackButton";
import Translator from "@/translator";
import SubmitButton from "@/components/SubmitButton";
import Swal from "sweetalert2";

export default function Formula() {
  const session = useSession();
  const role = session?.data?.data?.role;

  const [formula, setFormula] = useState([]);
  const [formulaPage, setFormulaPage] = useState(1);

  useEffect(() => {
    if (session?.status === "authenticated") {
      if (role[0] !== "m") redirect("/");
    } else if (session?.status === "unauthenticated") {
      redirect("/");
    }
    refreshData();
  }, [session, role]);

  useEffect(() => {
    refreshData();
  }, [formulaPage]);

  const refreshData = async () => {
    const data = await fetchFormulaData();
    setFormula(data);
  };

  const increasePage = () => {
    setFormulaPage(
      formulaPage >= formula.allPage ? formula.allPage : formulaPage + 1
    );
  };
  const decreasePage = () => {
    setFormulaPage(formulaPage <= 1 ? 1 : formulaPage - 1);
  };
  const firstPage = () => {
    setFormulaPage(1);
  };
  const lastPage = () => {
    setFormulaPage(formula.allPage);
  };

  const fetchFormulaData = async () => {
    const res = await fetch(
      process.env.NEXT_PUBLIC_API_URL + `formula?limit=10&page=${formulaPage}`
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
          <div className="flex flex-col bg-white w-full h-full overflow-y-auto whitespace-nowrap place-items-center pt-[20px]">
            <div className="flex flex-row w-full place-items-center place-content-between">
              <h2 className="ml-20 text-black text-2xl font-bold font-['Sarabun']">
                สูตรการผลิต (Bill of Materials)
              </h2>
              <Link href="/formula/add" className="mr-20">
                <SubmitButton text="เพิ่มสูตรการผลิต" />
              </Link>
            </div>
            <div className="flex flex-col w-full">
              <div className="ml-10 mr-20 mt-10 flex flex-col place-content-center border border-[#cecece] rounded-xl">
                <div className="flex place-content-center">
                  <div className="w-[95%] my-[20px]">
                    <div className="text-black font-bold">
                      <div className="bg-[#6494d3] rounded-t-3xl flex flex-row h-10 place-items-center">
                        <div className="w-4/12 text-center text-lg font-bold font-['Sarabun']">
                          ชื่อสูตรการผลิต
                        </div>
                        <div className="w-4/12 text-center text-lg font-bold font-['Sarabun']">
                          ชื่อสินค้า
                        </div>
                        <div className="w-1/12 text-center text-lg font-bold font-['Sarabun']">
                          ค่าใช้จ่ายในสูตร
                        </div>
                        <div className="w-1/12 text-center text-lg font-bold font-['Sarabun']">
                          ข้อมูล
                        </div>
                        <div className="w-1/12 text-center text-lg font-bold font-['Sarabun']">
                          แก้ไข
                        </div>
                        <div className="w-1/12 text-center text-lg font-bold font-['Sarabun']">
                          ลบ
                        </div>
                      </div>
                    </div>
                    <div className="text-black">
                      {formula?.data?.map((data) => {
                        return (
                          <div
                            key={data.ID}
                            className="flex flex-row w-full h-12 hover:bg-gray-200"
                          >
                            <div className="w-4/12 text-start text-lg font-['Sarabun'] flex place-items-center overflow-hidden">
                              {Translator.formula.icon}
                              <h5 className="ml-1">{data.name}</h5>
                            </div>
                            <div className="w-4/12 text-start text-lg font-['Sarabun'] flex place-content-start place-items-center overflow-hidden">
                              {Translator.item.icon}
                              <h5 className="ml-1">{data.toItem.name}</h5>
                            </div>
                            <div className="w-1/12 text-center text-lg font-['Sarabun'] flex place-content-center place-items-center">
                              {data.costFormula}
                            </div>
                            <div className="w-1/12 text-center text-lg font-['Sarabun'] flex place-content-center place-items-center">
                              <Link href={`/formula/info/${data.ID}`}>
                                {Translator.info.icon}
                              </Link>
                            </div>
                            <div className="w-1/12 text-center text-lg font-['Sarabun'] flex place-content-center place-items-center">
                              <Link href={`/formula/edit/${data.ID}`}>
                                {Translator.edit.icon}
                              </Link>
                            </div>
                            <div className="w-1/12 text-center text-lg font-['Sarabun'] flex place-content-center place-items-center">
                              <button
                                onClick={() => {
                                  Swal.fire({
                                    title: `ลบข้อมูล "${data.name}" จริงหรือไม่`,
                                    text: "หลังจากลบไปแล้วข้อมูลที่เกี่ยวข้องทั้งหมดจะถูกลบไปด้วย",
                                    icon: "warning",
                                    showCancelButton: true,
                                    confirmButtonColor: "#d33",
                                    cancelButtonColor: "#3085d6",
                                    confirmButtonText: "ตกลง",
                                    cancelButtonText: "ยกเลิก",
                                  }).then(async (result) => {
                                    if (result.isConfirmed) {
                                      await fetch(
                                        process.env.NEXT_PUBLIC_API_URL +
                                          `formula/${data.ID}`,
                                        { method: "DELETE" }
                                      );
                                      await refreshData();
                                      Swal.fire({
                                        title: "ลบข้อมูลสำเร็จ",
                                        text: `ข้อมูลเกี่ยวกับ "${data.name}" ถูกลบสำเร็จ`,
                                        icon: "success",
                                      });
                                    }
                                  });
                                }}
                              >
                                {Translator.delete.icon}
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex place-content-center ml-10 mr-20">
                <Pagination
                  currentPage={formulaPage}
                  allPage={formula.allPage}
                  increase={increasePage}
                  decrease={decreasePage}
                  first={firstPage}
                  last={lastPage}
                />
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
