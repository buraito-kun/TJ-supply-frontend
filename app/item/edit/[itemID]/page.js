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

export default function EditItem({ params }) {
  const session = useSession();
  const router = useRouter();
  const role = session?.data?.data?.role;
  const [costPrice, setCostPrice] = useState(0);
  const [salePrice, setSalePrice] = useState(0);
  const [insurance, setInsurance] = useState(0);
  const [favourite, setFavourite] = useState(false);
  const [amount, setAmount] = useState(0);
  const [detail, setDetail] = useState("");

  const [items, setItems] = useState([]);

  const roles = [
    { value: "manager", label: "ผู้ดูแลระบบ" },
    { value: "storager", label: "ผู้ดูแลคลัง" },
    { value: "tester", label: "ผู้ทดสอบ" },
    { value: "worker", label: "แรงงาน" },
  ];

  useEffect(() => {
    if (session?.status === "authenticated") {
      if (role[0] !== "m" && role[1] !== "s") redirect("/");
    } else if (session?.status === "unauthenticated") {
      redirect("/");
    }
    fetchData();
    setFavourite(items?.data?.isFavourite);
  }, [session, role]);

  const updateItem = async () => {
    if (true) {
      const res = await fetch(
        process.env.NEXT_PUBLIC_API_URL + `items/${params.itemID}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            costPrice: Number(costPrice),
            salePrice: Number(salePrice),
            insurancePeriod: Number(insurance),
            isFavourite: favourite,
            amount: Number(amount),
            detail: detail,
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
    const data = await fetchItemData();
    setItems(data);
  };

  const fetchItemData = async () => {
    const res = await fetch(
      process.env.NEXT_PUBLIC_API_URL + `items/${params.itemID}`,
      { method: "GET" }
    );
    if (!res.ok) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Something went wrong!",
        footer: '<a href="#">Why do I have this issue?</a>',
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
                <Link href="/item" className="ml-20">
                  <BackButton text="ย้อนกลับ" />
                </Link>
                <h2 className="ml-20 text-black text-2xl font-bold font-['Sarabun']">
                  แก้ไขสินค้า หรือวัตถุดิบเข้าระบบ
                </h2>
              </div>
              <div className="flex w-full place-content-end mr-20">
                <SubmitButton text="บันทึกการแก้ไข" onClick={updateItem} />
              </div>
            </div>
            <div className="bg-white w-full h-full flex flex-col place-items-center place-content-center">
              <div className="w-[1000px] h-[650px] flex flex-col place-items-center place-content-between border-black border-2 rounded-[15px]">
                <div className="mx-10 my-10 w-[90%] h-[90%] flex flex-col text-black text-xl font-['Sarabun']">
                  <div className="w-full h-[200px] flex">
                    <div className="w-3/4 h-full flex">
                      <label className="w-[100%]">
                        <h4 className="text-xl font-normal font-['Sarabun']">
                          ประเภทสิ่งของ
                        </h4>
                        <input
                          className="h-[50px] w-full pl-5 border border-black mt-1 text-2xl font-normal font-['Sarabun'] rounded-md flex place-items-center place-content-start hover:cursor-not-allowed"
                          type="text"
                          value={items?.data?.itemType.name}
                          disabled
                        />
                      </label>
                    </div>
                    <div className="w-[5%] h-full"></div>
                  </div>
                  <div className="w-full h-[200px] flex">
                    <label className="w-[100%]">
                      <h4 className="text-xl font-normal font-['Sarabun']">
                        ชื่อสินค้า หรือวัตถุดิบ
                      </h4>
                      <input
                        className="h-[50px] w-full border border-black mt-1 px-3 text-2xl font-normal font-['Sarabun'] rounded-md flex place-items-center place-content-start hover:cursor-not-allowed"
                        type="text"
                        value={items?.data?.name}
                        disabled
                      />
                    </label>
                  </div>
                  <div className="w-full h-[200px] flex">
                    <div className="w-1/2 h-full flex">
                      <label className="w-[100%]">
                        <h4 className="text-xl font-normal font-['Sarabun']">
                          ราคาต้นทุนต่อหน่วย
                        </h4>
                        <input
                          className="h-[50px] w-full border border-black mt-1 px-3 text-2xl font-normal font-['Sarabun'] rounded-md"
                          type="number"
                          min={0}
                          defaultValue={items?.data?.costPrice}
                          onChange={(e) => setCostPrice(e.target.value)}
                          required
                        />
                      </label>
                    </div>
                    <div className="w-[5%] h-full"></div>
                    <div className="w-1/2 h-full flex">
                      <label className="w-[100%]">
                        <h4 className="text-xl font-normal font-['Sarabun']">
                          ราคาขายต่อหน่วย
                        </h4>
                        <input
                          className="h-[50px] w-full border border-black mt-1 px-3 text-2xl font-normal font-['Sarabun'] rounded-md"
                          type="number"
                          min={0}
                          defaultValue={items?.data?.salePrice}
                          onChange={(e) => setSalePrice(e.target.value)}
                          required
                        />
                      </label>
                    </div>
                  </div>
                  <div className="w-full h-[200px] flex">
                    <div className="w-2/4 h-full flex">
                      <label className="w-[100%]">
                        <h4 className="text-xl font-normal font-['Sarabun']">
                          ระยะเวลาประกันสินค้า/วัตถุดิบ (เดือน)
                        </h4>
                        <input
                          className="h-[50px] w-full border border-black mt-1 px-3 text-2xl font-normal font-['Sarabun'] rounded-md"
                          type="number"
                          min={0}
                          defaultValue={items?.data?.insurancePeriod}
                          onChange={(e) => setInsurance(e.target.value)}
                          required
                        />
                      </label>
                    </div>
                    <div className="w-[5%] h-full"></div>
                    <div className="w-1/4 h-full flex">
                      <label className="w-[100%]">
                        <h4 className="text-xl font-normal font-['Sarabun']">
                          จำนวน
                        </h4>
                        <input
                          className="h-[50px] w-full border border-black mt-1 px-3 text-2xl font-normal font-['Sarabun'] rounded-md"
                          type="number"
                          min={0}
                          defaultValue={items?.data?.amount}
                          onChange={(e) => setAmount(e.target.value)}
                          required
                        />
                      </label>
                    </div>
                    <div className="w-[5%] h-full"></div>
                    <div className="w-1/4 h-full flex place-items-center place-content-center">
                      <label className="flex place-items-center place-content-center">
                        {items?.data &&
                          [1].map(() => {
                            return (
                              <input
                                key="1"
                                className="w-5 h-5 border border-black mt-1 px-3 text-2xl font-normal font-['Sarabun'] rounded-md"
                                type="checkbox"
                                defaultChecked={items?.data?.isFavourite}
                                onClick={(e) => setFavourite(e.target.checked)}
                                required
                              />
                            );
                          })}
                        <h4 className="text-xl font-normal font-['Sarabun'] ml-5">
                          รายการโปรด
                        </h4>
                      </label>
                    </div>
                  </div>
                  <div className="w-full h-full flex">
                    <div className="w-full h-full">
                      <label className="w-auto h-auto">
                        <h4 className="text-xl font-normal font-['Sarabun']">
                          รายละเอียด
                        </h4>
                        <textarea
                          className="bg-white border border-black w-full h-[150px] min-h-[50px] max-h-[150px] rounded-lg text-2xl font-normal font-['Sarabun'] px-2 py-2"
                          maxLength={200}
                          defaultValue={items?.data?.detail}
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
