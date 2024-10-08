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

export default function EditTestSetting({ params }) {
  const session = useSession();
  const router = useRouter();
  const role = session?.data?.data?.role;

  const [qcType, setQcType] = useState({ name: "", value: "" });
  const [qcClass, setQcClass] = useState("");
  const [qcScript, setQcScript] = useState({});
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

  const editTest = async () => {
    if (!name || !qcType.value) {
      Swal.fire({
        icon: "error",
        title: "กรอกข้อมูลไม่ครบ",
        text: "กรุณากรอกข้อมูลให้ครบตามช่องที่มี * สีแดง",
      });
    }

    if (qcType.name === "seaward") {
      var res = await fetch(
        process.env.NEXT_PUBLIC_API_URL + `qc/main/${params.qcMainID}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            testName: name,
            detail: detail,
            script: qcScript,
          }),
        }
      );
      var res = await fetch(
        process.env.NEXT_PUBLIC_API_URL + `qc/main/${params.qcMainID}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            testName: name,
            detail: detail,
            script: qcScript,
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
      // qc type other than seaward
      const res = await fetch(
        process.env.NEXT_PUBLIC_API_URL + `qc/main/${params.qcMainID}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            testName: name,
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
          router.back();
        }, 1500);
      }
    }
  };

  const fetchData = async () => {
    const qcMainData = await fetchQcMainData();
    setQcType(qcMainData.data.qcType);
    setName(qcMainData.data.testName);
    setDetail(qcMainData.data.detail);
    setQcScript(qcMainData.data.qcScript?.script);
  };

  const fetchQcMainData = async () => {
    const res = await fetch(
      process.env.NEXT_PUBLIC_API_URL + `qc/main/${params.qcMainID}`,
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
                <Link href="/qc/testSetting" className="ml-20">
                  <BackButton text="ย้อนกลับ" />
                </Link>
                <h2 className="ml-20 text-black text-2xl font-bold font-['Sarabun']">
                  แก้ไขข้อมูลการทดสอบ
                </h2>
              </div>
              <div className="flex w-full place-content-end mr-20">
                <SubmitButton text="บันทึก" onClick={editTest} />
              </div>
            </div>
            <div className="bg-white w-full h-auto flex flex-col place-items-center place-content-center">
              <div className="w-[1000px] h-auto flex flex-col place-items-center place-content-between border-black border-2 rounded-[15px]">
                <div className="mx-10 my-10 w-[90%] h-auto flex flex-col text-black text-xl font-['Sarabun']">
                  <div className="w-full h-auto flex">
                    <div className="w-full h-full flex">
                      <label className="w-[100%]">
                        <h4 className="text-xl font-normal font-['Sarabun']">
                          ประเภทการทดสอบ
                        </h4>
                        <select
                          className="h-[50px] w-full pl-5 border border-black mt-1 text-2xl font-normal font-['Sarabun'] rounded-md hover:cursor-not-allowed"
                          defaultValue={qcType?.name}
                          disabled
                        >
                          <option value={qcType?.name}>{qcType?.name}</option>
                        </select>
                      </label>
                    </div>
                  </div>
                  <div className="w-full h-auto my-2 flex text-black">
                    <label className="w-[100%]">
                      <h4 className="text-xl font-normal font-['Sarabun']">
                        ชื่อการทดสอบ
                        <span className="text-red-600">&nbsp;*</span>
                      </h4>
                      <input
                        className="h-[50px] w-full border border-black mt-1 px-3 text-2xl font-normal font-['Sarabun'] rounded-md"
                        type="text"
                        maxLength={100}
                        placeholder="ชื่อการทดสอบ"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                      />
                    </label>
                  </div>
                  <div className="w-full h-auto my-2 flex text-black">
                    <div className="w-full h-full">
                      <label className="w-auto h-auto">
                        <h4 className="text-xl font-normal font-['Sarabun']">
                          รายละเอียด
                        </h4>
                        <textarea
                          className="bg-white border border-black w-full h-[150px] min-h-[50px] max-h-[150px] rounded-lg text-2xl font-normal font-['Sarabun'] px-2 py-2"
                          maxLength={200}
                          value={detail}
                          onChange={(e) => setDetail(e.target.value)}
                        ></textarea>
                      </label>
                    </div>
                  </div>
                  {qcScript && (
                    <div className="w-full h-auto rounded-[15px] border border-black flex flex-col mb-5">
                      <div className="flex flex-wrap place-content-between">
                        <label className="w-[45%] h-auto mx-5 my-3 flex flex-col">
                          <h4 className="text-xl font-normal font-['Sarabun']">
                            Output
                            <span className="text-red-600">&nbsp;*</span>
                          </h4>
                          <input
                            className="h-[50px] w-full border border-black mt-1 px-3 text-2xl font-normal font-['Sarabun'] rounded-md"
                            type="number"
                            maxLength={50}
                            placeholder="Output"
                            value={qcScript.script_5}
                            onChange={(e) =>
                              setQcScript({
                                ...qcScript,
                                script_5: Number(e.target.value),
                              })
                            }
                            required
                          />
                        </label>
                        <label className="w-[45%] h-auto mx-5 my-3 flex flex-col">
                          <h4 className="text-xl font-normal font-['Sarabun']">
                            RampUp
                            <span className="text-red-600">&nbsp;*</span>
                          </h4>
                          <input
                            className="h-[50px] w-full border border-black mt-1 px-3 text-2xl font-normal font-['Sarabun'] rounded-md"
                            type="number"
                            maxLength={50}
                            placeholder="RampUp"
                            value={qcScript.script_6}
                            onChange={(e) =>
                              setQcScript({
                                ...qcScript,
                                script_6: Number(e.target.value),
                              })
                            }
                            required
                          />
                        </label>
                        <label className="w-[45%] h-auto mx-5 my-3 flex flex-col">
                          <h4 className="text-xl font-normal font-['Sarabun']">
                            Dwell
                            <span className="text-red-600">&nbsp;*</span>
                          </h4>
                          <input
                            className="h-[50px] w-full border border-black mt-1 px-3 text-2xl font-normal font-['Sarabun'] rounded-md"
                            type="number"
                            maxLength={50}
                            placeholder="Dwell"
                            value={qcScript.script_7}
                            onChange={(e) =>
                              setQcScript({
                                ...qcScript,
                                script_7: Number(e.target.value),
                              })
                            }
                            required
                          />
                        </label>
                        <label className="w-[45%] h-auto mx-5 my-3 flex flex-col">
                          <h4 className="text-xl font-normal font-['Sarabun']">
                            TimeToZero
                            <span className="text-red-600">&nbsp;*</span>
                          </h4>
                          <input
                            className="h-[50px] w-full border border-black mt-1 px-3 text-2xl font-normal font-['Sarabun'] rounded-md"
                            type="number"
                            maxLength={50}
                            placeholder="TimeToZero"
                            value={qcScript.script_8}
                            onChange={(e) =>
                              setQcScript({
                                ...qcScript,
                                script_8: Number(e.target.value),
                              })
                            }
                            required
                          />
                        </label>
                        <label className="w-[45%] h-auto mx-5 my-3 flex flex-col">
                          <h4 className="text-xl font-normal font-['Sarabun']">
                            LowLimit
                            <span className="text-red-600">&nbsp;*</span>
                          </h4>
                          <input
                            className="h-[50px] w-full border border-black mt-1 px-3 text-2xl font-normal font-['Sarabun'] rounded-md"
                            type="number"
                            maxLength={50}
                            placeholder="LowLimit"
                            value={qcScript.script_9}
                            onChange={(e) =>
                              setQcScript({
                                ...qcScript,
                                script_9: Number(e.target.value),
                              })
                            }
                            required
                          />
                        </label>
                        <label className="w-[45%] h-auto mx-5 my-3 flex flex-col">
                          <h4 className="text-xl font-normal font-['Sarabun']">
                            HighLimit
                            <span className="text-red-600">&nbsp;*</span>
                          </h4>
                          <input
                            className="h-[50px] w-full border border-black mt-1 px-3 text-2xl font-normal font-['Sarabun'] rounded-md"
                            type="number"
                            maxLength={50}
                            placeholder="HighLimit"
                            value={qcScript.script_10}
                            onChange={(e) =>
                              setQcScript({
                                ...qcScript,
                                script_10: Number(e.target.value),
                              })
                            }
                            required
                          />
                        </label>
                        <label className="w-[45%] h-auto mx-5 my-3 flex flex-col">
                          <h4 className="text-xl font-normal font-['Sarabun']">
                            ArcDetect
                            <span className="text-red-600">&nbsp;*</span>
                          </h4>
                          <input
                            className="h-[50px] w-full border border-black mt-1 px-3 text-2xl font-normal font-['Sarabun'] rounded-md"
                            type="number"
                            maxLength={50}
                            placeholder="ArcDetect"
                            value={qcScript.script_11}
                            onChange={(e) =>
                              setQcScript({
                                ...qcScript,
                                script_11: Number(e.target.value),
                              })
                            }
                            required
                          />
                        </label>
                        <label className="w-[45%] h-auto mx-5 my-3 flex flex-col">
                          <h4 className="text-xl font-normal font-['Sarabun']">
                            Channel
                            <span className="text-red-600">&nbsp;*</span>
                          </h4>
                          <input
                            className="h-[50px] w-full border border-black mt-1 px-3 text-2xl font-normal font-['Sarabun'] rounded-md"
                            type="number"
                            maxLength={50}
                            placeholder="Channel"
                            value={qcScript.script_12}
                            onChange={(e) =>
                              setQcScript({
                                ...qcScript,
                                script_12: Number(e.target.value),
                              })
                            }
                            required
                          />
                        </label>
                        {qcScript.script_1?.indexOf("PWRLK") !== -1 && (
                          <>
                            <label className="w-[45%] h-auto mx-5 my-3 flex flex-col">
                              <h4 className="text-xl font-normal font-['Sarabun']">
                                LeakageLowLimit
                                <span className="text-red-600">&nbsp;*</span>
                              </h4>
                              <input
                                className="h-[50px] w-full border border-black mt-1 px-3 text-2xl font-normal font-['Sarabun'] rounded-md"
                                type="number"
                                maxLength={50}
                                placeholder="LeakageLowLimit"
                                value={qcScript.script_13}
                                onChange={(e) =>
                                  setQcScript({
                                    ...qcScript,
                                    script_13: Number(e.target.value),
                                  })
                                }
                                required
                              />
                            </label>
                            <label className="w-[45%] h-auto mx-5 my-3 flex flex-col">
                              <h4 className="text-xl font-normal font-['Sarabun']">
                                PowerHighLimit
                                <span className="text-red-600">&nbsp;*</span>
                              </h4>
                              <input
                                className="h-[50px] w-full border border-black mt-1 px-3 text-2xl font-normal font-['Sarabun'] rounded-md"
                                type="number"
                                maxLength={50}
                                placeholder="PowerHighLimit"
                                value={qcScript.script_14}
                                onChange={(e) =>
                                  setQcScript({
                                    ...qcScript,
                                    script_14: Number(e.target.value),
                                  })
                                }
                                required
                              />
                            </label>
                            <label className="w-[45%] h-auto mx-5 my-3 flex flex-col">
                              <h4 className="text-xl font-normal font-['Sarabun']">
                                PowerLowLimit
                                <span className="text-red-600">&nbsp;*</span>
                              </h4>
                              <input
                                className="h-[50px] w-full border border-black mt-1 px-3 text-2xl font-normal font-['Sarabun'] rounded-md"
                                type="number"
                                maxLength={50}
                                placeholder="PowerLowLimit"
                                value={qcScript.script_15}
                                onChange={(e) =>
                                  setQcScript({
                                    ...qcScript,
                                    script_15: Number(e.target.value),
                                  })
                                }
                                required
                              />
                            </label>
                            <label className="w-[45%] h-auto mx-5 my-3 flex flex-col">
                              <h4 className="text-xl font-normal font-['Sarabun']">
                                LeakageHighLimit
                                <span className="text-red-600">&nbsp;*</span>
                              </h4>
                              <input
                                className="h-[50px] w-full border border-black mt-1 px-3 text-2xl font-normal font-['Sarabun'] rounded-md"
                                type="number"
                                maxLength={50}
                                placeholder="LeakageHighLimit"
                                value={qcScript.script_16}
                                onChange={(e) =>
                                  setQcScript({
                                    ...qcScript,
                                    script_16: Number(e.target.value),
                                  })
                                }
                                required
                              />
                            </label>
                          </>
                        )}
                      </div>
                    </div>
                  )}
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
