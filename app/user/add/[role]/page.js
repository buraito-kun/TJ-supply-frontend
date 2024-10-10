"use client";

import SideBar from "@/components/Sidebar";
import Breadcrumb from "@/components/Breadcrumb";
import Footer from "@/components/Footer";
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { redirect, useRouter } from "next/navigation";
import Link from "next/link";
import BackButton from "@/components/BackButton";
import Select from "react-select";
import SubmitButton from "@/components/SubmitButton";
import Swal from "sweetalert2";

export default function AddUser({ params }) {
  const session = useSession();
  const router = useRouter();
  const role = session?.data?.data?.role;
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [email, setEmail] = useState("");
  const [gender, setGender] = useState("");
  const [tel, setTel] = useState("");
  const [duty, setDuty] = useState([]);
  const [address, setAddress] = useState("");

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
  }, [session, role]);

  const createNewUser = async () => {
    if (
      !(
        !username ||
        !password ||
        !name ||
        !surname ||
        !email ||
        !gender ||
        !duty
      )
    ) {
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
      const res = await fetch(process.env.NEXT_PUBLIC_API_URL + "user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body:
          roleTemp === "----------"
            ? JSON.stringify({
                username: username,
                password: password,
                name: name,
                surname: surname,
                email: email,
                gender: gender,
                role:
                  params.role === "0"
                    ? "m---------"
                    : params.role === "1"
                    ? "-s--------"
                    : params.role === "2"
                    ? "--t-------"
                    : params.role === "4"
                    ? "----a-----"
                    : params.role === "5"
                    ? "-----f----"
                    : "---w------",
                phone: tel,
                address: address,
              })
            : JSON.stringify({
                username: username,
                password: password,
                name: name,
                surname: surname,
                email: email,
                gender: gender,
                phone: tel,
                role: roleTemp,
                address: address,
              }),
      });
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
        title: "กรอกข้อมูลไม่ครบ",
        text: "กรุณากรอกข้อมูลให้ครบตามช่องที่มี * สีแดง",
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
                  เพิ่มผู้ใช้งาน
                </h2>
              </div>
              <div className="flex w-full place-content-end mr-20">
                <SubmitButton text="เพิ่มผู้ใช้งาน" onClick={createNewUser} />
              </div>
            </div>
            <div className="bg-white w-full h-full flex flex-col place-items-center place-content-center">
              <div className="w-[1000px] h-[650px] flex flex-col place-items-center place-content-between border-black border-2 rounded-[15px]">
                <div className="mx-10 my-10 w-[90%] h-[90%] flex flex-col text-black text-xl font-['Sarabun']">
                  <div className="w-full h-[200px] flex">
                    <div className="w-1/2 h-full flex">
                      <label className="w-[100%]">
                        <h4 className="text-xl font-normal font-['Sarabun']">
                          ชื่อผู้ใช้งาน
                          <span className="text-red-600">&nbsp;*</span>
                        </h4>
                        <input
                          className="h-[50px] w-full border border-black mt-1 px-3 text-2xl font-normal font-['Sarabun'] rounded-md"
                          type="text"
                          maxLength={50}
                          placeholder="ชื่อผู้ใช้งาน"
                          onChange={(e) => setUsername(e.target.value)}
                          required
                        />
                      </label>
                    </div>
                    <div className="w-[5%] h-full"></div>
                    <div className="w-1/2 h-full flex">
                      <label className="w-[100%]">
                        <h4 className="text-xl font-normal font-['Sarabun']">
                          รหัสผ่าน<span className="text-red-600">&nbsp;*</span>
                        </h4>
                        <input
                          className="h-[50px] w-full border border-black mt-1 px-3 text-2xl font-normal font-['Sarabun'] rounded-md"
                          type="password"
                          maxLength={200}
                          placeholder="รหัสผ่าน"
                          onChange={(e) => setPassword(e.target.value)}
                          required
                        />
                      </label>
                    </div>
                  </div>
                  <div className="w-full h-[200px] flex">
                    <div className="w-1/2 h-full flex">
                      <label className="w-[100%]">
                        <h4 className="text-xl font-normal font-['Sarabun']">
                          ชื่อจริง<span className="text-red-600">&nbsp;*</span>
                        </h4>
                        <input
                          className="h-[50px] w-full border border-black mt-1 px-3 text-2xl font-normal font-['Sarabun'] rounded-md"
                          type="text"
                          maxLength={30}
                          placeholder="ชื่อจริง"
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
                          maxLength={30}
                          placeholder="นามสกุล"
                          onChange={(e) => setSurname(e.target.value)}
                          required
                        />
                      </label>
                    </div>
                  </div>
                  <div className="w-full h-[200px] flex">
                    <div className="w-1/2 h-full flex">
                      <label className="w-[100%]">
                        <h4 className="text-xl font-normal font-['Sarabun']">
                          อีเมล์<span className="text-red-600">&nbsp;*</span>
                        </h4>
                        <input
                          className="h-[50px] w-full border border-black mt-1 px-3 text-2xl font-normal font-['Sarabun'] rounded-md"
                          type="email"
                          maxLength={50}
                          placeholder="example@gmail.com"
                          onChange={(e) => setEmail(e.target.value)}
                          required
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
                          type="number"
                          maxLength={10}
                          onInput={(e) => {
                            if (e.target.value.length > e.target.maxLength) {
                              Swal.fire({
                                icon: "error",
                                title: "กรอกเบอร์โทรศัพท์ผิด",
                                text: "กรุณากรอกใหม่อีกครั้ง",
                              });
                              e.target.value = null;
                            }
                          }}
                          placeholder="084XXXXXXX"
                          onChange={(e) => setTel(e.target.value)}
                          required
                        />
                      </label>
                    </div>
                  </div>
                  <div className="w-full h-[200px] flex">
                    <div className="w-[20%] h-full">
                      <label>
                        <h4 className="text-xl font-normal font-['Sarabun']">
                          เพศ<span className="text-red-600">&nbsp;*</span>
                        </h4>
                        <select
                          className="h-[50px] w-full pl-5 border border-black mt-1 text-2xl font-normal font-['Sarabun'] rounded-md"
                          defaultValue={"none"}
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
                          {params.role &&
                            [1].map(() => {
                              return (
                                <Select
                                  key="1"
                                  closeMenuOnSelect={false}
                                  isMulti
                                  defaultValue={[
                                    params?.role === "0" ? roles[0] : null,
                                    params?.role === "1" ? roles[1] : null,
                                    params?.role === "2" ? roles[2] : null,
                                    params?.role === "3" ? roles[3] : null,
                                    params?.role === "4" ? roles[4] : null,
                                    params?.role === "5" ? roles[5] : null,
                                  ]}
                                  options={roles}
                                  onChange={(e) => setDuty(e)}
                                />
                              );
                            })}
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
                          className="bg-white border border-black w-full h-[150px] min-h-[50px] max-h-[150px] rounded-lg text-2xl font-normal font-['Sarabun'] px-2 py-2"
                          maxLength={200}
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
