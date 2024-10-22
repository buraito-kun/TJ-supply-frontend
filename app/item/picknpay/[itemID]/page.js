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

export default function AddPicknpay({ params }) {
  const session = useSession();
  const router = useRouter();
  const role = session?.data?.data?.role;

  const [amount, setAmount] = useState(0);
  const [costPerItem, setCostPerItem] = useState(0);

  const [item, setItem] = useState([]);

  useEffect(() => {
    if (session?.status === "authenticated") {
      if (role[0] !== "m" && role[1] !== "s" && role[3] !== "w") redirect("/");
    } else if (session?.status === "unauthenticated") {
      redirect("/");
    }
    fetchData();
  }, [session, role]);

  const createPicknpay = async () => {
    if (amount) {
      const res = await fetch(
        process.env.NEXT_PUBLIC_API_URL + "item/picknpay",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            itemID: params.itemID,
            borrowBy: session?.data?.data?.ID,
            amount: Number(amount),
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

  const fetchData = async () => {
    const itemData = await fetchItem();
    setItem(itemData);
  };

  const fetchItem = async () => {
    const res = await fetch(
      process.env.NEXT_PUBLIC_API_URL + `items/${params.itemID}`,
      { method: "GET" }
    );
    if (!res.ok) {
      throw new Error("Failed to fetch item type list");
    }
    return await res.json();
  };

  return (
    <>
      <div className="flex w-screen h-screen scroll-smooth">
        <SideBar className="flex w-auto h-auto" />
        <div className="flex flex-col w-full h-full">
          <Breadcrumb className="w-auto h-auto" />
          <div className="flex flex-col bg-white w-full h-full overflow-y-auto whitespace-nowrap place-items-center pt-[60px]">
            <div className="flex flex-row w-full place-items-center">
              <Link href="/item/picknpay" className="ml-20">
                <BackButton text="ย้อนกลับ" />
              </Link>
              <h2 className="ml-20 text-black text-2xl font-bold font-['Sarabun']">
                สั่งซื้อสินค้า
              </h2>
            </div>
            <div className="flex flex-row w-full place-items-center mt-10">
              <h2 className="ml-40 text-black text-xl font-normal font-['Sarabun']">
                สร้างใบสั่งซื้อสินค้า
              </h2>
            </div>
            <div className="flex flex-col w-full mt-10 place-items-center">
              <div className="flex flex-col w-[1000px] mx-10 py-10 border-black border-2 rounded-[15px]">
                <div className="flex flex-col w-full place-items-center">
                  <label className="w-2/3 mr-5 flex flex-col">
                    <h4 className="text-xl text-black font-normal font-['Sarabun']">
                      ชื่อประเภทสิ่งของ
                    </h4>
                    <input
                      type="text"
                      className="h-[50px] border border-black px-3 text-black text-2xl font-normal font-['Sarabun'] rounded-md hover:cursor-not-allowed"
                      value={item?.data?.name}
                      placeholder="ชื่อประเภทสิ่งของ"
                      disabled
                    />
                  </label>
                </div>
                <div className="flex place-items-center place-content-center mt-10">
                  <label className="w-1/2 ml-20 mr-5 flex flex-col">
                    <h4 className="text-xl text-black font-normal font-['Sarabun']">
                      จำนวน<span className="text-red-600">&nbsp;*</span>
                    </h4>
                    <input
                      type="number"
                      className="h-[50px] border border-black px-3 text-black text-2xl font-normal font-['Sarabun'] rounded-md"
                      placeholder="จำนวน"
                      onChange={(e) => setAmount(e.target.value)}
                    />
                  </label>
                  <SubmitButton text="บันทึก" onClick={createPicknpay} />
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
