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
  const [admin, setAdmin] = useState([]);
  const [finance, setFinance] = useState([]);
  const [managerPage, setManagerPage] = useState(1);
  const [storagerPage, setStoragerPage] = useState(1);
  const [testerPage, setTesterPage] = useState(1);
  const [workerPage, setWorkerPage] = useState(1);
  const [adminPage, setAdminPage] = useState(1);
  const [financePage, setFinancePage] = useState(1);

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

  useEffect(() => {
    const fetchData = async () => {
      const adminData = await fetchDataPerRole(adminPage, "a");
      setAdmin(adminData);
    };
    fetchData();
  }, [adminPage]);

  useEffect(() => {
    const fetchData = async () => {
      const financeData = await fetchDataPerRole(financePage, "f");
      setFinance(financeData);
    };
    fetchData();
  }, [financePage]);

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
  const increaseAdminPage = () => {
    setAdminPage(
      adminPage >= admin.allPage ? admin.allPage : adminPage + 1
    );
  };
  const decreaseAdminPage = () => {
    setAdminPage(adminPage <= 1 ? 1 : adminPage - 1);
  };
  const firstAdminPage = () => {
    setAdminPage(1);
  };
  const lastAdminPage = () => {
    setAdminPage(admin.allPage);
  };
  const increaseFinancePage = () => {
    setFinancePage(
      financePage >= finance.allPage ? finance.allPage : financePage + 1
    );
  };
  const decreaseFinancePage = () => {
    setFinancePage(financePage <= 1 ? 1 : financePage - 1);
  };
  const firstFinancePage = () => {
    setFinancePage(1);
  };
  const lastFinancePage = () => {
    setFinancePage(finance.allPage);
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
              <div>
                <Link href="/user/approve" className="mr-3">
                  <SubmitButton text="อนุมัติพนักงาน" />
                </Link>
                <Link href="/user/actionHistory" className="mr-20">
                  <SubmitButton text="ประวัติการใช้งาน" />
                </Link>
              </div>
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
                              {Translator.user.icon}
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
                              {Translator.user.icon}
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
                              {Translator.user.icon}
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
            
              finance session

            */}
            <div className="flex flex-col w-full mt-[50px]">
              <div className="flex flex-row w-full place-items-center place-content-between">
                <h2 className="ml-40 text-black text-xl font-normal font-['Sarabun']">
                  รายชื่อฝ่ายการเงิน
                </h2>
                <div className="pr-[120px]">
                  <Link href="/user/add/5">
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
                      {finance?.data?.map((data) => {
                        return (
                          <div
                            key={data.ID}
                            className="flex flex-row w-full h-12 hover:bg-gray-200"
                          >
                            <div className="w-7/12 text-start text-lg font-['Sarabun'] flex place-items-center">
                              {Translator.user.icon}
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
                  currentPage={financePage}
                  allPage={finance.allPage}
                  increase={increaseFinancePage}
                  decrease={decreaseFinancePage}
                  first={firstFinancePage}
                  last={lastFinancePage}
                />
              </div>
            </div>
            {/*
            
              admin session

            */}
            <div className="flex flex-col w-full mt-[50px]">
              <div className="flex flex-row w-full place-items-center place-content-between">
                <h2 className="ml-40 text-black text-xl font-normal font-['Sarabun']">
                  รายชื่อแอดมิน
                </h2>
                <div className="pr-[120px]">
                  <Link href="/user/add/4">
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
                      {admin?.data?.map((data) => {
                        return (
                          <div
                            key={data.ID}
                            className="flex flex-row w-full h-12 hover:bg-gray-200"
                          >
                            <div className="w-7/12 text-start text-lg font-['Sarabun'] flex place-items-center">
                              {Translator.user.icon}
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
                  currentPage={adminPage}
                  allPage={admin.allPage}
                  increase={increaseAdminPage}
                  decrease={decreaseAdminPage}
                  first={firstAdminPage}
                  last={lastAdminPage}
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
                              {Translator.user.icon}
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
