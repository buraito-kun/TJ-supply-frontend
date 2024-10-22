"use client";

import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import SideBar from "@/components/Sidebar";
import Breadcrumb from "@/components/Breadcrumb";
import { redirect, useRouter } from "next/navigation";
import CircleImageButton from "@/components/CircleImageButton";
import Footer from "@/components/Footer";
import SubmitButton from "@/components/SubmitButton";
import Pagination from "@/components/Pagination";
import Link from "next/link";
import Swal from "sweetalert2";
import BackButton from "@/components/BackButton";

export default function EditItemType({ params }) {
  const session = useSession();
  const router = useRouter();
  const role = session?.data?.data?.role;
  const [itemTypeName, setItemTypeName] = useState("");

  useEffect(() => {
    if (session?.status === "authenticated") {
      if (role[0] !== "m" && role[1] !== "s") redirect("/");
    } else if (session?.status === "unauthenticated") {
      redirect("/");
    }
    refreshData();
  }, [session, role]);

  const fetchItemTypeData = async () => {
    const res = await fetch(
      process.env.NEXT_PUBLIC_API_URL + `item/type/${params.itemTypeID}`,
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
    const itemTypeData = await fetchItemTypeData();
    setItemTypeName(itemTypeData.data.name);
  };

  const editItemType = async () => {
    if (itemTypeName) {
      const res = await fetch(
        process.env.NEXT_PUBLIC_API_URL + `item/type/${params.itemTypeID}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: itemTypeName }),
        }
      );
      if (!res.ok) {
        Swal.fire({
          icon: "error",
          title: "ตรวจสอบข้อมูลใหม่อีกครั้ง",
          text: "ชื่อประเภทสินค้าอาจจะซ้ำกับของที่มีอยู่",
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
          router.back();
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
      <div className="flex w-screen h-screen scroll-smooth">
        <SideBar className="flex w-auto h-auto" />
        <div className="flex flex-col w-full h-full">
          <Breadcrumb className="w-auto h-auto" />
          <div className="flex flex-col bg-white w-full h-full overflow-y-auto whitespace-nowrap place-items-center pt-[60px]">
            <div className="flex flex-row w-full place-items-center">
              <Link href="/item/itemType" className="ml-20">
                <BackButton text="ย้อนกลับ" />
              </Link>
              <h2 className="ml-20 text-black text-2xl font-bold font-['Sarabun']">
                แก้ไขประเภทสิ่งของ
              </h2>
            </div>
            <div className="flex flex-col w-full mt-10">
              <div className="flex flex-row w-full place-items-center">
                <h2 className="ml-40 text-black text-xl font-normal font-['Sarabun']">
                  แก้ไขชื่อประเภทสิ่งของ
                </h2>
              </div>
              <div className="flex place-items-center place-content-center mt-10">
                <label className="mx-20 w-1/2 flex flex-col">
                  <h4 className="text-xl text-black font-normal font-['Sarabun']">
                    ชื่อประเภทสิ่งของ
                    <span className="text-red-600">&nbsp;*</span>
                  </h4>
                  <input
                    type="text"
                    className="h-[50px] border border-black px-3 text-black text-2xl font-normal font-['Sarabun'] rounded-md"
                    defaultValue={itemTypeName}
                    placeholder="ชื่อประเภทสิ่งของ"
                    onChange={(e) => setItemTypeName(e.target.value)}
                  />
                </label>
                <SubmitButton text="บันทึก" onClick={editItemType} />
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
