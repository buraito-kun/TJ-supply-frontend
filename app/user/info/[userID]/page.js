"use client";

import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import SideBar from "@/components/Sidebar";
import { redirect, useRouter } from "next/navigation";
import Breadcrumb from "@/components/Breadcrumb";
import Footer from "@/components/Footer";
import Link from "next/link";
import BackButton from "@/components/BackButton";
import Swal from "sweetalert2";
import Select from "react-select";

export default function InfoUser({ params }) {
  const session = useSession();
  const router = useRouter();
  const role = session?.data?.data?.role;
  const [userData, setUserData] = useState({});

  const roles = [
    { value: "manager", label: "ผู้ดูแลระบบ" },
    { value: "storager", label: "ผู้ดูแลคลัง" },
    { value: "tester", label: "ผู้ทดสอบ" },
    { value: "worker", label: "แรงงาน" },
  ];

  useEffect(() => {
    if (session?.status === "authenticated") {
      if (role[0] !== "m") redirect("/");
    } else if (session?.status === "unauthenticated") {
      redirect("/");
    }
    const fetchData = async () => {
      const data = await fetchUserData();
      setUserData(data);
    };
    fetchData();
  }, [session, role]);

  const fetchUserData = async () => {
    const res = await fetch(
      process.env.NEXT_PUBLIC_API_URL + `user/${params.userID}`,
      {
        method: "GET",
      }
    );
    if (!res.ok) {
      Swal.fire({
        icon: "error",
        title: "ไม่มีข้อมูลผู้ใช้นี้ในระบบ",
        text: "กลับไปหน้าก่อนหน้า",
      }).then((result) => {
        if (result.isConfirmed) router.back();
      });
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
                <Link href="/user" className="ml-20">
                  <BackButton text="ย้อนกลับ" />
                </Link>
                <h2 className="ml-20 text-black text-2xl font-bold font-['Sarabun']">
                  ข้อมูลผู้ใช้งาน
                </h2>
              </div>
            </div>
            <div className="bg-white w-full h-full flex flex-col place-items-center place-content-center">
              <div className="w-[1000px] h-[700px] flex flex-col place-items-center place-content-between border-black border-2 rounded-[15px]">
                <div className="mx-10 my-10 w-[90%] h-[90%] flex flex-col text-black text-xl font-['Sarabun']">
                  <div className="w-full h-[200px] flex">
                    <div className="w-full h-full flex">
                      <label className="w-[100%]">
                        <h4 className="text-xl font-normal font-['Sarabun']">
                          ชื่อผู้ใช้งาน
                        </h4>
                        <div className="h-[50px] w-full border border-black mt-1 px-3 text-2xl font-normal font-['Sarabun'] rounded-md flex place-items-center overflow-hidden">
                          <h5 className="text-2xl font-normal font-['Sarabun']">
                            {userData?.data?.username}
                          </h5>
                        </div>
                      </label>
                    </div>
                  </div>
                  <div className="w-full h-[200px] flex">
                    <div className="w-1/2 h-full flex">
                      <label className="w-[100%]">
                        <h4 className="text-xl font-normal font-['Sarabun']">
                          ชื่อจริง
                        </h4>
                        <div className="h-[50px] w-full border border-black mt-1 px-3 text-2xl font-normal font-['Sarabun'] rounded-md flex place-items-center overflow-hidden">
                          <h5 className="text-2xl font-normal font-['Sarabun']">
                            {userData?.data?.name}
                          </h5>
                        </div>
                      </label>
                    </div>
                    <div className="w-[5%] h-full"></div>
                    <div className="w-1/2 h-full flex">
                      <label className="w-[100%]">
                        <h4 className="text-xl font-normal font-['Sarabun']">
                          นามสกุล
                        </h4>
                        <div className="h-[50px] w-full border border-black mt-1 px-3 text-2xl font-normal font-['Sarabun'] rounded-md flex place-items-center overflow-hidden">
                          <h5 className="text-2xl font-normal font-['Sarabun']">
                            {userData?.data?.surname}
                          </h5>
                        </div>
                      </label>
                    </div>
                  </div>
                  <div className="w-full h-[200px] flex">
                    <div className="w-1/2 h-full flex">
                      <label className="w-[100%]">
                        <h4 className="text-xl font-normal font-['Sarabun']">
                          อีเมล์
                        </h4>
                        <div className="h-[50px] w-full border border-black mt-1 px-3 text-2xl font-normal font-['Sarabun'] rounded-md flex place-items-center overflow-hidden">
                          <h5 className="text-2xl font-normal font-['Sarabun']">
                            {userData?.data?.email}
                          </h5>
                        </div>
                      </label>
                    </div>
                    <div className="w-[5%] h-full"></div>
                    <div className="w-1/2 h-full flex">
                      <label className="w-[100%]">
                        <h4 className="text-xl font-normal font-['Sarabun']">
                          เบอร์โทรศัพท์
                        </h4>
                        <div className="h-[50px] w-full border border-black mt-1 px-3 text-2xl font-normal font-['Sarabun'] rounded-md flex place-items-center overflow-hidden">
                          <h5 className="text-2xl font-normal font-['Sarabun']">
                            {userData?.data?.phone}
                          </h5>
                        </div>
                      </label>
                    </div>
                  </div>
                  <div className="w-full h-[200px] flex">
                    <div className="w-[20%] h-full">
                      <h4 className="text-xl font-normal font-['Sarabun']">
                        เพศ
                      </h4>
                      <div className="h-[50px] w-full pl-5 border border-black mt-1 text-2xl font-normal font-['Sarabun'] rounded-md flex place-items-center overflow-hidden">
                        <h5 className="text-2xl font-normal font-['Sarabun']">
                          {userData?.data?.gender === "male"
                            ? "ชาย"
                            : userData?.data?.gender === "female"
                            ? "หญิง"
                            : null}
                        </h5>
                      </div>
                    </div>
                    <div className="w-[5%] h-full"></div>
                    <div className="w-[75%] h-full flex flex-col">
                      <h4 className="text-xl font-normal font-['Sarabun']">
                        ตำแหน่ง
                      </h4>
                      <div className="h-[50px] w-full">
                        <Select
                          closeMenuOnSelect={false}
                          isMulti
                          options={roles}
                          value={[
                            userData?.data?.role[0] === "m" ? roles[0] : null,
                            userData?.data?.role[1] === "s" ? roles[1] : null,
                            userData?.data?.role[2] === "t" ? roles[2] : null,
                            userData?.data?.role[3] === "w" ? roles[3] : null,
                          ]}
                          isDisabled
                        />
                      </div>
                    </div>
                  </div>
                  <div className="w-full h-full flex">
                    <div className="w-full h-full">
                      <label className="w-auto h-auto">
                        <h4 className="text-xl font-normal font-['Sarabun']">
                          ที่อยู่
                        </h4>
                        <div className="bg-white border border-black w-full h-[240px] min-h-[50px] max-h-[240px] rounded-lg text-2xl font-normal font-['Sarabun'] px-2 py-2 whitespace-normal break-words">
                          <h5 className="text-2xl font-normal font-['Sarabun'] w-full h-full">
                            {userData?.data?.address}
                          </h5>
                        </div>
                      </label>
                    </div>
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
