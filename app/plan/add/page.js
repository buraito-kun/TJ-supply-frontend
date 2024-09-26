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
import CircleImageButton from "@/components/CircleImageButton";
import Translator from "@/translator";
import Select from "react-select";

export default function AddPlan() {
  const session = useSession();
  const router = useRouter();
  const role = session?.data?.data?.role;

  const [formulaProjectList, setFormulaProjectList] = useState([]);
  const [name, setName] = useState("");
  const [startDate, setStartDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [endDate, setEndDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [detail, setDetail] = useState("");
  const [lots, setLots] = useState([
    {
      id: 0,
      name: "",
      productionSub: [{ id: 0, formulaProject: "", amountRequire: 1 }],
    },
  ]);
  var [lotCount, setLotCount] = useState(1);
  var [formulaCount, setFormulaCount] = useState(1);
  var count = 0;

  useEffect(() => {
    if (session?.status === "authenticated") {
      if (role[0] !== "m" && role[1] !== "s") redirect("/");
    } else if (session?.status === "unauthenticated") {
      redirect("/");
    }
    fetchData();
  }, [session, role]);

  const addLot = () => {
    setLots([
      ...lots,
      {
        id: lotCount++,
        name: "",
        productionSub: [
          { id: formulaCount, formulaProject: "", amountRequire: 1 },
        ],
      },
    ]);
    setLotCount(lotCount + 1);
    setFormulaCount(formulaCount + 1);
  };

  const removeLot = (lot) => {
    const temp = lots.filter((data) => data.id !== lot.id);
    setLots(temp);
  };

  const onLotChange = (e, lot) => {
    const temp = [...lots];
    const index = temp.indexOf(lot);
    if (index === -1) return;
    temp[index].name = e.target.value;
    setLots(temp);
  };

  const onFormulaChange = (e, lot, sub) => {
    const temp = [...lots];
    const lotIndex = temp.indexOf(lot);
    if (lotIndex === -1) return;
    const formulaIndex = temp[lotIndex].productionSub.indexOf(sub);
    if (formulaIndex === -1) return;
    if (e?.label) {
      temp[lotIndex].productionSub[formulaIndex].formulaProject = e.value;
      temp[lotIndex].productionSub[formulaIndex].name = e.label;
    } else if (e?.target?.name === "amountRequire")
      temp[lotIndex].productionSub[formulaIndex].amountRequire = e.target.value;
    setLots(temp);
  };

  const addFormula = (lot) => {
    const temp = [...lots];
    const index = temp.indexOf(lot);
    if (index === -1) return;
    temp[index].productionSub.push({
      id: formulaCount,
      formulaProject: "",
      amountRequire: 1,
    });
    setLots(temp);
    setFormulaCount(formulaCount + 1);
  };

  const removeFormula = (lot, sub) => {
    const temp = [...lots];
    const lotIndex = temp.indexOf(lot);
    if (lotIndex === -1) return;
    const formulaIndex = temp[lotIndex].productionSub.indexOf(sub);
    if (formulaIndex === -1) return;
    temp[lotIndex].productionSub.splice(formulaIndex, 1);
    setLots(temp);
  };

  const createNewPlan = async () => {
    const temp = [...lots];
    temp.forEach((lot) => {
      lot.productionSub.forEach((sub) => {
        sub.amountRequire = Number(sub.amountRequire);
      });
    });
    if (!(!name || !startDate || !endDate || !lots)) {
      const res = await fetch(process.env.NEXT_PUBLIC_API_URL + "plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          planName: name,
          startDate: startDate,
          endDate: endDate,
          detail: detail,
          productionLot: temp,
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
    const formulaData = await fetchFormulaProjectList();
    setFormulaProjectList(formulaData);
  };

  const fetchFormulaProjectList = async () => {
    const res = await fetch(
      process.env.NEXT_PUBLIC_API_URL + `formula?limit=9999999&page=1`,
      { method: "GET" }
    );
    if (!res.ok) {
      throw new Error("Failed to fetch formula project list");
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
                <Link href="/plan" className="ml-20">
                  <BackButton text="ย้อนกลับ" />
                </Link>
                <h2 className="ml-20 text-black text-2xl font-bold font-['Sarabun']">
                  เพิ่มแผนการผลิต
                </h2>
              </div>
              <div className="flex w-full place-content-end mr-20">
                <SubmitButton text="สร้าง" onClick={createNewPlan} />
              </div>
            </div>
            <div className="bg-white w-full h-auto flex flex-col place-items-center place-content-center">
              <div className="w-[1000px] h-auto flex flex-col place-items-center place-content-between border-black border-2 rounded-[15px]">
                <div className="mx-10 my-10 w-[90%] h-auto flex flex-col text-black text-xl font-['Sarabun']">
                  <div className="w-full h-auto mb-5 flex text-black">
                    <label className="w-[100%]">
                      <h4 className="text-xl font-normal font-['Sarabun']">
                        ชื่อแผนการผลิต
                        <span className="text-red-600">&nbsp;*</span>
                      </h4>
                      <input
                        className="h-[50px] w-full border border-black mt-1 px-3 text-2xl font-normal font-['Sarabun'] rounded-md"
                        type="text"
                        maxLength={100}
                        placeholder="ชื่อแผนการผลิต"
                        onChange={(e) => setName(e.target.value)}
                        required
                      />
                    </label>
                  </div>
                  <div className="w-full h-auto mb-5 flex text-black">
                    <div className="w-1/2 h-full flex">
                      <label className="w-[100%]">
                        <h4 className="text-xl font-normal font-['Sarabun']">
                          วันเริ่มต้น (เดือน/วัน/ปี)
                          <span className="text-red-600">&nbsp;*</span>
                        </h4>
                        <input
                          className="h-[50px] w-full border border-black mt-1 px-3 text-2xl font-normal font-['Sarabun'] rounded-md"
                          type="date"
                          min={startDate}
                          defaultValue={startDate}
                          onChange={(e) => setStartDate(e.target.value)}
                          required
                        />
                      </label>
                    </div>
                    <div className="w-[5%] h-full"></div>
                    <div className="w-1/2 h-full flex">
                      <label className="w-[100%]">
                        <h4 className="text-xl font-normal font-['Sarabun']">
                          วันสิ้นสุด (เดือน/วัน/ปี)
                          <span className="text-red-600">&nbsp;*</span>
                        </h4>
                        <input
                          className="h-[50px] w-full border border-black mt-1 px-3 text-2xl font-normal font-['Sarabun'] rounded-md"
                          type="date"
                          min={startDate}
                          defaultValue={startDate}
                          onChange={(e) => setEndDate(e.target.value)}
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
                          onChange={(e) => setDetail(e.target.value)}
                        ></textarea>
                      </label>
                    </div>
                  </div>
                  {lots.map((lot) => {
                    return (
                      <div
                        key={count++}
                        className="w-full h-auto rounded-[15px] border border-black flex flex-col mb-5"
                      >
                        <div className="flex">
                          <label className="w-full h-auto mx-5 my-5 flex flex-col">
                            <h4 className="text-xl font-normal font-['Sarabun']">
                              ชื่อล็อตการผลิต
                              <span className="text-red-600">&nbsp;*</span>
                            </h4>
                            <input
                              className="h-[50px] w-full border border-black mt-1 px-3 text-2xl font-normal font-['Sarabun'] rounded-md"
                              type="text"
                              value={lot.name}
                              maxLength={50}
                              placeholder="ชื่อล็อตการผลิต"
                              onChange={(e) => onLotChange(e, lot)}
                              required
                            />
                          </label>
                        </div>
                        <div className="flex">
                          <div className="h-auto w-full mx-5 flex place-items-center place-content-end">
                            {lots.length > 1 ? (
                              <button
                                className="scale-[125%] flex place-items-center place-content-center mr-10"
                                onClick={() => {
                                  removeLot(lot);
                                }}
                              >
                                {Translator.delete.icon}
                              </button>
                            ) : null}
                            <div className="scale-[75%]">
                              <CircleImageButton
                                onClick={() => {
                                  addFormula(lot);
                                }}
                              />
                            </div>
                          </div>
                        </div>
                        {lot.productionSub.map((sub) => {
                          return (
                            <div key={count++} className="flex">
                              <div className="w-full h-20 mx-5 mb-5 flex flex-row">
                                <label className="w-[70%]">
                                  <h4 className="text-xl font-normal font-['Sarabun']">
                                    สูตรการผลิต
                                    <span className="text-red-600">
                                      &nbsp;*
                                    </span>
                                  </h4>
                                  <Select
                                    name="formulaProject"
                                    closeMenuOnSelect={true}
                                    // isMulti
                                    defaultValue={{
                                      value: sub.formulaProject,
                                      label: sub.name,
                                    }}
                                    options={formulaProjectList?.data?.map(
                                      (data) => ({
                                        value: data.ID,
                                        label: data.name,
                                      })
                                    )}
                                    onChange={(e) =>
                                      onFormulaChange(e, lot, sub)
                                    }
                                  />
                                </label>
                                <div className="w-[5%]"></div>
                                <label className="w-[15%]">
                                  <h4 className="text-xl font-normal font-['Sarabun']">
                                    จำนวน
                                    <span className="text-red-600">
                                      &nbsp;*
                                    </span>
                                  </h4>
                                  <input
                                    className="h-[50px] w-full border border-black mt-1 px-3 text-2xl font-normal font-['Sarabun'] rounded-md"
                                    type="number"
                                    name="amountRequire"
                                    value={sub.amountRequire}
                                    min={1}
                                    onChange={(e) =>
                                      onFormulaChange(e, lot, sub)
                                    }
                                    placeholder="จำนวน"
                                    required
                                  />
                                </label>
                                <div className="w-[10%] h-full flex place-content-center place-items-end">
                                  {lot.productionSub.length > 1 ? (
                                    <button
                                      className="scale-[125%] mb-2"
                                      onClick={() => {
                                        removeFormula(lot, sub);
                                      }}
                                    >
                                      {Translator.delete.icon}
                                    </button>
                                  ) : null}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    );
                  })}
                  <div className="w-full flex place-content-end">
                    <button
                      className="bg-[#3D5A80] text-xl text-white font-normal font-['Sarabun'] h-8 w-40 rounded-xl"
                      onClick={addLot}
                    >
                      เพิ่มล็อตการผลิต
                    </button>
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
