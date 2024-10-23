"use client";

import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import SideBar from "@/components/Sidebar";
import Breadcrumb from "@/components/Breadcrumb";
import { redirect } from "next/navigation";
import Footer from "@/components/Footer";
import SubmitButton from "@/components/SubmitButton";
import Pagination from "@/components/Pagination";
import Link from "next/link";
import Swal from "sweetalert2";
import BackButton from "@/components/BackButton";
import Translator from "@/translator";

export default function ItemType() {
  const session = useSession();
  const role = session?.data?.data?.role;
  const [itemType, setItemType] = useState([]);
  const [itemTypePage, setItemTypePage] = useState(1);
  const [itemTypeName, setItemTypeName] = useState("");

  useEffect(() => {
    if (session?.status === "authenticated") {
      if (role[0] !== "m" && role[1] !== "s") redirect("/");
    } else if (session?.status === "unauthenticated") {
      redirect("/");
    }
    refreshData();
  }, [session, role]);

  useEffect(() => {
    refreshData();
  }, [itemTypePage]);

  const fetchItemTypeData = async () => {
    const res = await fetch(
      process.env.NEXT_PUBLIC_API_URL +
        `item/type?limit=5&page=${itemTypePage}`,
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
    const itemTypeData = await fetchItemTypeData(itemTypePage);
    setItemType(itemTypeData);
  };

  const addItemType = async () => {
    if (itemTypeName) {
      const res = await fetch(process.env.NEXT_PUBLIC_API_URL + "item/type", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: itemTypeName }),
      });
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
        setItemTypeName("")
        refreshData();
      }
    } else {
      Swal.fire({
        icon: "error",
        title: "กรอกข้อมูลไม่ครบ",
        text: "กรุณากรอกข้อมูลให้ครบตามช่องที่มี * สีแดง",
      });
    }
  };

  const increaseItemTypePage = () => {
    setItemTypePage(
      itemTypePage >= itemType.allPage ? itemType.allPage : itemTypePage + 1
    );
  };
  const decreaseItemTypePage = () => {
    setItemTypePage(itemTypePage <= 1 ? 1 : itemTypePage - 1);
  };
  const firstItemTypePage = () => {
    setItemTypePage(1);
  };
  const lastItemTypePage = () => {
    setItemTypePage(itemType.allPage);
  };

  return (
    <>
      <div className="flex w-screen h-screen scroll-smooth">
        <SideBar className="flex w-auto h-auto" />
        <div className="flex flex-col w-full h-full">
          <Breadcrumb className="w-auto h-auto" />
          <div className="flex flex-col bg-white w-full h-full overflow-y-auto whitespace-nowrap place-items-center pt-[60px]">
            <div className="flex flex-row w-full place-items-center">
              <Link href="/item/add" className="ml-20">
                <BackButton text="ย้อนกลับ" />
              </Link>
              <h2 className="ml-20 text-black text-2xl font-bold font-['Sarabun']">
                ประเภทสิ่งของ
              </h2>
            </div>
            <div className="flex flex-col w-full mt-10">
              <div className="flex flex-row w-full place-items-center">
                <h2 className="ml-40 text-black text-xl font-normal font-['Sarabun']">
                  เพิ่มรายการประเภทสิ่งของ
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
                    placeholder="ชื่อประเภทสิ่งของ"
                    value={itemTypeName}
                    onChange={(e) => setItemTypeName(e.target.value)}
                  />
                </label>
                <SubmitButton text="บันทึก" onClick={addItemType} />
              </div>
              <div className="flex flex-row w-full place-items-center mt-10">
                <h2 className="ml-40 text-black text-xl font-normal font-['Sarabun']">
                  รายการประเภทสิ่งของ
                </h2>
              </div>
              <div className="ml-10 mr-20 mt-10 flex flex-col place-content-center border border-[#cecece] rounded-xl">
                <div className="flex place-content-center">
                  <div className="w-[95%] my-[20px]">
                    <div className="text-black font-bold">
                      <div className="bg-[#6494d3] rounded-t-3xl flex flex-row h-10 place-items-center">
                        <div className="w-6/12 text-center text-lg font-bold font-['Sarabun']">
                          ชื่อประเภทสิ่งของ
                        </div>
                        <div className="w-3/12 text-center text-lg font-bold font-['Sarabun']">
                          แก้ไข
                        </div>
                        <div className="w-3/12 text-center text-lg font-bold font-['Sarabun']">
                          ลบ
                        </div>
                      </div>
                    </div>
                    <div className="text-black">
                      {itemType?.data?.map((data) => {
                        return (
                          <div
                            key={data.ID}
                            className="flex flex-row w-full h-12 hover:bg-gray-200"
                          >
                            <div className="w-6/12 text-start text-lg font-['Sarabun'] flex place-items-center">
                              {Translator.type.icon}
                              <h5 className="ml-5">{data.name}</h5>
                            </div>
                            <div className="w-3/12 text-center text-lg font-['Sarabun'] flex place-content-center place-items-center">
                              <Link href={`/item/itemType/edit/${data.ID}`}>
                                {Translator.edit.icon}
                              </Link>
                            </div>
                            <div className="w-3/12 text-center text-lg font-['Sarabun'] flex place-content-center place-items-center">
                              <button
                                onClick={() => {
                                  Swal.fire({
                                    title: `ลบข้อมูล "${data.name}" จริงหรือไม่`,
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
                                          `item/type/${data.ID}`,
                                        { method: "DELETE" }
                                      );
                                      await refreshData();
                                      Swal.fire({
                                        title: "ลบข้อมูลสำเร็จ",
                                        text: `ข้อมูลเกี่ยวกับ "${data.name}" ถูกลบสำเร็จ`,
                                        icon: "success",
                                      });
                                    }
                                  });
                                }}
                              >
                                {Translator.delete.icon}
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
                  currentPage={itemTypePage}
                  allPage={itemType.allPage}
                  increase={increaseItemTypePage}
                  decrease={decreaseItemTypePage}
                  first={firstItemTypePage}
                  last={lastItemTypePage}
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
