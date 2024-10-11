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
import Swal from "sweetalert2";

export default function ApproveUser() {
  const session = useSession();
  const role = session?.data?.data?.role;
  const [userAction, setUserAction] = useState([]);
  const [userActionPage, setUserActionPage] = useState(1);

  const userRole = {
    m: "ผู้ดูแลระบบ",
    s: "ผู้ดูแลคลัง",
    t: "ผู้ทดสอบ",
    w: "แรงงาน",
    a: "แอดมิน",
    f: "การเงิน",
  };

  useEffect(() => {
    if (session?.status === "authenticated") {
      if (role[0] !== "m") redirect("/");
    } else if (session?.status === "unauthenticated") {
      redirect("/");
    }
    refreshData()
  }, [session]);

  useEffect(() => {
    refreshData()
  }, [userActionPage]);

  const increasePage = () => {
    setUserActionPage(
      userActionPage >= userAction.allPage
        ? userAction.allPage
        : userActionPage + 1
    );
  };
  const decreasePage = () => {
    setUserActionPage(userActionPage <= 1 ? 1 : userActionPage - 1);
  };
  const firstPage = () => {
    setUserActionPage(1);
  };
  const lastPage = () => {
    setUserActionPage(userAction.allPage);
  };

  const fetchUserActionData = async (page) => {
    const res = await fetch(
      process.env.NEXT_PUBLIC_API_URL +
        `user?limit=100&page=${page}&approve=false`
    );
    if (!res.ok) {
      throw new Error("Failed to fetch data");
    }
    return await res.json();
  };

  const refreshData = async ()=>{
    const data = await fetchUserActionData(userActionPage);
    setUserAction(data);
  }

  return (
    <>
      <div className="flex w-screen h-screen">
        <SideBar className="flex w-auto h-auto" />
        <div className="flex flex-col w-full h-full">
          <Breadcrumb className="w-auto h-auto" />
          <div className="flex flex-col bg-white w-full h-full overflow-y-auto whitespace-nowrap place-items-center pt-[50px]">
            <div className="flex flex-row w-full place-items-center">
              <Link href="/user" className="ml-20">
                <BackButton text="ย้อนกลับ" />
              </Link>
              <h2 className="ml-20 text-black text-2xl font-bold font-['Sarabun']">
                อนุมัติพนักงานเข้าสู่ระบบ
              </h2>
            </div>
            <div className="flex flex-col w-full mt-[30px]">
              <div className="ml-10 mr-20 mt-10 flex flex-col place-content-center border border-[#cecece] rounded-xl">
                <div className="flex place-content-center">
                  <div className="w-[95%] my-[20px]">
                    <div className="text-black font-bold">
                      <div className="bg-[#6494d3] rounded-t-3xl flex flex-row h-10 place-items-center">
                        <div className="w-2/12 text-center text-lg font-bold font-['Sarabun']">
                          ชื่อผู้ใช้
                        </div>
                        <div className="w-2/12 text-center text-lg font-bold font-['Sarabun']">
                          ชื่อ-นามสกุล
                        </div>
                        <div className="w-2/12 text-center text-lg font-bold font-['Sarabun']">
                          email
                        </div>
                        <div className="w-4/12 text-center text-lg font-bold font-['Sarabun']">
                          role
                        </div>
                        <div className="w-1/12 text-center text-lg font-bold font-['Sarabun']">
                          ยืนยัน
                        </div>
                        <div className="w-1/12 text-center text-lg font-bold font-['Sarabun']">
                          ลบ
                        </div>
                      </div>
                    </div>
                    <div className="text-black">
                      {userAction?.data?.map((data) => {
                        return (
                          <div
                            key={data.ID}
                            className="flex flex-row w-full h-12 hover:bg-gray-200"
                          >
                            <div className="w-2/12 text-center text-lg font-['Sarabun'] flex place-content-start place-items-center">
                              {Translator.user.icon}
                              <span className="overflow-hidden text-ellipsis ml-2">
                                {data.username}
                              </span>
                            </div>
                            <div className="w-2/12 text-start text-lg font-['Sarabun'] flex place-items-center">
                              <span className="overflow-hidden text-ellipsis">
                                {data.name + " " + data.surname}
                              </span>
                            </div>
                            <div className="w-2/12 text-start text-lg font-['Sarabun'] flex place-content-start place-items-center">
                              <span className="overflow-hidden text-ellipsis">
                                {data.email}
                              </span>
                            </div>
                            <div className="w-4/12 text-center text-lg font-['Sarabun'] flex place-content-start place-items-center">
                              <span className="overflow-hidden text-ellipsis">
                                {data.role &&
                                  [data.role].map((role) => {
                                    let allRole = [];
                                    for (let r of role) {
                                      if (userRole[r])
                                        allRole.push(userRole[r]);
                                    }
                                    return allRole.join(", ");
                                  })}
                              </span>
                            </div>
                            <div className="w-1/12 text-center text-lg font-['Sarabun'] flex place-content-center place-items-center">
                              <button
                                onClick={async () => {
                                  Swal.fire({
                                    position: "top-end",
                                    icon: "success",
                                    title: "อนุมัติสำเร็จ",
                                    showConfirmButton: false,
                                    timer: 1000
                                  });
                                  await fetch(
                                    process.env.NEXT_PUBLIC_API_URL +
                                      `user/approve/${data.ID}`,
                                    { method: "PATCH" }
                                  );
                                  await refreshData();
                                }}
                              >
                                <svg
                                  width="30"
                                  height="30"
                                  viewBox="0 0 30 30"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    d="M27.8613 2.87109L29.6338 4.62891L10.0049 24.2725L0.366211 14.6338L2.13867 12.8613L10.0049 20.7275L27.8613 2.87109Z"
                                    stroke="#00CC00"
                                    strokeWidth="4"
                                    fill="#00CC00"
                                  />
                                </svg>
                              </button>
                            </div>
                            <div className="w-1/12 text-center text-lg font-['Sarabun'] flex place-content-center place-items-center">
                              <button
                                onClick={() => {
                                  Swal.fire({
                                    title: `ลบข้อมูล "${data.name} ${data.surname}" จริงหรือไม่`,
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
                                          `user/${data.ID}`,
                                        { method: "DELETE" }
                                      );
                                      await refreshData();
                                      Swal.fire({
                                        title: "ลบข้อมูลสำเร็จ",
                                        text: `ข้อมูลเกี่ยวกับ "${data.name} ${data.surname}" ถูกลบสำเร็จ`,
                                        icon: "success",
                                      });
                                    }
                                  });
                                }}
                              >
                                <svg
                                  width="30"
                                  height="30"
                                  viewBox="0 0 30 30"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    fill-rule="evenodd"
                                    clip-rule="evenodd"
                                    d="M15 5.25C12.4141 5.25 9.93419 6.27723 8.10571 8.10571C6.27723 9.93419 5.25 12.4141 5.25 15C5.25 17.5859 6.27723 20.0658 8.10571 21.8943C9.93419 23.7228 12.4141 24.75 15 24.75C17.5859 24.75 20.0658 23.7228 21.8943 21.8943C23.7228 20.0658 24.75 17.5859 24.75 15C24.75 12.4141 23.7228 9.93419 21.8943 8.10571C20.0658 6.27723 17.5859 5.25 15 5.25ZM3.75 15C3.75 12.0163 4.93526 9.15483 7.04505 7.04505C9.15483 4.93526 12.0163 3.75 15 3.75C17.9837 3.75 20.8452 4.93526 22.955 7.04505C25.0647 9.15483 26.25 12.0163 26.25 15C26.25 17.9837 25.0647 20.8452 22.955 22.955C20.8452 25.0647 17.9837 26.25 15 26.25C12.0163 26.25 9.15483 25.0647 7.04505 22.955C4.93526 20.8452 3.75 17.9837 3.75 15Z"
                                    stroke="#FF0000"
                                    strokeWidth="3"
                                    fill="#FF0000"
                                  />
                                  <path
                                    fill-rule="evenodd"
                                    clip-rule="evenodd"
                                    d="M22.956 7.04552C23.0966 7.18616 23.1756 7.37689 23.1756 7.57577C23.1756 7.77464 23.0966 7.96537 22.956 8.10602L8.10599 22.956C8.03681 23.0277 7.95405 23.0848 7.86255 23.1241C7.77104 23.1634 7.67263 23.1841 7.57305 23.185C7.47346 23.1858 7.3747 23.1668 7.28253 23.1291C7.19036 23.0914 7.10662 23.0357 7.0362 22.9653C6.96578 22.8949 6.91009 22.8112 6.87238 22.719C6.83467 22.6268 6.81569 22.5281 6.81656 22.4285C6.81742 22.3289 6.83811 22.2305 6.87742 22.139C6.91673 22.0475 6.97386 21.9647 7.04549 21.8955L21.8955 7.04552C22.0361 6.90491 22.2269 6.82593 22.4257 6.82593C22.6246 6.82593 22.8153 6.90491 22.956 7.04552Z"
                                    stroke="#FF0000"
                                    strokeWidth="3"
                                    fill="#FF0000"
                                  />
                                </svg>
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
                  currentPage={userActionPage}
                  allPage={userAction.allPage}
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
