"use client";

import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import SideBar from "@/components/Sidebar";
import { redirect } from "next/navigation";
import Breadcrumb from "@/components/Breadcrumb";
import Footer from "@/components/Footer";
import Link from "next/link";
import SubmitButton from "@/components/SubmitButton";
import ItemBox from "@/components/ItemBox";
import Pagination from "@/components/Pagination";
import BackButton from "@/components/BackButton";
import Swal from "sweetalert2";
import Translator from "@/translator";

export default function Picknpay() {
  const session = useSession();
  const role = session?.data?.data?.role;
  const [item, setItem] = useState([]);
  const [itemPage, setItemPage] = useState(1);
  const [like, setLike] = useState("");

  const [picknpayReq, setPicknpayReq] = useState([]);
  const [picknpayReqPage, setPicknpayReqPage] = useState(1);
  const [picknpayFin, setPicknpayFin] = useState([]);
  const [picknpayFinPage, setPicknpayFinPage] = useState(1);

  useEffect(() => {
    if (session?.status === "authenticated") {
      if (role[0] !== "m" && role[1] !== "s" && role[3] !== "w") redirect("/");
    } else if (session?.status === "unauthenticated") {
      redirect("/");
    }
    refreshData();
    refreshPicknpayReqData();
    refreshPicknpayFinData();
  }, [session, role]);

  useEffect(() => {
    refreshData();
  }, [itemPage, like]);

  useEffect(() => {
    refreshPicknpayReqData();
  }, [picknpayReqPage]);

  useEffect(() => {
    refreshPicknpayFinData();
  }, [picknpayFinPage]);

  const fetchItemData = async () => {
    const res = await fetch(
      process.env.NEXT_PUBLIC_API_URL +
        `items?limit=12&page=${itemPage}&like=${like}`,
      { method: "GET" }
    );
    if (!res.ok) {
      throw new Error("Failed to fetch data");
    }
    return await res.json();
  };

  const fetchPicknpayReqData = async () => {
    const res = await fetch(
      process.env.NEXT_PUBLIC_API_URL +
        `item/picknpay/${
          role && (role[0] !== "m" || role[1] !== "s") && role[3] === "w"
            ? session?.data?.data?.ID
            : ""
        }?limit=5&page=${picknpayReqPage}&type=req`,
      { method: "GET" }
    );
    if (!res.ok) {
      throw new Error("Failed to fetch data");
    }
    return await res.json();
  };

  const fetchPicknpayFinData = async () => {
    const res = await fetch(
      process.env.NEXT_PUBLIC_API_URL +
        `item/picknpay/${
          role && (role[0] !== "m" || role[1] !== "s") && role[3] === "w"
            ? session?.data?.data?.ID
            : ""
        }?limit=5&page=${picknpayFinPage}&type=fin`,
      { method: "GET" }
    );
    if (!res.ok) {
      throw new Error("Failed to fetch data");
    }
    return await res.json();
  };

  const refreshData = async () => {
    const itemData = await fetchItemData();
    setItem(itemData);
  };

  const refreshPicknpayReqData = async () => {
    const picknpayReqData = await fetchPicknpayReqData();
    setPicknpayReq(picknpayReqData);
  };

  const refreshPicknpayFinData = async () => {
    const picknpayFinData = await fetchPicknpayFinData();
    setPicknpayFin(picknpayFinData);
  };

  const increaseItemPage = () => {
    setItemPage(itemPage >= item.allPage ? item.allPage : itemPage + 1);
  };
  const decreaseItemPage = () => {
    setItemPage(itemPage <= 1 ? 1 : itemPage - 1);
  };
  const firstItemPage = () => {
    setItemPage(1);
  };
  const lastItemPage = () => {
    setItemPage(item.allPage);
  };

  const increasePicknpayReqPage = () => {
    setPicknpayReqPage(
      picknpayReqPage >= picknpayReq.allPage
        ? picknpayReq.allPage
        : picknpayReqPage + 1
    );
  };
  const decreasePicknpayReqPage = () => {
    setPicknpayReqPage(picknpayReqPage <= 1 ? 1 : picknpayReqPage - 1);
  };
  const firstPicknpayReqPage = () => {
    setPicknpayReqPage(1);
  };
  const lastPicknpayReqPage = () => {
    setPicknpayReqPage(picknpayReq.allPage);
  };

  const increasePicknpayFinPage = () => {
    setPicknpayFinPage(
      picknpayFinPage >= picknpayFin.allPage
        ? picknpayFin.allPage
        : picknpayFinPage + 1
    );
  };
  const decreasePicknpayFinPage = () => {
    setPicknpayFinPage(picknpayFinPage <= 1 ? 1 : picknpayFinPage - 1);
  };
  const firstPicknpayFinPage = () => {
    setPicknpayFinPage(1);
  };
  const lastPicknpayFinPage = () => {
    setPicknpayFinPage(picknpayFin.allPage);
  };

  return (
    <>
      <div className="flex w-screen h-screen scroll-smooth">
        <SideBar className="flex w-auto h-auto" />
        <div className="flex flex-col w-full h-full">
          <Breadcrumb className="w-auto h-auto" />
          <div className="flex flex-col bg-white w-full h-full overflow-y-auto whitespace-nowrap place-items-center pt-[20px]">
            <div className="flex flex-row w-full place-content-between place-items-center">
              <div className="flex flex-row w-full place-content-start place-items-center">
                <Link href="/item" className="ml-20">
                  <BackButton text="ย้อนกลับ" />
                </Link>
                <h2 className="ml-20 text-black text-2xl font-bold font-['Sarabun']">
                  เบิก/จ่ายวัตถุดิบ
                </h2>
              </div>
              {role && (role[0] === "m" || role[1] === "s") && (
                <div className="pr-20">
                  <Link href="/item/add" className="">
                    <SubmitButton text="เพิ่มสินค้าเข้าระบบ" />
                  </Link>
                </div>
              )}
            </div>
            <div className="flex flex-col w-full mt-[50px]">
              <div className="flex flex-row w-full place-items-center">
                <h2 className="ml-40 text-black text-xl font-normal font-['Sarabun']">
                  รายการวัตถุดิบในระบบ
                </h2>
                <input
                  className="h-[50px] w-[700px] border border-black mt-1 ml-10 px-3 text-2xl font-normal font-['Sarabun'] rounded-md text-black"
                  type="text"
                  placeholder="ค้นหาจากชื่อวัตถุดิบ"
                  onChange={(e) => setLike(e.target.value)}
                />
              </div>
              <div className="ml-10 mr-20 mt-10 flex flex-col place-content-center place-items-center border border-[#cecece] rounded-xl">
                <div className="w-[95%] h-auto my-[20px] flex flex-col">
                  <div className="w-full h-auto flex flex-wrap place-content-start">
                    {item?.data?.map((data) => {
                      return (
                        <ItemBox
                          key={data.ID}
                          ID={data.ID}
                          href={`/item/picknpay/${data.ID}`}
                          text={data.name}
                          costPrice={data.costPrice}
                          salePrice={data.salePrice}
                          amount={data.amount}
                          options
                          isFavourite={data.isFavourite}
                          favourite={async () => {
                            await fetch(
                              process.env.NEXT_PUBLIC_API_URL +
                                `items/favourite/${data.ID}`,
                              { method: "PATCH" }
                            );
                            await refreshData();
                          }}
                        />
                      );
                    })}
                  </div>
                </div>
              </div>
              <div className="flex place-content-center ml-10 mr-20">
                <Pagination
                  currentPage={itemPage}
                  allPage={item.allPage}
                  increase={increaseItemPage}
                  decrease={decreaseItemPage}
                  first={firstItemPage}
                  last={lastItemPage}
                />
              </div>
              {
                // request
              }
              <div className="flex flex-row w-full place-items-center">
                <h2 className="ml-40 text-black text-xl font-normal font-['Sarabun']">
                  คำขอการเบิกวัตถุดิบ
                </h2>
              </div>
              <div className="ml-10 mr-20 mt-10 flex flex-col place-content-center border border-[#cecece] rounded-xl">
                <div className="flex place-content-center">
                  <div className="w-[95%] my-[20px]">
                    <div className="text-black font-bold">
                      <div className="bg-[#6494d3] rounded-t-3xl flex flex-row h-10 place-items-center">
                        {role && (role[0] === "m" || role[1] === "s") ? (
                          <div className="w-4/12 text-center text-lg font-bold font-['Sarabun']">
                            ชื่อวัตถุดิบ
                          </div>
                        ) : (
                          <div className="w-6/12 text-center text-lg font-bold font-['Sarabun']">
                            ชื่อวัตถุดิบ
                          </div>
                        )}
                        <div className="w-3/12 text-center text-lg font-bold font-['Sarabun']">
                          ชื่อผู้ขอเบิกวัตถุดิบ
                        </div>
                        <div className="w-1/12 text-center text-lg font-bold font-['Sarabun']">
                          จำนวน
                        </div>
                        <div className="w-2/12 text-center text-lg font-bold font-['Sarabun']">
                          เวลา
                        </div>
                        {role && (role[0] === "m" || role[1] === "s") && (
                          <>
                            <div className="w-1/12 text-center text-lg font-bold font-['Sarabun']">
                              ยืนยัน
                            </div>
                            <div className="w-1/12 text-center text-lg font-bold font-['Sarabun']">
                              ปฏิเสธ
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                    <div className="text-black">
                      {picknpayReq?.data?.map((data) => {
                        return (
                          <div
                            key={data.ID}
                            className="flex flex-row w-full h-12 hover:bg-gray-200"
                          >
                            {role && (role[0] === "m" || role[1] === "s") ? (
                              <div className="w-4/12 text-start text-lg font-['Sarabun'] flex place-items-center place-content-start overflow-hidden">
                                {Translator.item.icon}
                                <h5 className="ml-1">{data.item.name}</h5>
                              </div>
                            ) : (
                              <div className="w-6/12 text-start text-lg font-['Sarabun'] flex place-items-center place-content-start overflow-hidden">
                                {Translator.item.icon}
                                <h5 className="ml-1">{data.item.name}</h5>
                              </div>
                            )}
                            <div className="w-3/12 text-center text-lg font-['Sarabun'] flex place-content-start place-items-center overflow-hidden">
                              <svg
                                className="ml-3"
                                width="30"
                                height="30"
                                viewBox="0 0 30 30"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  d="M15 25.8C11.25 25.8 7.935 23.88 6 21C6.045 18 12 16.35 15 16.35C18 16.35 23.955 18 24 21C23.0085 22.4768 21.669 23.6871 20.0995 24.5241C18.53 25.3612 16.7788 25.7993 15 25.8ZM15 4.5C16.1935 4.5 17.3381 4.97411 18.182 5.81802C19.0259 6.66193 19.5 7.80653 19.5 9C19.5 10.1935 19.0259 11.3381 18.182 12.182C17.3381 13.0259 16.1935 13.5 15 13.5C13.8065 13.5 12.6619 13.0259 11.818 12.182C10.9741 11.3381 10.5 10.1935 10.5 9C10.5 7.80653 10.9741 6.66193 11.818 5.81802C12.6619 4.97411 13.8065 4.5 15 4.5ZM15 0C13.0302 0 11.0796 0.387987 9.25975 1.14181C7.43986 1.89563 5.78628 3.00052 4.3934 4.3934C1.58035 7.20644 0 11.0218 0 15C0 18.9782 1.58035 22.7936 4.3934 25.6066C5.78628 26.9995 7.43986 28.1044 9.25975 28.8582C11.0796 29.612 13.0302 30 15 30C18.9782 30 22.7936 28.4196 25.6066 25.6066C28.4196 22.7936 30 18.9782 30 15C30 6.705 23.25 0 15 0Z"
                                  fill="#EE6C4D"
                                />
                              </svg>
                              <h5 className="ml-1">
                                {data.borrowBy.name +
                                  " " +
                                  data.borrowBy.surname}
                              </h5>
                            </div>
                            <div className="w-1/12 text-center text-lg font-['Sarabun'] flex place-content-center place-items-center">
                              {data.amount}
                            </div>
                            <div className="w-2/12 text-center text-lg font-['Sarabun'] flex place-content-center place-items-center">
                              {data.createdAt.split("T")[0] +
                                " " +
                                data.createdAt.split("T")[1]}
                            </div>
                            {role && (role[0] === "m" || role[1] === "s") && (
                              <>
                                <div className="w-1/12 text-center text-lg font-['Sarabun'] flex place-content-center place-items-center">
                                  <button
                                    onClick={async () => {
                                      const res = await fetch(
                                        process.env.NEXT_PUBLIC_API_URL +
                                          `item/picknpay`,
                                        {
                                          method: "PATCH",
                                          headers: {
                                            "Content-Type": "application/json",
                                          },
                                          body: JSON.stringify({
                                            picknpayID: data.ID,
                                            spendBy: session?.data?.data?.ID,
                                          }),
                                        }
                                      );
                                      if (!res.ok) {
                                        Swal.fire({
                                          icon: "error",
                                          title: "สินค้าไม่พอให้ยืม",
                                          text: " กรุณาเพิ่มสินค้าในคลัง หรือลบคำขอนี้",
                                        });
                                      }
                                      refreshData();
                                      refreshPicknpayReqData();
                                      refreshPicknpayFinData();
                                    }}
                                  >
                                    <svg
                                      width="30"
                                      height="30"
                                      viewBox="0 0 30 30"
                                      fill="none"
                                      xmlns="http://www.w3.org/2000/svg"
                                    >
                                      <path
                                        d="M27.8613 2.87109L29.6338 4.62891L10.0049 24.2725L0.366211 14.6338L2.13867 12.8613L10.0049 20.7275L27.8613 2.87109Z"
                                        stroke="#00CC00"
                                        strokeWidth="4"
                                        fill="#00CC00"
                                      />
                                    </svg>
                                  </button>
                                </div>
                                <div className="w-1/12 text-center text-lg font-['Sarabun'] flex place-content-center place-items-center">
                                  <button
                                    onClick={async () => {
                                      Swal.fire({
                                        title: `ลบคำขอเบิกสินค้า จริงหรือไม่`,
                                        text: "",
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
                                              `item/picknpay/${data.ID}`,
                                            { method: "DELETE" }
                                          );
                                          refreshData();
                                          refreshPicknpayReqData();
                                          refreshPicknpayFinData();
                                          Swal.fire({
                                            title: "ลบข้อมูลสำเร็จ",
                                            text: `ลบคำขอเบิกสินค้าสำเร็จ`,
                                            icon: "success",
                                          });
                                        }
                                      });
                                    }}
                                  >
                                    <svg
                                      width="30"
                                      height="30"
                                      viewBox="0 0 30 30"
                                      fill="none"
                                      xmlns="http://www.w3.org/2000/svg"
                                    >
                                      <path
                                        fill-rule="evenodd"
                                        clip-rule="evenodd"
                                        d="M15 5.25C12.4141 5.25 9.93419 6.27723 8.10571 8.10571C6.27723 9.93419 5.25 12.4141 5.25 15C5.25 17.5859 6.27723 20.0658 8.10571 21.8943C9.93419 23.7228 12.4141 24.75 15 24.75C17.5859 24.75 20.0658 23.7228 21.8943 21.8943C23.7228 20.0658 24.75 17.5859 24.75 15C24.75 12.4141 23.7228 9.93419 21.8943 8.10571C20.0658 6.27723 17.5859 5.25 15 5.25ZM3.75 15C3.75 12.0163 4.93526 9.15483 7.04505 7.04505C9.15483 4.93526 12.0163 3.75 15 3.75C17.9837 3.75 20.8452 4.93526 22.955 7.04505C25.0647 9.15483 26.25 12.0163 26.25 15C26.25 17.9837 25.0647 20.8452 22.955 22.955C20.8452 25.0647 17.9837 26.25 15 26.25C12.0163 26.25 9.15483 25.0647 7.04505 22.955C4.93526 20.8452 3.75 17.9837 3.75 15Z"
                                        stroke="#FF0000"
                                        strokeWidth="3"
                                        fill="#FF0000"
                                      />
                                      <path
                                        fill-rule="evenodd"
                                        clip-rule="evenodd"
                                        d="M22.956 7.04552C23.0966 7.18616 23.1756 7.37689 23.1756 7.57577C23.1756 7.77464 23.0966 7.96537 22.956 8.10602L8.10599 22.956C8.03681 23.0277 7.95405 23.0848 7.86255 23.1241C7.77104 23.1634 7.67263 23.1841 7.57305 23.185C7.47346 23.1858 7.3747 23.1668 7.28253 23.1291C7.19036 23.0914 7.10662 23.0357 7.0362 22.9653C6.96578 22.8949 6.91009 22.8112 6.87238 22.719C6.83467 22.6268 6.81569 22.5281 6.81656 22.4285C6.81742 22.3289 6.83811 22.2305 6.87742 22.139C6.91673 22.0475 6.97386 21.9647 7.04549 21.8955L21.8955 7.04552C22.0361 6.90491 22.2269 6.82593 22.4257 6.82593C22.6246 6.82593 22.8153 6.90491 22.956 7.04552Z"
                                        stroke="#FF0000"
                                        strokeWidth="3"
                                        fill="#FF0000"
                                      />
                                    </svg>
                                  </button>
                                </div>
                              </>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex place-content-center ml-10 mr-20">
                <Pagination
                  currentPage={picknpayReqPage}
                  allPage={picknpayReq.allPage}
                  increase={increasePicknpayReqPage}
                  decrease={decreasePicknpayReqPage}
                  first={firstPicknpayReqPage}
                  last={lastPicknpayReqPage}
                />
              </div>
              {
                // finished
              }
              <div className="flex flex-row w-full place-items-center">
                <h2 className="ml-40 text-black text-xl font-normal font-['Sarabun']">
                  ประวัติการเบิก/จ่ายวัตถุดิบที่สำเร็จ
                </h2>
              </div>
              <div className="ml-10 mr-20 mt-10 flex flex-col place-content-center border border-[#cecece] rounded-xl">
                <div className="flex place-content-center">
                  <div className="w-[95%] my-[20px]">
                    <div className="text-black font-bold">
                      <div className="bg-[#6494d3] rounded-t-3xl flex flex-row h-10 place-items-center">
                        <div className="w-3/12 text-center text-lg font-bold font-['Sarabun']">
                          ชื่อวัตถุดิบ
                        </div>
                        <div className="w-3/12 text-center text-lg font-bold font-['Sarabun']">
                          ชื่อผู้ขอเบิกวัตถุดิบ
                        </div>
                        <div className="w-3/12 text-center text-lg font-bold font-['Sarabun']">
                          ชื่อผู้จ่ายวัตถุดิบ
                        </div>
                        <div className="w-1/12 text-center text-lg font-bold font-['Sarabun']">
                          จำนวน
                        </div>
                        <div className="w-2/12 text-center text-lg font-bold font-['Sarabun']">
                          เวลา
                        </div>
                      </div>
                    </div>
                    <div className="text-black">
                      {picknpayFin?.data?.map((data) => {
                        return (
                          <div
                            key={data.ID}
                            className="flex flex-row w-full h-12 hover:bg-gray-200"
                          >
                            <div className="w-3/12 text-start text-lg font-['Sarabun'] flex place-items-center place-content-start overflow-hidden">
                              <svg
                                width="30"
                                height="30"
                                viewBox="0 0 30 30"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  fill-rule="evenodd"
                                  stroke="#EE6C4D"
                                  strokeWidth="1.5"
                                  clip-rule="evenodd"
                                  d="M15 1.5625C14.2437 1.5625 13.5475 1.75 12.7863 2.065C12.05 
                              2.37 11.195 2.81875 10.1312 3.3775L7.54625 4.73375C6.24 5.41875 5.19625 5.9675 4.3875 6.50625C3.5525 7.065 2.9075 7.6525 2.43875 8.44875C1.97125 
                              9.2425 1.76125 10.1025 1.66 11.1263C1.5625 12.12 1.5625 13.3412 1.5625 14.8787V15.1213C1.5625 16.6588 1.5625 17.88 1.66 18.8737C1.76125 19.8987 
                              1.9725 20.7575 2.43875 21.5512C2.9075 22.3475 3.55125 22.935 4.38875 23.4938C5.195 24.0325 6.24 24.5812 7.54625 25.2662L10.1312 26.6225C11.195 
                              27.1813 12.05 27.63 12.7863 27.935C13.5488 28.25 14.2437 28.4375 15 28.4375C15.7563 28.4375 16.4525 28.25 17.2137 27.935C17.95 27.63 18.805 
                              27.1813 19.8688 26.6225L22.4537 25.2675C23.76 24.5813 24.8038 24.0325 25.6113 23.4938C26.4488 22.935 27.0925 22.3475 27.5612 21.5512C28.0287 
                              20.7575 28.2388 19.8975 28.34 18.8737C28.4375 17.88 28.4375 16.6587 28.4375 15.1225V14.8775C28.4375 13.3413 28.4375 12.12 28.34 11.1263C28.2388 
                              10.1013 28.0275 9.2425 27.5612 8.44875C27.0925 7.6525 26.4488 7.065 25.6113 6.50625C24.805 5.9675 23.76 5.41875 22.4537 4.73375L19.8688 
                              3.3775C18.805 2.81875 17.95 2.37 17.2137 2.065C16.4512 1.75 15.7563 1.5625 15 1.5625ZM10.9625 5.0575C12.075 4.47375 12.855 4.06625 13.5025 
                              3.79875C14.1325 3.5375 14.5763 3.4375 15 3.4375C15.425 3.4375 15.8675 3.5375 16.4975 3.79875C17.145 4.06625 17.9238 4.47375 19.0363 5.0575L21.5363 
                              6.37C22.8988 7.08375 23.855 7.5875 24.5712 8.065C24.9237 8.30125 25.2 8.52 25.425 8.74L21.2613 10.8212L10.6362 5.22875L10.9625 5.0575ZM8.68125 
                              6.255L8.46375 6.37C7.10125 7.08375 6.145 7.5875 5.43 8.065C5.12514 8.2631 4.83933 8.48907 4.57625 8.74L15 13.9525L19.1963 11.8525L8.93875 
                              6.455C8.84255 6.40287 8.75556 6.33531 8.68125 6.255ZM3.6725 10.3838C3.61 10.6513 3.56125 10.955 3.52625 11.3087C3.43875 12.2012 3.4375 13.33 
                              3.4375 14.9262V15.0725C3.4375 16.67 3.4375 17.7987 3.52625 18.69C3.6125 19.5612 3.77625 20.125 4.055 20.6C4.3325 21.0712 4.73375 21.47 5.43 
                              21.935C6.145 22.4125 7.10125 22.9162 8.46375 23.63L10.9637 24.9425C12.0762 25.5263 12.855 25.9338 13.5025 26.2013C13.7058 26.2854 13.8925 
                              26.3542 14.0625 26.4075V15.5788L3.6725 10.3838ZM15.9375 26.4062C16.1075 26.3538 16.2942 26.2854 16.4975 26.2013C17.145 25.9338 17.9238 25.5263 
                              19.0363 24.9425L21.5363 23.63C22.8988 22.915 23.855 22.4125 24.5712 21.935C25.2662 21.47 25.6675 21.0712 25.9462 20.6C26.225 20.125 26.3875 
                              19.5625 26.4738 18.69C26.5613 17.7987 26.5625 16.67 26.5625 15.0738V14.9275C26.5625 13.33 26.5625 12.2013 26.4738 11.31C26.4443 10.9989 26.3955 
                              10.69 26.3275 10.385L22.1875 12.4538V16.25C22.1875 16.4986 22.0887 16.7371 21.9129 16.9129C21.7371 17.0887 21.4986 17.1875 21.25 17.1875C21.0014 
                              17.1875 20.7629 17.0887 20.5871 16.9129C20.4113 16.7371 20.3125 16.4986 20.3125 16.25V13.3925L15.9375 15.58V26.4062Z"
                                  fill="#EE6C4D"
                                />
                              </svg>
                              <h5 className="ml-1">{data.item.name}</h5>
                            </div>
                            <div className="w-3/12 text-center text-lg font-['Sarabun'] flex place-content-start place-items-center overflow-hidden">
                              <svg
                                className="ml-3"
                                width="30"
                                height="30"
                                viewBox="0 0 30 30"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  d="M15 25.8C11.25 25.8 7.935 23.88 6 21C6.045 18 12 16.35 15 16.35C18 16.35 23.955 18 24 21C23.0085 22.4768 21.669 23.6871 20.0995 24.5241C18.53 25.3612 16.7788 25.7993 15 25.8ZM15 4.5C16.1935 4.5 17.3381 4.97411 18.182 5.81802C19.0259 6.66193 19.5 7.80653 19.5 9C19.5 10.1935 19.0259 11.3381 18.182 12.182C17.3381 13.0259 16.1935 13.5 15 13.5C13.8065 13.5 12.6619 13.0259 11.818 12.182C10.9741 11.3381 10.5 10.1935 10.5 9C10.5 7.80653 10.9741 6.66193 11.818 5.81802C12.6619 4.97411 13.8065 4.5 15 4.5ZM15 0C13.0302 0 11.0796 0.387987 9.25975 1.14181C7.43986 1.89563 5.78628 3.00052 4.3934 4.3934C1.58035 7.20644 0 11.0218 0 15C0 18.9782 1.58035 22.7936 4.3934 25.6066C5.78628 26.9995 7.43986 28.1044 9.25975 28.8582C11.0796 29.612 13.0302 30 15 30C18.9782 30 22.7936 28.4196 25.6066 25.6066C28.4196 22.7936 30 18.9782 30 15C30 6.705 23.25 0 15 0Z"
                                  fill="#EE6C4D"
                                />
                              </svg>
                              <h5 className="ml-1">
                                {data.borrowBy.name +
                                  " " +
                                  data.borrowBy.surname}
                              </h5>
                            </div>
                            <div className="w-3/12 text-center text-lg font-['Sarabun'] flex place-content-start place-items-center overflow-hidden">
                              <svg
                                className="ml-3"
                                width="30"
                                height="30"
                                viewBox="0 0 30 30"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  d="M15 25.8C11.25 25.8 7.935 23.88 6 21C6.045 18 12 16.35 15 16.35C18 16.35 23.955 18 24 21C23.0085 22.4768 21.669 23.6871 20.0995 24.5241C18.53 25.3612 16.7788 25.7993 15 25.8ZM15 4.5C16.1935 4.5 17.3381 4.97411 18.182 5.81802C19.0259 6.66193 19.5 7.80653 19.5 9C19.5 10.1935 19.0259 11.3381 18.182 12.182C17.3381 13.0259 16.1935 13.5 15 13.5C13.8065 13.5 12.6619 13.0259 11.818 12.182C10.9741 11.3381 10.5 10.1935 10.5 9C10.5 7.80653 10.9741 6.66193 11.818 5.81802C12.6619 4.97411 13.8065 4.5 15 4.5ZM15 0C13.0302 0 11.0796 0.387987 9.25975 1.14181C7.43986 1.89563 5.78628 3.00052 4.3934 4.3934C1.58035 7.20644 0 11.0218 0 15C0 18.9782 1.58035 22.7936 4.3934 25.6066C5.78628 26.9995 7.43986 28.1044 9.25975 28.8582C11.0796 29.612 13.0302 30 15 30C18.9782 30 22.7936 28.4196 25.6066 25.6066C28.4196 22.7936 30 18.9782 30 15C30 6.705 23.25 0 15 0Z"
                                  fill="#EE6C4D"
                                />
                              </svg>
                              <h5 className="ml-1">
                                {data.spendBy.name + " " + data.spendBy.surname}
                              </h5>
                            </div>
                            <div className="w-1/12 text-center text-lg font-['Sarabun'] flex place-content-center place-items-center">
                              {data.amount}
                            </div>
                            <div className="w-2/12 text-center text-lg font-['Sarabun'] flex place-content-center place-items-center">
                              {data.createdAt.split("T")[0] +
                                " " +
                                data.createdAt.split("T")[1]}
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
                  currentPage={picknpayFinPage}
                  allPage={picknpayFin.allPage}
                  increase={increasePicknpayFinPage}
                  decrease={decreasePicknpayFinPage}
                  first={firstPicknpayFinPage}
                  last={lastPicknpayFinPage}
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
