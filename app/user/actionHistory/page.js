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

export default function ActionHistory() {
  const session = useSession();
  const role = session?.data?.data?.role;
  const [userAction, setUserAction] = useState([]);
  const [userActionPage, setUserActionPage] = useState(1);

  useEffect(() => {
    fetchUserActionData(userActionPage);
    if (session?.status === "authenticated") {
      if (role[0] !== "m") redirect("/");
    } else if (session?.status === "unauthenticated") {
      redirect("/");
    }
  }, [session]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchUserActionData(userActionPage);
      setUserAction(data);
    };
    fetchData();
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
      process.env.NEXT_PUBLIC_API_URL + `user/action?limit=10&page=${page}`
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
              <Link href="/user" className="ml-20">
                <BackButton text="ย้อนกลับ" />
              </Link>
              <h2 className="ml-20 text-black text-2xl font-bold font-['Sarabun']">
                ประวัติการใช้งาน
              </h2>
            </div>
            <div className="flex flex-col w-full mt-[30px]">
              <div className="ml-10 mr-20 mt-10 flex flex-col place-content-center border border-[#cecece] rounded-xl">
                <div className="flex place-content-center">
                  <div className="w-[95%] my-[20px]">
                    <div className="text-black font-bold">
                      <div className="bg-[#6494d3] rounded-t-3xl flex flex-row h-10 place-items-center">
                        <div className="w-6/12 text-center text-lg font-bold font-['Sarabun']">
                          ชื่อผู้ใช้
                        </div>
                        <div className="w-3/12 text-center text-lg font-bold font-['Sarabun']">
                          การกระทำ
                        </div>
                        <div className="w-3/12 text-center text-lg font-bold font-['Sarabun']">
                          เวลา
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
                            <div className="w-6/12 text-start text-lg font-['Sarabun'] flex place-items-center">
                              <svg
                                className="ml-3"
                                width="30"
                                height="30"
                                viewBox="0 0 30 30"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  d="M15 25.8C11.25 25.8 7.935 23.88 6 21C6.045 18 12 16.35 15 16.35C18 16.35 23.955 18 24 21C23.0085 22.4768 21.669 23.6871 20.0995 24.5241C18.53 25.3612 16.7788 25.7993 15 25.8ZM15 4.5C16.1935 4.5 17.3381 4.97411 18.182 5.81802C19.0259 6.66193 19.5 7.80653 19.5 9C19.5 10.1935 19.0259 11.3381 18.182 12.182C17.3381 13.0259 16.1935 13.5 15 13.5C13.8065 13.5 12.6619 13.0259 11.818 12.182C10.9741 11.3381 10.5 10.1935 10.5 9C10.5 7.80653 10.9741 6.66193 11.818 5.81802C12.6619 4.97411 13.8065 4.5 15 4.5ZM15 0C13.0302 0 11.0796 0.387987 9.25975 1.14181C7.43986 1.89563 5.78628 3.00052 4.3934 4.3934C1.58035 7.20644 0 11.0218 0 15C0 18.9782 1.58035 22.7936 4.3934 25.6066C5.78628 26.9995 7.43986 28.1044 9.25975 28.8582C11.0796 29.612 13.0302 30 15 30C18.9782 30 22.7936 28.4196 25.6066 25.6066C28.4196 22.7936 30 18.9782 30 15C30 6.705 23.25 0 15 0Z"
                                  fill="#EE6C4D"
                                />
                              </svg>
                              <h5 className="ml-5">
                                {data.usersProducer.name +
                                  " " +
                                  data.usersProducer.surname}
                              </h5>
                            </div>
                            <div className="w-3/12 text-center text-lg font-['Sarabun'] flex place-content-center place-items-center">
                              {data.detail === "login" ? (
                                <h3 className="text-[#13A452] bg-[#adff9d] w-20 text-sm rounded-xl">
                                  เข้าสู่ระบบ
                                </h3>
                              ) : (
                                <h3 className="text-[#ff0000] bg-[#ffa6a6] w-24 text-sm rounded-xl">
                                  ออกจากระบบ
                                </h3>
                              )}
                            </div>
                            <div className="w-3/12 text-center text-lg font-['Sarabun'] flex place-content-center place-items-center">
                              {/* <h5 className="bg-[#adff9d] w-10 text-sm text-[#13A452] rounded-xl">{data.createdAt}</h5> */}
                              {data.createdAt.split("T")[0] +
                                " " +
                                data.createdAt.split("T")[1]}
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
