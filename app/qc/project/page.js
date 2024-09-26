"use client";

import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import SideBar from "@/components/Sidebar";
import { redirect } from "next/navigation";
import Breadcrumb from "@/components/Breadcrumb";
import Footer from "@/components/Footer";
import SubmitButton from "@/components/SubmitButton";
import Link from "next/link";
import Translator from "@/translator";
import BackButton from "@/components/BackButton";
import Swal from "sweetalert2";
import Pagination from "@/components/Pagination";

export default function QcProject() {
  const session = useSession();
  const role = session?.data?.data?.role;

  const [page, setPage] = useState(1);
  const [qcProject, setQcProject] = useState([]);

  useEffect(() => {
    if (session?.status === "authenticated") {
      if (role[0] !== "m" && role[1] !== "s") redirect("/");
    } else if (session?.status === "unauthenticated") {
      redirect("/");
    }
    refreshData();
  }, [session, role]);

  useEffect(()=>{
    refreshData()
  }, [page])

  const fetchData = async () => {
    const res = await fetch(process.env.NEXT_PUBLIC_API_URL + `qc/project/extend?limit=10&page=${page}`, {
      method: "GET",
    });
    if (!res.ok) {
      throw new Error("Failed to fetch data");
    }
    return await res.json();
  };

  const refreshData = async () => {
    const data = await fetchData();
    setQcProject(data);
  };

  const increasePage = () => {
    setPage(
      page >= qcProject.allPage
        ? qcProject.allPage
        : page + 1
    );
  };
  const decreasePage = () => {
    setPage(page <= 1 ? 1 : page - 1);
  };
  const firstPage = () => {
    setPage(1);
  };
  const lastPage = () => {
    setPage(qcProject.allPage);
  };

  return (
    <>
      <div className="flex w-screen h-screen">
        <SideBar className="flex w-auto h-auto" />
        <div className="flex flex-col w-full h-full">
          <Breadcrumb className="w-auto h-auto" />
          <div className="flex flex-col bg-white w-full h-full overflow-y-auto whitespace-nowrap place-items-center pt-5">
            <div className="flex flex-row w-full place-items-center">
              <Link href="/qc" className="ml-20">
                <BackButton text="ย้อนกลับ" />
              </Link>
              <h2 className="ml-20 text-black text-2xl font-bold font-['Sarabun']">
                โปรเจ็คการทดสอบ
              </h2>
              <div className="flex w-full place-content-end mr-20">
                <Link href="/qc/project/create">
                  <SubmitButton text="สร้าง" />
                </Link>
              </div>
            </div>
            <div className="w-full h-auto mt-[20px]">
              {qcProject?.data?.map((project) => {
                return (
                  <div
                    key={project.ID}
                    className="ml-10 mr-20 mt-10 pb-10 flex flex-col place-content-center place-items-center border border-[#cecece] rounded-xl shadow-lg"
                  >
                    <div className="w-full flex place-content-between px-5 mt-2">
                      <div className="flex place-items-end">
                        <h3 className="text-black text-xl font-bold font-['Sarabun']">
                          {project.projectName}
                        </h3>
                      </div>
                      <div className="flex place-items-center">
                        <button
                          onClick={() => {
                            Swal.fire({
                              title: `ลบข้อมูล "${project.projectName}" จริงหรือไม่`,
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
                                    `qc/project/${project.ID}`,
                                  { method: "DELETE" }
                                );
                                await refreshData();
                                Swal.fire({
                                  title: "ลบข้อมูลสำเร็จ",
                                  text: `ข้อมูลเกี่ยวกับ "${project.projectName}" ถูกลบสำเร็จ`,
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
                    <h4 className="text-gray-500 w-full text-base font-normal font-['Sarabun'] ml-16 mt-5">
                      รายละเอียด
                    </h4>
                    <div className="w-[92%] h-auto my-[20px] flex flex-col place-content-start">
                      <div>
                        <h3 className="text-black font-bold mt-10">
                          {/* {itemProject.name} */}
                        </h3>
                        <div className="mt-5">
                          <div className="text-black font-bold">
                            <div className="bg-[#6494d3] rounded-t-3xl flex flex-row h-10 place-items-center">
                              <div className="w-4/12 text-center text-lg font-bold font-['Sarabun']">
                                ชื่อการทดสอบ
                              </div>
                              <div className="w-8/12 text-center text-lg font-bold font-['Sarabun']">
                                รายละเอียด
                              </div>
                            </div>
                          </div>
                          {project.qcItemProject.map((itemProject) => {
                            return (
                              <div key={itemProject.ID} className="text-black">
                                <div className="flex flex-row w-full h-12 hover:bg-gray-200">
                                  <div className="w-4/12 text-start text-lg font-['Sarabun'] flex place-items-center place-content-start overflow-hidden">
                                    {Translator.qc.icon}
                                    <h5 className="ml-1">
                                      {itemProject.qcMain.testName}
                                    </h5>
                                  </div>
                                  <div className="w-8/12 text-start text-lg font-['Sarabun'] flex place-items-center place-content-start overflow-hidden">
                                    {Translator.detail.icon}
                                    <h5 className="ml-1 text-ellipsis overflow-hidden">
                                      {itemProject.qcMain.detail}
                                    </h5>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
              <div className="flex place-content-center ml-10 mr-20">
                <Pagination
                  currentPage={page}
                  allPage={qcProject.allPage}
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
