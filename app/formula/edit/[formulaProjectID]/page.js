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

export default function EditFormula({ params }) {
  const session = useSession();
  const router = useRouter();
  const role = session?.data?.data?.role;

  const [itemsList, setItemsList] = useState([]);
  const [formulaData, setFormulaData] = useState([]);
  const [name, setName] = useState("");
  const [toItem, setToItem] = useState("");
  const [materials, setMaterials] = useState([]);
  const [costFormula, setCostFormula] = useState(0);
  const [detail, setDetail] = useState("");

  useEffect(() => {
    if (session?.status === "authenticated") {
      if (role[0] !== "m" && role[1] !== "s") redirect("/");
    } else if (session?.status === "unauthenticated") {
      redirect("/");
    }
    fetchData();
  }, [session, role]);

  const onAmountChange = (e, material) => {
    const temp = [...materials];
    const index = temp.indexOf(material);
    if (index === -1) return;
    temp[index].amount = e.target.value;
    setMaterials(temp);
  };

  const editFormulaData = async () => {
    if (name) {
      const res = await fetch(process.env.NEXT_PUBLIC_API_URL + `formula/${params.formulaProjectID}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name,
          costFormula: costFormula,
          detail: detail
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

  const fetchData = async () => {
    const itemsData = await fetchItemsList();
    const formulaData = await fetchFormulaData();
    setItemsList(itemsData);

    setFormulaData(formulaData);
    setName(formulaData?.data?.detail?.name);
    setToItem(formulaData?.data?.detail?.toItem.ID);
    setMaterials(formulaData?.data?.materials);
    setCostFormula(formulaData?.data?.detail?.costFormula);
    setDetail(formulaData?.data?.detail?.detail);
  };

  const fetchItemsList = async () => {
    const res = await fetch(
      process.env.NEXT_PUBLIC_API_URL + `items?limit=999999999&page=1`,
      { method: "GET" }
    );
    if (!res.ok) {
      throw new Error("Failed to fetch items list");
    }
    return await res.json();
  };

  const fetchFormulaData = async () => {
    const res = await fetch(
      process.env.NEXT_PUBLIC_API_URL + `formula/${params.formulaProjectID}`,
      { method: "GET" }
    );
    if (!res.ok) {
      throw new Error("Failed to fetch formula project detail");
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
                <Link href="/formula" className="ml-20">
                  <BackButton text="ย้อนกลับ" />
                </Link>
                <h2 className="ml-20 text-black text-2xl font-bold font-['Sarabun']">
                  แก้ไขสูตรการผลิต
                </h2>
              </div>
              <div className="flex w-full place-content-end mr-20">
                <SubmitButton text="บันทึก" onClick={editFormulaData} />
              </div>
            </div>
            <div className="bg-white w-full h-auto flex flex-col place-items-center place-content-center">
              <div className="w-[1000px] h-auto flex flex-col place-items-center place-content-between border-black border-2 rounded-[15px]">
                <div className="mx-10 my-10 w-[90%] h-auto flex flex-col text-black text-xl font-['Sarabun']">
                  <div className="w-full h-auto mb-5 flex text-black">
                    <label className="w-[100%]">
                      <h4 className="text-xl font-normal font-['Sarabun']">
                        ชื่อสูตรการผลิต
                        <span className="text-red-600">&nbsp;*</span>
                      </h4>
                      <input
                        className="h-[50px] w-full border border-black mt-1 px-3 text-2xl font-normal font-['Sarabun'] rounded-md"
                        type="text"
                        maxLength={100}
                        defaultValue={name}
                        placeholder="ชื่อสูตรการผลิต"
                        onChange={(e) => setName(e.target.value)}
                        required
                      />
                    </label>
                  </div>
                  <div className="w-full h-auto mb-5 flex text-black">
                    <div className="w-3/4 h-full flex">
                      <label className="w-[100%]">
                        <h4 className="text-xl font-normal font-['Sarabun']">
                          สินค้าที่จะผลิต
                          <span className="text-red-600">&nbsp;*</span>
                        </h4>
                        {formulaData?.data && (
                          <Select
                            closeMenuOnSelect={true}
                            defaultValue={{
                              value: formulaData?.data?.detail?.toItem?.ID,
                              label: formulaData?.data?.detail?.toItem?.name,
                            }}
                            options={itemsList?.data?.map((data) => ({
                              value: data.ID,
                              label: data.name,
                            }))}
                            onChange={(e) => setToItem(e.value)}
                            isDisabled
                          />
                        )}
                      </label>
                    </div>
                    <div className="w-[5%] h-full"></div>
                    <div className="w-1/4 h-full flex">
                      <label className="w-[100%]">
                        <h4 className="text-xl font-normal font-['Sarabun']">
                          ค่าใช้จ่ายเครื่องจักร
                          <span className="text-red-600">&nbsp;*</span>
                        </h4>
                        <input
                          className="h-[50px] w-full border border-black mt-1 px-3 text-2xl font-normal font-['Sarabun'] rounded-md"
                          type="number"
                          min={0}
                          value={costFormula}
                          onChange={(e) => setCostFormula(e.target.value)}
                          required
                        />
                      </label>
                    </div>
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
                          defaultValue={detail}
                          onChange={(e) => setDetail(e.target.value)}
                        ></textarea>
                      </label>
                    </div>
                  </div>
                  <div className="w-full h-auto mb-5 flex text-black">
                    <label className="w-[100%]">
                      <h4 className="text-xl font-normal font-['Sarabun']">
                        ส่วนประกอบ/วัตถุดิบ
                        <span className="text-red-600">&nbsp;*</span>
                      </h4>
                      {materials.length ? (
                        <Select
                          closeMenuOnSelect={false}
                          isMulti
                          defaultValue={materials?.map((data) => ({
                            value: data.item.ID,
                            label: data.item.name,
                          }))}
                          options={itemsList?.data?.map((data) => ({
                            value: data.ID,
                            label: data.name,
                            amount: 1,
                          }))}
                          onChange={(e) => setMaterials(e)}
                          isDisabled
                        />
                      ) : null}
                      {!materials.length ? (
                        <Select
                          closeMenuOnSelect={false}
                          isMulti
                          options={itemsList?.data?.map((data) => ({
                            value: data.ID,
                            label: data.name,
                            amount: 1,
                          }))}
                          onChange={(e) => setMaterials(e)}
                          isDisabled
                        />
                      ) : null}
                    </label>
                  </div>
                  <div className="w-full h-auto mb-5 flex flex-wrap place-content-between text-black">
                    {materials.length
                      ? materials?.map((data) => {
                          return (
                            <div
                              key={data.item.ID}
                              className="w-[48%] h-auto flex mt-3"
                            >
                              <label className="w-[100%]">
                                <h4 className="text-xl font-normal font-['Sarabun'] text-ellipsis overflow-hidden">
                                  {data.item.name}
                                  <span className="text-red-600">&nbsp;*</span>
                                </h4>
                                <input
                                  className="h-[50px] w-full border border-black mt-1 px-3 text-2xl font-normal font-['Sarabun'] rounded-md"
                                  type="number"
                                  min={1}
                                  defaultValue={data.amount}
                                  onChange={(e) => {
                                    onAmountChange(e, data);
                                  }}
                                  disabled
                                />
                              </label>
                            </div>
                          );
                        })
                      : null}
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
