"use client";

import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import SideBar from "@/components/Sidebar";
import Breadcrumb from "@/components/Breadcrumb";
import { redirect } from "next/navigation";
import CircleImageButton from "@/components/CircleImageButton";
import Footer from "@/components/Footer";
import SubmitButton from "@/components/SubmitButton";
import Pagination from "@/components/Pagination";
import Link from "next/link";
import Swal from "sweetalert2";
import { signOut } from "next-auth/react";
import Translator from "@/translator";

export default function User() {
  const session = useSession();
  const role = session?.data?.data?.role;
  const [manager, setManager] = useState([]);
  const [storager, setStorager] = useState([]);
  const [tester, setTester] = useState([]);
  const [worker, setWorker] = useState([]);
  const [managerPage, setManagerPage] = useState(1);
  const [storagerPage, setStoragerPage] = useState(1);
  const [testerPage, setTesterPage] = useState(1);
  const [workerPage, setWorkerPage] = useState(1);

  useEffect(() => {
    if (session?.status === "authenticated") {
      const checkIsUserExist = async () => {
        const res = await fetch(
          process.env.NEXT_PUBLIC_API_URL + `user/${session?.data?.data?.ID}`,
          { method: "GET" }
        );
        if (!res.ok) signOut();
      };
      checkIsUserExist();
      if (role[0] !== "m") redirect("/");
    } else if (session?.status === "unauthenticated") {
      redirect("/");
    }
    refreshData();
  }, [session, role]);

  useEffect(() => {
    const fetchData = async () => {
      const managerData = await fetchDataPerRole(managerPage, "m");
      setManager(managerData);
    };
    fetchData();
  }, [managerPage]);

  useEffect(() => {
    const fetchData = async () => {
      const storagerData = await fetchDataPerRole(storagerPage, "s");
      setStorager(storagerData);
    };
    fetchData();
  }, [storagerPage]);

  useEffect(() => {
    const fetchData = async () => {
      const testerData = await fetchDataPerRole(testerPage, "t");
      setTester(testerData);
    };
    fetchData();
  }, [testerPage]);

  useEffect(() => {
    const fetchData = async () => {
      const workerData = await fetchDataPerRole(workerPage, "w");
      setWorker(workerData);
    };
    fetchData();
  }, [workerPage]);

  const fetchDataPerRole = async (page, role) => {
    const res = await fetch(
      process.env.NEXT_PUBLIC_API_URL +
        `user/list/role?limit=5&page=${page}&role=${role}`,
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
    const managerData = await fetchDataPerRole(managerPage, "m");
    const storagerData = await fetchDataPerRole(storagerPage, "s");
    const testerData = await fetchDataPerRole(testerPage, "t");
    const workerData = await fetchDataPerRole(workerPage, "w");
    setManager(managerData);
    setStorager(storagerData);
    setTester(testerData);
    setWorker(workerData);
  };

  const increaseManagerPage = () => {
    setManagerPage(
      managerPage >= manager.allPage ? manager.allPage : managerPage + 1
    );
  };
  const decreaseManagerPage = () => {
    setManagerPage(managerPage <= 1 ? 1 : managerPage - 1);
  };
  const firstManagerPage = () => {
    setManagerPage(1);
  };
  const lastManagerPage = () => {
    setManagerPage(manager.allPage);
  };
  const increaseStoragerPage = () => {
    setStoragerPage(
      storagerPage >= storager.allPage ? storager.allPage : storagerPage + 1
    );
  };
  const decreaseStoragerPage = () => {
    setStoragerPage(storagerPage <= 1 ? 1 : storagerPage - 1);
  };
  const firstStoragerPage = () => {
    setStoragerPage(1);
  };
  const lastStoragerPage = () => {
    setStoragerPage(storager.allPage);
  };
  const increaseTesterPage = () => {
    setTesterPage(
      testerPage >= tester.allPage ? tester.allPage : testerPage + 1
    );
  };
  const decreaseTesterPage = () => {
    setTesterPage(testerPage <= 1 ? 1 : testerPage - 1);
  };
  const firstTesterPage = () => {
    setTesterPage(1);
  };
  const lastTesterPage = () => {
    setTesterPage(tester.allPage);
  };
  const increaseWorkerPage = () => {
    setWorkerPage(
      workerPage >= worker.allPage ? worker.allPage : workerPage + 1
    );
  };
  const decreaseWorkerPage = () => {
    setWorkerPage(workerPage <= 1 ? 1 : workerPage - 1);
  };
  const firstWorkerPage = () => {
    setWorkerPage(1);
  };
  const lastWorkerPage = () => {
    setWorkerPage(worker.allPage);
  };

  return (
    <>
      <div className="flex w-screen h-screen scroll-smooth">
        <SideBar className="flex w-auto h-auto" />
        <div className="flex flex-col w-full h-full">
          <Breadcrumb className="w-auto h-auto" />
          <div className="flex flex-col bg-white w-full h-full overflow-y-auto whitespace-nowrap place-items-center pt-[20px]">
            <div className="flex flex-row w-full place-content-between place-items-center">
              <h2 className="ml-20 text-black text-2xl font-bold font-['Sarabun']">
                รายชื่อผู้ใช้งาน
              </h2>
              <Link href="/user/actionHistory" className="mr-20">
                <SubmitButton text="ประวัติการใช้งาน" />
              </Link>
            </div>
            {/*

              worker session

            */}
            <div className="flex flex-col w-full mt-[50px]">
              <div className="flex flex-row w-full place-items-center place-content-between">
                <h2 className="ml-40 text-black text-xl font-normal font-['Sarabun']">
                  รายชื่อแรงงาน
                </h2>
                <div className="pr-[120px]">
                  <Link href="/user/add/3">
                    <CircleImageButton />
                  </Link>
                </div>
              </div>
              <div className="ml-10 mr-20 mt-10 flex flex-col place-content-center border border-[#cecece] rounded-xl">
                <div className="flex place-content-center">
                  <div className="w-[95%] my-[20px]">
                    <div className="text-black font-bold">
                      <div className="bg-[#6494d3] rounded-t-3xl flex flex-row h-10 place-items-center">
                        <div className="w-7/12 text-center text-lg font-bold font-['Sarabun']">
                          ชื่อผู้ใช้
                        </div>
                        <div className="w-2/12 text-center text-lg font-bold font-['Sarabun']">
                          สถานะ
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
                      {worker?.data?.map((data) => {
                        return (
                          <div
                            key={data.ID}
                            className="flex flex-row w-full h-12 hover:bg-gray-200"
                          >
                            <div className="w-7/12 text-start text-lg font-['Sarabun'] flex place-items-center">
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
                                {data.name + " " + data.surname}
                              </h5>
                            </div>
                            <div className="w-2/12 text-center text-lg font-['Sarabun'] flex place-content-center place-items-center">
                              <h5 className="bg-[#adff9d] w-10 text-sm text-[#13A452] rounded-xl">
                                ปกติ
                              </h5>
                            </div>
                            <div className="w-1/12 text-center text-lg font-['Sarabun'] flex place-content-center place-items-center">
                              <Link href={"/user/info/" + data.ID}>
                                {Translator.info.icon}
                              </Link>
                            </div>
                            <div className="w-1/12 text-center text-lg font-['Sarabun'] flex place-content-center place-items-center">
                              <Link href={"/user/edit/" + data.ID}>
                                {Translator.edit.icon}
                              </Link>
                            </div>
                            <div className="w-1/12 text-center text-lg font-['Sarabun'] flex place-content-center place-items-center">
                              {session?.data?.data?.ID !== data.ID ? (
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
                                  {Translator.delete.icon}
                                </button>
                              ) : null}
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
                  currentPage={workerPage}
                  allPage={worker.allPage}
                  increase={increaseWorkerPage}
                  decrease={decreaseWorkerPage}
                  first={firstWorkerPage}
                  last={lastWorkerPage}
                />
              </div>
            </div>
            {/*
            
              tester session

            */}
            <div className="flex flex-col w-full mt-[50px]">
              <div className="flex flex-row w-full place-items-center place-content-between">
                <h2 className="ml-40 text-black text-xl font-normal font-['Sarabun']">
                  รายชื่อผู้ทดสอบ
                </h2>
                <div className="pr-[120px]">
                  <Link href="/user/add/2">
                    <CircleImageButton />
                  </Link>
                </div>
              </div>
              <div className="ml-10 mr-20 mt-10 flex flex-col place-content-center border border-[#cecece] rounded-xl">
                <div className="flex place-content-center">
                  <div className="w-[95%] my-[20px]">
                    <div className="text-black font-bold">
                      <div className="bg-[#6494d3] rounded-t-3xl flex flex-row h-10 place-items-center">
                        <div className="w-7/12 text-center text-lg font-bold font-['Sarabun']">
                          ชื่อผู้ใช้
                        </div>
                        <div className="w-2/12 text-center text-lg font-bold font-['Sarabun']">
                          สถานะ
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
                      {tester?.data?.map((data) => {
                        return (
                          <div
                            key={data.ID}
                            className="flex flex-row w-full h-12 hover:bg-gray-200"
                          >
                            <div className="w-7/12 text-start text-lg font-['Sarabun'] flex place-items-center">
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
                                {data.name + " " + data.surname}
                              </h5>
                            </div>
                            <div className="w-2/12 text-center text-lg font-['Sarabun'] flex place-content-center place-items-center">
                              <h5 className="bg-[#adff9d] w-10 text-sm text-[#13A452] rounded-xl">
                                ปกติ
                              </h5>
                            </div>
                            <div className="w-1/12 text-center text-lg font-['Sarabun'] flex place-content-center place-items-center">
                              <Link href={"/user/info/" + data.ID}>
                                <svg
                                  width="30"
                                  height="21"
                                  viewBox="0 0 30 21"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    d="M30 10.3125C30 10.3125 24.375 0 15 0C5.625 0 0 10.3125 0 10.3125C0 10.3125 5.625 20.625 15 20.625C24.375 20.625 30 10.3125 30 10.3125ZM2.19937 10.3125C3.10459 8.9336 4.14744 7.65015 5.31187 6.48187C7.725 4.065 11.025 1.875 15 1.875C18.975 1.875 22.2731 4.065 24.69 6.48187C25.8544 7.65015 26.8973 8.9336 27.8025 10.3125C27.695 10.475 27.5731 10.655 27.4369 10.8525C26.8088 11.7525 25.8806 12.9525 24.69 14.1431C22.2731 16.56 18.9731 18.75 15 18.75C11.0269 18.75 7.72688 16.56 5.31 14.1431C4.14556 12.9749 3.10459 11.6914 2.19937 10.3125Z"
                                    fill="black"
                                  />
                                  <path
                                    d="M15 5.625C13.7568 5.625 12.5645 6.11886 11.6854 6.99794C10.8064 7.87701 10.3125 9.0693 10.3125 10.3125C10.3125 11.5557 10.8064 12.748 11.6854 13.6271C12.5645 14.5061 13.7568 15 15 15C16.2432 15 17.4355 14.5061 18.3146 13.6271C19.1936 12.748 19.6875 11.5557 19.6875 10.3125C19.6875 9.0693 19.1936 7.87701 18.3146 6.99794C17.4355 6.11886 16.2432 5.625 15 5.625ZM8.4375 10.3125C8.4375 8.57202 9.1289 6.90282 10.3596 5.67211C11.5903 4.4414 13.2595 3.75 15 3.75C16.7405 3.75 18.4097 4.4414 19.6404 5.67211C20.8711 6.90282 21.5625 8.57202 21.5625 10.3125C21.5625 12.053 20.8711 13.7222 19.6404 14.9529C18.4097 16.1836 16.7405 16.875 15 16.875C13.2595 16.875 11.5903 16.1836 10.3596 14.9529C9.1289 13.7222 8.4375 12.053 8.4375 10.3125Z"
                                    fill="black"
                                  />
                                </svg>
                              </Link>
                            </div>
                            <div className="w-1/12 text-center text-lg font-['Sarabun'] flex place-content-center place-items-center">
                              <Link href={"/user/edit/" + data.ID}>
                                <svg
                                  width="30"
                                  height="30"
                                  viewBox="0 0 30 30"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    d="M8.75 21.2663L14.2662 21.2475L26.3062 9.3225C26.7787 8.85 27.0387 8.2225 27.0387 7.555C27.0387 6.8875 26.7787 6.26 26.3062 5.7875L24.3237 3.805C23.3787 2.86 21.73 2.865 20.7925 3.80125L8.75 15.7288V21.2663ZM22.5562 5.5725L24.5425 7.55125L22.5462 9.52875L20.5637 7.5475L22.5562 5.5725ZM11.25 16.7713L18.7875 9.305L20.77 11.2875L13.2337 18.7513L11.25 18.7575V16.7713Z"
                                    fill="black"
                                  />
                                  <path
                                    d="M6.25 26.25H23.75C25.1288 26.25 26.25 25.1288 26.25 23.75V12.915L23.75 15.415V23.75H10.1975C10.165 23.75 10.1313 23.7625 10.0988 23.7625C10.0575 23.7625 10.0163 23.7513 9.97375 23.75H6.25V6.25H14.8088L17.3088 3.75H6.25C4.87125 3.75 3.75 4.87125 3.75 6.25V23.75C3.75 25.1288 4.87125 26.25 6.25 26.25Z"
                                    fill="black"
                                  />
                                </svg>
                              </Link>
                            </div>
                            <div className="w-1/12 text-center text-lg font-['Sarabun'] flex place-content-center place-items-center">
                              {session?.data?.data?.ID !== data.ID ? (
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
                                      d="M7.5 3C7.5 2.20435 7.81607 1.44129 8.37868 0.87868C8.94129 0.31607 9.70435 0 10.5 0H19.5C20.2956 0 21.0587 0.31607 21.6213 0.87868C22.1839 1.44129 22.5 2.20435 22.5 3V6H28.5C28.8978 6 29.2794 6.15804 29.5607 6.43934C29.842 6.72064 30 7.10218 30 7.5C30 7.89782 29.842 8.27936 29.5607 8.56066C29.2794 8.84196 28.8978 9 28.5 9H26.8965L25.596 27.213C25.5421 27.9699 25.2034 28.6782 24.6482 29.1954C24.0929 29.7125 23.3623 30 22.6035 30H7.395C6.63621 30 5.9056 29.7125 5.35033 29.1954C4.79505 28.6782 4.45637 27.9699 4.4025 27.213L3.105 9H1.5C1.10218 9 0.720644 8.84196 0.43934 8.56066C0.158035 8.27936 0 7.89782 0 7.5C0 7.10218 0.158035 6.72064 0.43934 6.43934C0.720644 6.15804 1.10218 6 1.5 6H7.5V3ZM10.5 6H19.5V3H10.5V6ZM6.111 9L7.3965 27H22.605L23.8905 9H6.111ZM12 12C12.3978 12 12.7794 12.158 13.0607 12.4393C13.342 12.7206 13.5 13.1022 13.5 13.5V22.5C13.5 22.8978 13.342 23.2794 13.0607 23.5607C12.7794 23.842 12.3978 24 12 24C11.6022 24 11.2206 23.842 10.9393 23.5607C10.658 23.2794 10.5 22.8978 10.5 22.5V13.5C10.5 13.1022 10.658 12.7206 10.9393 12.4393C11.2206 12.158 11.6022 12 12 12ZM18 12C18.3978 12 18.7794 12.158 19.0607 12.4393C19.342 12.7206 19.5 13.1022 19.5 13.5V22.5C19.5 22.8978 19.342 23.2794 19.0607 23.5607C18.7794 23.842 18.3978 24 18 24C17.6022 24 17.2206 23.842 16.9393 23.5607C16.658 23.2794 16.5 22.8978 16.5 22.5V13.5C16.5 13.1022 16.658 12.7206 16.9393 12.4393C17.2206 12.158 17.6022 12 18 12Z"
                                      fill="red"
                                    />
                                  </svg>
                                </button>
                              ) : null}
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
                  currentPage={testerPage}
                  allPage={tester.allPage}
                  increase={increaseTesterPage}
                  decrease={decreaseTesterPage}
                  first={firstTesterPage}
                  last={lastTesterPage}
                />
              </div>
            </div>
            {/*
            
              storager session

            */}
            <div className="flex flex-col w-full mt-[50px]">
              <div className="flex flex-row w-full place-items-center place-content-between">
                <h2 className="ml-40 text-black text-xl font-normal font-['Sarabun']">
                  รายชื่อผู้ดูแลคลัง
                </h2>
                <div className="pr-[120px]">
                  <Link href="/user/add/1">
                    <CircleImageButton />
                  </Link>
                </div>
              </div>
              <div className="ml-10 mr-20 mt-10 flex flex-col place-content-center border border-[#cecece] rounded-xl">
                <div className="flex place-content-center">
                  <div className="w-[95%] my-[20px]">
                    <div className="text-black font-bold">
                      <div className="bg-[#6494d3] rounded-t-3xl flex flex-row h-10 place-items-center">
                        <div className="w-7/12 text-center text-lg font-bold font-['Sarabun']">
                          ชื่อผู้ใช้
                        </div>
                        <div className="w-2/12 text-center text-lg font-bold font-['Sarabun']">
                          สถานะ
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
                      {storager?.data?.map((data) => {
                        return (
                          <div
                            key={data.ID}
                            className="flex flex-row w-full h-12 hover:bg-gray-200"
                          >
                            <div className="w-7/12 text-start text-lg font-['Sarabun'] flex place-items-center">
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
                                {data.name + " " + data.surname}
                              </h5>
                            </div>
                            <div className="w-2/12 text-center text-lg font-['Sarabun'] flex place-content-center place-items-center">
                              <h5 className="bg-[#adff9d] w-10 text-sm text-[#13A452] rounded-xl">
                                ปกติ
                              </h5>
                            </div>
                            <div className="w-1/12 text-center text-lg font-['Sarabun'] flex place-content-center place-items-center">
                              <Link href={"/user/info/" + data.ID}>
                                <svg
                                  width="30"
                                  height="21"
                                  viewBox="0 0 30 21"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    d="M30 10.3125C30 10.3125 24.375 0 15 0C5.625 0 0 10.3125 0 10.3125C0 10.3125 5.625 20.625 15 20.625C24.375 20.625 30 10.3125 30 10.3125ZM2.19937 10.3125C3.10459 8.9336 4.14744 7.65015 5.31187 6.48187C7.725 4.065 11.025 1.875 15 1.875C18.975 1.875 22.2731 4.065 24.69 6.48187C25.8544 7.65015 26.8973 8.9336 27.8025 10.3125C27.695 10.475 27.5731 10.655 27.4369 10.8525C26.8088 11.7525 25.8806 12.9525 24.69 14.1431C22.2731 16.56 18.9731 18.75 15 18.75C11.0269 18.75 7.72688 16.56 5.31 14.1431C4.14556 12.9749 3.10459 11.6914 2.19937 10.3125Z"
                                    fill="black"
                                  />
                                  <path
                                    d="M15 5.625C13.7568 5.625 12.5645 6.11886 11.6854 6.99794C10.8064 7.87701 10.3125 9.0693 10.3125 10.3125C10.3125 11.5557 10.8064 12.748 11.6854 13.6271C12.5645 14.5061 13.7568 15 15 15C16.2432 15 17.4355 14.5061 18.3146 13.6271C19.1936 12.748 19.6875 11.5557 19.6875 10.3125C19.6875 9.0693 19.1936 7.87701 18.3146 6.99794C17.4355 6.11886 16.2432 5.625 15 5.625ZM8.4375 10.3125C8.4375 8.57202 9.1289 6.90282 10.3596 5.67211C11.5903 4.4414 13.2595 3.75 15 3.75C16.7405 3.75 18.4097 4.4414 19.6404 5.67211C20.8711 6.90282 21.5625 8.57202 21.5625 10.3125C21.5625 12.053 20.8711 13.7222 19.6404 14.9529C18.4097 16.1836 16.7405 16.875 15 16.875C13.2595 16.875 11.5903 16.1836 10.3596 14.9529C9.1289 13.7222 8.4375 12.053 8.4375 10.3125Z"
                                    fill="black"
                                  />
                                </svg>
                              </Link>
                            </div>
                            <div className="w-1/12 text-center text-lg font-['Sarabun'] flex place-content-center place-items-center">
                              <Link href={"/user/edit/" + data.ID}>
                                <svg
                                  width="30"
                                  height="30"
                                  viewBox="0 0 30 30"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    d="M8.75 21.2663L14.2662 21.2475L26.3062 9.3225C26.7787 8.85 27.0387 8.2225 27.0387 7.555C27.0387 6.8875 26.7787 6.26 26.3062 5.7875L24.3237 3.805C23.3787 2.86 21.73 2.865 20.7925 3.80125L8.75 15.7288V21.2663ZM22.5562 5.5725L24.5425 7.55125L22.5462 9.52875L20.5637 7.5475L22.5562 5.5725ZM11.25 16.7713L18.7875 9.305L20.77 11.2875L13.2337 18.7513L11.25 18.7575V16.7713Z"
                                    fill="black"
                                  />
                                  <path
                                    d="M6.25 26.25H23.75C25.1288 26.25 26.25 25.1288 26.25 23.75V12.915L23.75 15.415V23.75H10.1975C10.165 23.75 10.1313 23.7625 10.0988 23.7625C10.0575 23.7625 10.0163 23.7513 9.97375 23.75H6.25V6.25H14.8088L17.3088 3.75H6.25C4.87125 3.75 3.75 4.87125 3.75 6.25V23.75C3.75 25.1288 4.87125 26.25 6.25 26.25Z"
                                    fill="black"
                                  />
                                </svg>
                              </Link>
                            </div>
                            <div className="w-1/12 text-center text-lg font-['Sarabun'] flex place-content-center place-items-center">
                              {session?.data?.data?.ID !== data.ID ? (
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
                                      d="M7.5 3C7.5 2.20435 7.81607 1.44129 8.37868 0.87868C8.94129 0.31607 9.70435 0 10.5 0H19.5C20.2956 0 21.0587 0.31607 21.6213 0.87868C22.1839 1.44129 22.5 2.20435 22.5 3V6H28.5C28.8978 6 29.2794 6.15804 29.5607 6.43934C29.842 6.72064 30 7.10218 30 7.5C30 7.89782 29.842 8.27936 29.5607 8.56066C29.2794 8.84196 28.8978 9 28.5 9H26.8965L25.596 27.213C25.5421 27.9699 25.2034 28.6782 24.6482 29.1954C24.0929 29.7125 23.3623 30 22.6035 30H7.395C6.63621 30 5.9056 29.7125 5.35033 29.1954C4.79505 28.6782 4.45637 27.9699 4.4025 27.213L3.105 9H1.5C1.10218 9 0.720644 8.84196 0.43934 8.56066C0.158035 8.27936 0 7.89782 0 7.5C0 7.10218 0.158035 6.72064 0.43934 6.43934C0.720644 6.15804 1.10218 6 1.5 6H7.5V3ZM10.5 6H19.5V3H10.5V6ZM6.111 9L7.3965 27H22.605L23.8905 9H6.111ZM12 12C12.3978 12 12.7794 12.158 13.0607 12.4393C13.342 12.7206 13.5 13.1022 13.5 13.5V22.5C13.5 22.8978 13.342 23.2794 13.0607 23.5607C12.7794 23.842 12.3978 24 12 24C11.6022 24 11.2206 23.842 10.9393 23.5607C10.658 23.2794 10.5 22.8978 10.5 22.5V13.5C10.5 13.1022 10.658 12.7206 10.9393 12.4393C11.2206 12.158 11.6022 12 12 12ZM18 12C18.3978 12 18.7794 12.158 19.0607 12.4393C19.342 12.7206 19.5 13.1022 19.5 13.5V22.5C19.5 22.8978 19.342 23.2794 19.0607 23.5607C18.7794 23.842 18.3978 24 18 24C17.6022 24 17.2206 23.842 16.9393 23.5607C16.658 23.2794 16.5 22.8978 16.5 22.5V13.5C16.5 13.1022 16.658 12.7206 16.9393 12.4393C17.2206 12.158 17.6022 12 18 12Z"
                                      fill="red"
                                    />
                                  </svg>
                                </button>
                              ) : null}
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
                  currentPage={storagerPage}
                  allPage={storager.allPage}
                  increase={increaseStoragerPage}
                  decrease={decreaseStoragerPage}
                  first={firstStoragerPage}
                  last={lastStoragerPage}
                />
              </div>
            </div>
            {/*
            
              manager session

            */}
            <div className="flex flex-col w-full mt-[50px]">
              <div className="flex flex-row w-full place-items-center place-content-between">
                <h2 className="ml-40 text-black text-xl font-normal font-['Sarabun']">
                  รายชื่อผู้ดูแลระบบ
                </h2>
                <div className="pr-[120px]">
                  <Link href="/user/add/0">
                    <CircleImageButton />
                  </Link>
                </div>
              </div>
              <div className="ml-10 mr-20 mt-10 flex flex-col place-content-center border border-[#cecece] rounded-xl">
                <div className="flex place-content-center">
                  <div className="w-[95%] my-[20px]">
                    <div className="text-black font-bold">
                      <div className="bg-[#6494d3] rounded-t-3xl flex flex-row h-10 place-items-center">
                        <div className="w-7/12 text-center text-lg font-bold font-['Sarabun']">
                          ชื่อผู้ใช้
                        </div>
                        <div className="w-2/12 text-center text-lg font-bold font-['Sarabun']">
                          สถานะ
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
                      {manager?.data?.map((data) => {
                        return (
                          <div
                            key={data.ID}
                            className="flex flex-row w-full h-12 hover:bg-gray-200"
                          >
                            <div className="w-7/12 text-start text-lg font-['Sarabun'] flex place-items-center">
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
                                {data.name + " " + data.surname}
                              </h5>
                            </div>
                            <div className="w-2/12 text-center text-lg font-['Sarabun'] flex place-content-center place-items-center">
                              <h5 className="bg-[#adff9d] w-10 text-sm text-[#13A452] rounded-xl">
                                ปกติ
                              </h5>
                            </div>
                            <div className="w-1/12 text-center text-lg font-['Sarabun'] flex place-content-center place-items-center">
                              <Link href={"/user/info/" + data.ID}>
                                <svg
                                  width="30"
                                  height="21"
                                  viewBox="0 0 30 21"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    d="M30 10.3125C30 10.3125 24.375 0 15 0C5.625 0 0 10.3125 0 10.3125C0 10.3125 5.625 20.625 15 20.625C24.375 20.625 30 10.3125 30 10.3125ZM2.19937 10.3125C3.10459 8.9336 4.14744 7.65015 5.31187 6.48187C7.725 4.065 11.025 1.875 15 1.875C18.975 1.875 22.2731 4.065 24.69 6.48187C25.8544 7.65015 26.8973 8.9336 27.8025 10.3125C27.695 10.475 27.5731 10.655 27.4369 10.8525C26.8088 11.7525 25.8806 12.9525 24.69 14.1431C22.2731 16.56 18.9731 18.75 15 18.75C11.0269 18.75 7.72688 16.56 5.31 14.1431C4.14556 12.9749 3.10459 11.6914 2.19937 10.3125Z"
                                    fill="black"
                                  />
                                  <path
                                    d="M15 5.625C13.7568 5.625 12.5645 6.11886 11.6854 6.99794C10.8064 7.87701 10.3125 9.0693 10.3125 10.3125C10.3125 11.5557 10.8064 12.748 11.6854 13.6271C12.5645 14.5061 13.7568 15 15 15C16.2432 15 17.4355 14.5061 18.3146 13.6271C19.1936 12.748 19.6875 11.5557 19.6875 10.3125C19.6875 9.0693 19.1936 7.87701 18.3146 6.99794C17.4355 6.11886 16.2432 5.625 15 5.625ZM8.4375 10.3125C8.4375 8.57202 9.1289 6.90282 10.3596 5.67211C11.5903 4.4414 13.2595 3.75 15 3.75C16.7405 3.75 18.4097 4.4414 19.6404 5.67211C20.8711 6.90282 21.5625 8.57202 21.5625 10.3125C21.5625 12.053 20.8711 13.7222 19.6404 14.9529C18.4097 16.1836 16.7405 16.875 15 16.875C13.2595 16.875 11.5903 16.1836 10.3596 14.9529C9.1289 13.7222 8.4375 12.053 8.4375 10.3125Z"
                                    fill="black"
                                  />
                                </svg>
                              </Link>
                            </div>
                            <div className="w-1/12 text-center text-lg font-['Sarabun'] flex place-content-center place-items-center">
                              <Link href={"/user/edit/" + data.ID}>
                                <svg
                                  width="30"
                                  height="30"
                                  viewBox="0 0 30 30"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    d="M8.75 21.2663L14.2662 21.2475L26.3062 9.3225C26.7787 8.85 27.0387 8.2225 27.0387 7.555C27.0387 6.8875 26.7787 6.26 26.3062 5.7875L24.3237 3.805C23.3787 2.86 21.73 2.865 20.7925 3.80125L8.75 15.7288V21.2663ZM22.5562 5.5725L24.5425 7.55125L22.5462 9.52875L20.5637 7.5475L22.5562 5.5725ZM11.25 16.7713L18.7875 9.305L20.77 11.2875L13.2337 18.7513L11.25 18.7575V16.7713Z"
                                    fill="black"
                                  />
                                  <path
                                    d="M6.25 26.25H23.75C25.1288 26.25 26.25 25.1288 26.25 23.75V12.915L23.75 15.415V23.75H10.1975C10.165 23.75 10.1313 23.7625 10.0988 23.7625C10.0575 23.7625 10.0163 23.7513 9.97375 23.75H6.25V6.25H14.8088L17.3088 3.75H6.25C4.87125 3.75 3.75 4.87125 3.75 6.25V23.75C3.75 25.1288 4.87125 26.25 6.25 26.25Z"
                                    fill="black"
                                  />
                                </svg>
                              </Link>
                            </div>
                            <div className="w-1/12 text-center text-lg font-['Sarabun'] flex place-content-center place-items-center">
                              {session?.data?.data?.ID !== data.ID ? (
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
                                      d="M7.5 3C7.5 2.20435 7.81607 1.44129 8.37868 0.87868C8.94129 0.31607 9.70435 0 10.5 0H19.5C20.2956 0 21.0587 0.31607 21.6213 0.87868C22.1839 1.44129 22.5 2.20435 22.5 3V6H28.5C28.8978 6 29.2794 6.15804 29.5607 6.43934C29.842 6.72064 30 7.10218 30 7.5C30 7.89782 29.842 8.27936 29.5607 8.56066C29.2794 8.84196 28.8978 9 28.5 9H26.8965L25.596 27.213C25.5421 27.9699 25.2034 28.6782 24.6482 29.1954C24.0929 29.7125 23.3623 30 22.6035 30H7.395C6.63621 30 5.9056 29.7125 5.35033 29.1954C4.79505 28.6782 4.45637 27.9699 4.4025 27.213L3.105 9H1.5C1.10218 9 0.720644 8.84196 0.43934 8.56066C0.158035 8.27936 0 7.89782 0 7.5C0 7.10218 0.158035 6.72064 0.43934 6.43934C0.720644 6.15804 1.10218 6 1.5 6H7.5V3ZM10.5 6H19.5V3H10.5V6ZM6.111 9L7.3965 27H22.605L23.8905 9H6.111ZM12 12C12.3978 12 12.7794 12.158 13.0607 12.4393C13.342 12.7206 13.5 13.1022 13.5 13.5V22.5C13.5 22.8978 13.342 23.2794 13.0607 23.5607C12.7794 23.842 12.3978 24 12 24C11.6022 24 11.2206 23.842 10.9393 23.5607C10.658 23.2794 10.5 22.8978 10.5 22.5V13.5C10.5 13.1022 10.658 12.7206 10.9393 12.4393C11.2206 12.158 11.6022 12 12 12ZM18 12C18.3978 12 18.7794 12.158 19.0607 12.4393C19.342 12.7206 19.5 13.1022 19.5 13.5V22.5C19.5 22.8978 19.342 23.2794 19.0607 23.5607C18.7794 23.842 18.3978 24 18 24C17.6022 24 17.2206 23.842 16.9393 23.5607C16.658 23.2794 16.5 22.8978 16.5 22.5V13.5C16.5 13.1022 16.658 12.7206 16.9393 12.4393C17.2206 12.158 17.6022 12 18 12Z"
                                      fill="red"
                                    />
                                  </svg>
                                </button>
                              ) : null}
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
                  currentPage={managerPage}
                  allPage={manager.allPage}
                  increase={increaseManagerPage}
                  decrease={decreaseManagerPage}
                  first={firstManagerPage}
                  last={lastManagerPage}
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
