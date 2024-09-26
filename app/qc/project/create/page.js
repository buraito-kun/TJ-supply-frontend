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

export default function CreateQcProject() {
  const session = useSession();
  const router = useRouter();
  const role = session?.data?.data?.role;

  const [formulaProjectList, setFormulaProjectList] = useState([]);
  const [qcMain, setQcMain] = useState([]);
  const [name, setName] = useState("");
  const [detail, setDetail] = useState("");

  useEffect(() => {
    if (session?.status === "authenticated") {
      if (role[0] !== "m" && role[1] !== "s") redirect("/");
    } else if (session?.status === "unauthenticated") {
      redirect("/");
    }
    fetchData();
  }, [session, role]);

  const createQcProject = async () => {
    const temp = qcMain.map((data) => data.value);
    if (!(!name || !qcMain)) {
      const res = await fetch(
        process.env.NEXT_PUBLIC_API_URL + "qc/itemProject/multi",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            projectName: name,
            detail: detail,
            qcMainID: temp,
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
        title: "กรอกข้อมูลไม่ครบ",
        text: "กรุณากรอกข้อมูลให้ครบตามช่องที่มี * สีแดง",
      });
    }
  };

  const fetchData = async () => {
    const formulaData = await fetchFormulaProjectList();
    setFormulaProjectList(formulaData);
  };

  const fetchFormulaProjectList = async () => {
    const res = await fetch(
      process.env.NEXT_PUBLIC_API_URL + `qc/main?limit=9999999&page=1`,
      { method: "GET" }
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
            <div className="flex flex-row w-full place-items-center">
              <div className="flex place-items-center">
                <Link href="/qc/project" className="ml-20">
                  <BackButton text="ย้อนกลับ" />
                </Link>
                <h2 className="ml-20 text-black text-2xl font-bold font-['Sarabun']">
                  สร้างโปรเจ็คการทดสอบ
                </h2>
              </div>
              <div className="flex w-full place-content-end mr-20">
                <SubmitButton text="สร้าง" onClick={createQcProject} />
              </div>
            </div>
            <div className="bg-white w-full h-auto flex flex-col place-items-center place-content-center">
              <div className="w-[1000px] h-auto flex flex-col place-items-center place-content-between border-black border-2 rounded-[15px]">
                <div className="mx-10 my-10 w-[90%] h-auto flex flex-col text-black text-xl font-['Sarabun']">
                  <div className="w-full h-auto mb-5 flex text-black">
                    <label className="w-[100%]">
                      <h4 className="text-xl font-normal font-['Sarabun']">
                        ชื่อโปรเจ็คการทดสอบ
                        <span className="text-red-600">&nbsp;*</span>
                      </h4>
                      <input
                        className="h-[50px] w-full border border-black mt-1 px-3 text-2xl font-normal font-['Sarabun'] rounded-md"
                        type="text"
                        maxLength={100}
                        placeholder="ชื่อโปรเจ็คการทดสอบ"
                        onChange={(e) => setName(e.target.value)}
                        required
                      />
                    </label>
                  </div>
                  <div className="w-full h-auto mb-5 flex text-black">
                    <label className="w-full">
                      <h4 className="text-xl font-normal font-['Sarabun']">
                        การทดสอบ
                        <span className="text-red-600">&nbsp;*</span>
                      </h4>
                      <Select
                        name="formulaProject"
                        closeMenuOnSelect={false}
                        isMulti
                        options={formulaProjectList?.data?.map((data) => ({
                          value: data.ID,
                          label: data.testName,
                        }))}
                        onChange={(e) => setQcMain(e)}
                      />
                    </label>
                  </div>
                  <div className="w-full h-auto mb-5 flex text-black">
                    <div className="w-full h-full">
                      <label className="w-auto h-auto">
                        <h4 className="text-xl font-normal font-['Sarabun']">
                          รายละเอียด
                        </h4>
                        <textarea
                          className="bg-white border border-black w-full h-[150px] min-h-[50px] max-h-[150px] rounded-lg text-2xl font-normal font-['Sarabun'] px-2 py-2"
                          maxLength={200}
                          onChange={(e) => setDetail(e.target.value)}
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
