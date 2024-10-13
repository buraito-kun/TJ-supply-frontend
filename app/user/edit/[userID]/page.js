"use client";

import SideBar from "@/components/Sidebar";
import Breadcrumb from "@/components/Breadcrumb";
import Footer from "@/components/Footer";
import { useSession } from "next-auth/react";
import { useState, useEffect, useRef } from "react";
import { redirect, useRouter } from "next/navigation";
import Link from "next/link";
import BackButton from "@/components/BackButton";
import Select from "react-select";
import SubmitButton from "@/components/SubmitButton";
import Swal from "sweetalert2";
import Image from "next/image";

export default function EditUser({ params }) {
  const session = useSession();
  const router = useRouter();
  const fileInputRef = useRef(null);
  const role = session?.data?.data?.role;
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [email, setEmail] = useState("");
  const [gender, setGender] = useState("");
  const [tel, setTel] = useState("");
  const [duty, setDuty] = useState("");
  const [address, setAddress] = useState("");
  const [birthday, setBirthday] = useState("");
  const [dateEmployment, setDateEmployment] = useState("");

  const roles = [
    { value: "manager", label: "ผู้ดูแลระบบ" },
    { value: "storager", label: "ผู้ดูแลคลัง" },
    { value: "tester", label: "ผู้ทดสอบ" },
    { value: "worker", label: "แรงงาน" },
    { value: "admin", label: "แอดมิน" },
    { value: "finance", label: "การเงิน" },
  ];

  useEffect(() => {
    if (session?.status === "authenticated") {
      if (role[0] !== "m") redirect("/");
    } else if (session?.status === "unauthenticated") {
      redirect("/");
    }
    const fetchData = async () => {
      const data = await fetchUserData();
      setUsername(data?.data?.username);
      setName(data?.data?.name);
      setSurname(data?.data?.surname);
      setEmail(data?.data?.email);
      setGender(data?.data?.gender);
      setTel(data?.data?.phone);
      setDuty(data?.data?.role);
      setAddress(data?.data?.address);
      setBirthday(data?.data?.birthday);
      setDateEmployment(data?.data?.dateEmployment);
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

  const updateUser = async () => {
    if (!(!name || !surname || !gender || !duty)) {
      var roleTemp = "----------";
      for (let r of duty) {
        if (r.value === "manager") roleTemp = "m" + roleTemp.slice(1, 10);
        else if (r.value === "storager")
          roleTemp = roleTemp.slice(0, 1) + "s" + roleTemp.slice(2, 10);
        else if (r.value === "tester")
          roleTemp = roleTemp.slice(0, 2) + "t" + roleTemp.slice(3, 10);
        else if (r.value === "worker")
          roleTemp = roleTemp.slice(0, 3) + "w" + roleTemp.slice(4, 10);
        else if (r.value === "admin")
          roleTemp = roleTemp.slice(0, 4) + "a" + roleTemp.slice(5, 10);
        else if (r.value === "finance")
          roleTemp = roleTemp.slice(0, 5) + "f" + roleTemp.slice(6, 10);
      }
      const res = await fetch(
        process.env.NEXT_PUBLIC_API_URL + `user/${params.userID}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body:
            roleTemp === "----------"
              ? JSON.stringify({
                  username: username,
                  name: name,
                  surname: surname,
                  gender: gender,
                  phone: tel,
                  address: address,
                  birthday: birthday,
                  dateEmployment: dateEmployment,
                })
              : JSON.stringify({
                  username: username,
                  name: name,
                  surname: surname,
                  gender: gender,
                  phone: tel,
                  role: roleTemp,
                  address: address,
                  birthday: birthday,
                  dateEmployment: dateEmployment,
                }),
        }
      );
      if (!res.ok) {
        Swal.fire({
          icon: "error",
          title: "ตรวจสอบข้อมูลใหม่อีกครั้ง",
          text: "ชื่อผู้ใช้งานและอีเมล์ไม่สามารถซ้ำกับของที่มีอยู่ได้ และข้อมูลที่จำเป็นต้องกรอกกรอกครบเรียบร้อยแล้ว",
        });
      } else {
        Swal.fire({
          position: "top-end",
          icon: "success",
          title: "บันทึกข้อมูลเรียบร้อย",
          showConfirmButton: false,
          timer: 1500,
        });
        setTimeout(() => {
          router.refresh();
        }, 1500);
      }
    } else {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Something went wrong!",
        footer: '<a href="#">Why do I have this issue?</a>',
      });
    }
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
                  แก้ไขข้อมูล
                </h2>
              </div>
              <div className="flex w-full place-content-end mr-20">
                <SubmitButton text="บันทึกการแก้ไข" onClick={updateUser} />
              </div>
            </div>
            <div className="bg-white w-full flex flex-col place-items-center place-content-center">
              <div className="w-[1000px] flex flex-col place-items-center place-content-between border-black border-2 rounded-[15px]">
                <div className="mx-10 my-10 w-[90%] h-[90%] flex flex-col text-black text-xl font-['Sarabun']">
                  <div className="w-full flex place-items-center place-content-center mb-5">
                    <input
                      className="hidden"
                      accept="image/*"
                      ref={fileInputRef}
                      type="file"
                      id="file"
                      name="file"
                      onChange={async (e) => {
                        const formData = new FormData();
                        formData.append("file", e.target.files[0]);
                        await fetch(
                          process.env.NEXT_PUBLIC_API_URL +
                            `user/upload/profile/${params.userID}`,
                          { method: "PATCH", body: formData }
                        );
                        router.refresh();
                        Swal.fire({
                          position: "top-end",
                          icon: "success",
                          title: "บันทึกรูปโปรไฟล์สำเร็จ",
                          showConfirmButton: false,
                          timer: 1000,
                        });
                      }}
                    />
                    {session.data?.data?.ID && (
                      <button
                        className="rounded-full"
                        onClick={() => {
                          fileInputRef.current.click();
                        }}
                      >
                        <div className="relative group w-[150px] h-[150px] rounded-full">
                          <Image
                            className="rounded-full absolute w-full h-full"
                            src={`/api/user/image/${
                              params.userID
                            }?timestamp=${Date.now()}`}
                            width={150}
                            height={150}
                            alt="userProfile"
                          />
                          <div className="absolute w-full h-full rounded-full bg-black opacity-80 invisible group-hover:visible" />
                          <div className="w-full h-full absolute invisible group-hover:visible rounded-full">
                            <div className="w-full h-full flex place-items-center place-content-center rounded-full">
                              <h1 className="text-white text-xl font-normal font-['Sarabun']">
                                เปลี่ยนรูปภาพ
                              </h1>
                            </div>
                          </div>
                        </div>
                      </button>
                    )}
                  </div>
                  <div className="w-full flex mb-5">
                    <div className="w-full h-full flex">
                      <label className="w-[100%]">
                        <h4 className="text-xl font-normal font-['Sarabun']">
                          ชื่อผู้ใช้งาน
                        </h4>
                        <input
                          className="h-[50px] w-full border border-black mt-1 px-3 text-2xl font-normal font-['Sarabun'] rounded-md cursor-not-allowed"
                          type="text"
                          value={username}
                          disabled
                        />
                      </label>
                    </div>
                  </div>
                  <div className="w-full flex mb-5">
                    <div className="w-1/2 h-full flex">
                      <label className="w-[100%]">
                        <h4 className="text-xl font-normal font-['Sarabun']">
                          ชื่อจริง<span className="text-red-600">&nbsp;*</span>
                        </h4>
                        <input
                          className="h-[50px] w-full border border-black mt-1 px-3 text-2xl font-normal font-['Sarabun'] rounded-md"
                          type="text"
                          placeholder="ชื่อจริง"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          required
                        />
                      </label>
                    </div>
                    <div className="w-[5%] h-full"></div>
                    <div className="w-1/2 h-full flex">
                      <label className="w-[100%]">
                        <h4 className="text-xl font-normal font-['Sarabun']">
                          นามสกุล<span className="text-red-600">&nbsp;*</span>
                        </h4>
                        <input
                          className="h-[50px] w-full border border-black mt-1 px-3 text-2xl font-normal font-['Sarabun'] rounded-md"
                          type="text"
                          placeholder="นามสกุล"
                          value={surname}
                          onChange={(e) => setSurname(e.target.value)}
                          required
                        />
                      </label>
                    </div>
                  </div>
                  <div className="w-full flex mb-5">
                    <div className="w-1/2 h-full flex">
                      <label className="w-[100%]">
                        <h4 className="text-xl font-normal font-['Sarabun']">
                          อีเมล์
                        </h4>
                        <input
                          className="h-[50px] w-full border border-black mt-1 px-3 text-2xl font-normal font-['Sarabun'] rounded-md cursor-not-allowed"
                          type="email"
                          placeholder="example@gmail.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          disabled
                        />
                      </label>
                    </div>
                    <div className="w-[5%] h-full"></div>
                    <div className="w-1/2 h-full flex">
                      <label className="w-[100%]">
                        <h4 className="text-xl font-normal font-['Sarabun']">
                          เบอร์โทรศัพท์
                        </h4>
                        <input
                          className="h-[50px] w-full border border-black mt-1 px-3 text-2xl font-normal font-['Sarabun'] rounded-md"
                          type="tel"
                          placeholder="084XXXXXXX"
                          value={tel}
                          onChange={(e) => setTel(e.target.value)}
                          required
                        />
                      </label>
                    </div>
                  </div>
                  <div className="w-full flex mb-5">
                    <div className="w-1/2 h-full flex">
                      <label className="w-[100%]">
                        <h4 className="text-xl font-normal font-['Sarabun']">
                          วันเกิด (MM/DD/YYYY)
                        </h4>
                        <div className="h-[50px] w-full border border-black mt-1 px-3 text-2xl font-normal font-['Sarabun'] rounded-md flex place-items-center overflow-hidden">
                          <input
                            className="text-2xl font-normal font-['Sarabun'] w-full h-full"
                            type="date"
                            value={birthday.split("T")[0]}
                            onChange={(e) => setBirthday(e.target.value)}
                            min={"1950-01-01"}
                            max={new Date().toISOString().split("T")[0]}
                          />
                        </div>
                      </label>
                    </div>
                    <div className="w-[5%] h-full"></div>
                    <div className="w-1/2 h-full flex">
                      <label className="w-[100%]">
                        <h4 className="text-xl font-normal font-['Sarabun']">
                          วันบรรจุเข้าทำงาน (MM/DD/YYYY)
                        </h4>
                        <div className="h-[50px] w-full border border-black mt-1 px-3 text-2xl font-normal font-['Sarabun'] rounded-md flex place-items-center overflow-hidden">
                          <input
                            className="text-2xl font-normal font-['Sarabun'] w-full"
                            type="date"
                            value={dateEmployment.split("T")[0]}
                            disabled
                          />
                        </div>
                      </label>
                    </div>
                  </div>
                  <div className="w-full flex mb-5">
                    <div className="w-[20%] h-full">
                      <label>
                        <h4 className="text-xl font-normal font-['Sarabun']">
                          เพศ<span className="text-red-600">&nbsp;*</span>
                        </h4>
                        <select
                          className="h-[50px] w-full pl-5 border border-black mt-1 text-2xl font-normal font-['Sarabun'] rounded-md"
                          value={gender}
                          onChange={(e) => {
                            setGender(e.target.value);
                          }}
                        >
                          <option
                            value="none"
                            disabled
                            hidden
                            className="text-red-600"
                          >
                            เลือกเพศ
                          </option>
                          <option value="male">ชาย</option>
                          <option value="female">หญิง</option>
                        </select>
                      </label>
                    </div>
                    <div className="w-[5%] h-full"></div>
                    <div className="w-[75%] h-full">
                      <label>
                        <h4 className="text-xl font-normal font-['Sarabun']">
                          ตำแหน่ง<span className="text-red-600">&nbsp;*</span>
                        </h4>
                        <div className="w-full h-[50px]">
                          {duty && (
                            <Select
                              closeMenuOnSelect={false}
                              isMulti
                              options={roles}
                              onChange={(e) => setDuty(e)}
                              defaultValue={[
                                duty[0] === "m" ? roles[0] : null,
                                duty[1] === "s" ? roles[1] : null,
                                duty[2] === "t" ? roles[2] : null,
                                duty[3] === "w" ? roles[3] : null,
                                duty[4] === "a" ? roles[4] : null,
                                duty[5] === "f" ? roles[5] : null,
                              ]}
                            />
                          )}
                        </div>
                      </label>
                    </div>
                  </div>
                  <div className="w-full h-full flex">
                    <div className="w-full h-full">
                      <label className="w-auto h-auto">
                        <h4 className="text-xl font-normal font-['Sarabun']">
                          ที่อยู่
                        </h4>
                        <textarea
                          className="bg-white border border-black w-full h-[240px] min-h-[50px] max-h-[240px] rounded-lg text-2xl font-normal font-['Sarabun'] px-2 py-2"
                          value={address}
                          onChange={(e) => setAddress(e.target.value)}
                        ></textarea>
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
