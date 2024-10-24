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
import Translator from "@/translator";

export default function OrderItem() {
  const session = useSession();
  const role = session?.data?.data?.role;
  const [item, setItem] = useState([]);
  const [itemPage, setItemPage] = useState(1);
  const [like, setLike] = useState("");

  const [orderWaiting, setOrderWaiting] = useState([]);
  const [orderWaitingPage, setOrderWaitingPage] = useState(1);
  const [orderAllow, setOrderAllow] = useState([]);
  const [orderAllowPage, setOrderAllowPage] = useState(1);
  const [orderFinish, setOrderFinish] = useState([]);
  const [orderFinishPage, setOrderFinishPage] = useState(1);

  useEffect(() => {
    if (session?.status === "authenticated") {
      if (role[0] !== "m" && role[1] !== "s") redirect("/");
    } else if (session?.status === "unauthenticated") {
      redirect("/");
    }
    refreshData();
    refreshOrderWaitingData();
    refreshOrderAllowData();
    refreshOrderFinishData();
  }, [session, role]);

  useEffect(() => {
    refreshData();
  }, [itemPage, like]);

  useEffect(() => {
    refreshOrderWaitingData();
  }, [orderWaitingPage]);

  useEffect(() => {
    refreshOrderAllowData();
  }, [orderAllowPage]);

  useEffect(() => {
    refreshOrderFinishData();
  }, [orderFinishPage]);

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

  const fetchOrderWaitingData = async () => {
    const res = await fetch(
      process.env.NEXT_PUBLIC_API_URL +
        `item/wantBuy/waiting?limit=5&page=${orderWaitingPage}`,
      { method: "GET" }
    );
    if (!res.ok) {
      throw new Error("Failed to fetch data");
    }
    return await res.json();
  };

  const fetchOrderAllowData = async () => {
    const res = await fetch(
      process.env.NEXT_PUBLIC_API_URL +
        `item/wantBuy/allow?limit=5&page=${orderAllowPage}`,
      { method: "GET" }
    );
    if (!res.ok) {
      throw new Error("Failed to fetch data");
    }
    return await res.json();
  };

  const fetchOrderFinishData = async () => {
    const res = await fetch(
      process.env.NEXT_PUBLIC_API_URL +
        `item/wantBuy/done?limit=5&page=${orderFinishPage}`,
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

  const refreshOrderWaitingData = async () => {
    const orderWaitingData = await fetchOrderWaitingData();
    setOrderWaiting(orderWaitingData);
  };

  const refreshOrderAllowData = async () => {
    const orderAllowData = await fetchOrderAllowData();
    setOrderAllow(orderAllowData);
  };

  const refreshOrderFinishData = async () => {
    const orderFinishData = await fetchOrderFinishData();
    setOrderFinish(orderFinishData);
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

  const increaseOrderWaitingPage = () => {
    setOrderWaitingPage(
      orderWaitingPage >= orderWaiting.allPage
        ? orderWaiting.allPage
        : orderWaitingPage + 1
    );
  };
  const decreaseOrderWaitingPage = () => {
    setOrderWaitingPage(orderWaitingPage <= 1 ? 1 : orderWaitingPage - 1);
  };
  const firstOrderWaitingPage = () => {
    setOrderWaitingPage(1);
  };
  const lastOrderWaitingPage = () => {
    setOrderWaitingPage(orderWaiting.allPage);
  };

  const increaseOrderAllowPage = () => {
    setOrderAllowPage(
      orderAllowPage >= orderAllow.allPage
        ? orderAllow.allPage
        : orderAllowPage + 1
    );
  };
  const decreaseOrderAllowPage = () => {
    setOrderAllowPage(orderAllowPage <= 1 ? 1 : orderAllowPage - 1);
  };
  const firstOrderAllowPage = () => {
    setOrderAllowPage(1);
  };
  const lastOrderAllowPage = () => {
    setOrderAllowPage(orderAllow.allPage);
  };

  const increaseOrderFinishPage = () => {
    setOrderFinishPage(
      orderFinishPage >= orderFinish.allPage
        ? orderFinish.allPage
        : orderFinishPage + 1
    );
  };
  const decreaseOrderFinishPage = () => {
    setOrderFinishPage(orderFinishPage <= 1 ? 1 : orderFinishPage - 1);
  };
  const firstOrderFinishPage = () => {
    setOrderFinishPage(1);
  };
  const lastOrderFinishPage = () => {
    setOrderFinishPage(orderFinish.allPage);
  };

  return (
    <>
      <div className="flex w-screen h-screen scroll-smooth">
        <SideBar className="flex w-auto h-auto" />
        <div className="flex flex-col w-full h-full">
          <Breadcrumb className="w-auto h-auto" />
          <div className="flex flex-col bg-white w-full h-full overflow-y-auto whitespace-nowrap place-items-center pt-[20px] scroll">
            <div className="flex flex-row w-full place-content-between place-items-center">
              <div className="flex flex-row w-full place-content-start place-items-center">
                <Link href="/item" className="ml-20">
                  <BackButton text="ย้อนกลับ" />
                </Link>
                <h2 className="ml-20 text-black text-2xl font-bold font-['Sarabun']">
                  สั่งซื้อวัตถุดิบเข้าคลังสินค้า
                </h2>
              </div>
              <div className="pr-20">
                <Link href="/item/add" className="">
                  <SubmitButton text="เพิ่มสินค้าเข้าระบบ" />
                </Link>
              </div>
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
                          href={`/item/order/${data.ID}`}
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
                // Waiting
              }
              <div className="flex flex-row w-full place-items-center">
                <h2 className="ml-40 text-black text-xl font-normal font-['Sarabun']">
                  รอการอนุมัติ
                </h2>
              </div>
              <div className="ml-10 mr-20 mt-10 flex flex-col place-content-center border border-[#cecece] rounded-xl">
                <div className="flex place-content-center">
                  <div className="w-[95%] my-[20px]">
                    <div className="text-black font-bold">
                      <div className="bg-[#6494d3] rounded-t-3xl flex flex-row h-10 place-items-center">
                        <div className="w-4/12 text-center text-lg font-bold font-['Sarabun']">
                          ชื่อวัตถุดิบ
                        </div>
                        <div className="w-3/12 text-center text-lg font-bold font-['Sarabun']">
                          ชื่อผู้ขอซื้อ
                        </div>
                        <div className="w-1/12 text-center text-lg font-bold font-['Sarabun']">
                          จำนวน
                        </div>
                        <div className="w-1/12 text-center text-lg font-bold font-['Sarabun']">
                          ราคาต่อหน่วย
                        </div>
                        <div className="w-1/12 text-center text-lg font-bold font-['Sarabun']">
                          สถานะ
                        </div>
                        <div className="w-1/12 text-center text-lg font-bold font-['Sarabun']">
                          ยืนยัน
                        </div>
                        <div className="w-1/12 text-center text-lg font-bold font-['Sarabun']">
                          ปฏิเสธ
                        </div>
                      </div>
                    </div>
                    <div className="text-black">
                      {orderWaiting?.data?.map((data) => {
                        return (
                          <div
                            key={data.ID}
                            className="flex flex-row w-full h-12 hover:bg-gray-200"
                          >
                            <div className="w-4/12 text-start text-lg font-['Sarabun'] flex place-items-center place-content-start">
                              {Translator.item.icon}
                              <h5 className="ml-1">{data.item.name}</h5>
                            </div>
                            <div className="w-3/12 text-center text-lg font-['Sarabun'] flex place-content-start place-items-center">
                              {Translator.user.icon}
                              <h5 className="ml-1">
                                {data.buyBy.name + " " + data.buyBy.surname}
                              </h5>
                            </div>
                            <div className="w-1/12 text-center text-lg font-['Sarabun'] flex place-content-center place-items-center">
                              {data.amount}
                            </div>
                            <div className="w-1/12 text-center text-lg font-['Sarabun'] flex place-content-center place-items-center">
                              {data.costPerItem}
                            </div>
                            <div className="w-1/12 text-center text-lg font-['Sarabun'] flex place-content-center place-items-center">
                              <h3 className="text-[#ff6600] bg-[#ffea8f] w-10 text-sm rounded-xl">
                                รอ
                              </h3>
                            </div>
                            <div className="w-1/12 text-center text-lg font-['Sarabun'] flex place-content-center place-items-center">
                              <button
                                onClick={async () => {
                                  await fetch(
                                    process.env.NEXT_PUBLIC_API_URL +
                                      `item/wantBuy/${data.ID}?type=allow`,
                                    { method: "PATCH" }
                                  );
                                  refreshData();
                                  refreshOrderWaitingData();
                                  refreshOrderAllowData();
                                  refreshOrderFinishData();
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
                                  await fetch(
                                    process.env.NEXT_PUBLIC_API_URL +
                                      `item/wantBuy/${data.ID}`,
                                    { method: "DELETE" }
                                  );
                                  refreshData();
                                  refreshOrderWaitingData();
                                  refreshOrderAllowData();
                                  refreshOrderFinishData();
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
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex place-content-center ml-10 mr-20">
                <Pagination
                  currentPage={orderWaitingPage}
                  allPage={orderWaiting.allPage}
                  increase={increaseOrderWaitingPage}
                  decrease={decreaseOrderWaitingPage}
                  first={firstOrderWaitingPage}
                  last={lastOrderWaitingPage}
                />
              </div>
              {
                // allow
              }
              <div className="flex flex-row w-full place-items-center">
                <h2 className="ml-40 text-black text-xl font-normal font-['Sarabun']">
                  รอการยืนยันได้รับวัตถุดิบ
                </h2>
              </div>
              <div className="ml-10 mr-20 mt-10 flex flex-col place-content-center border border-[#cecece] rounded-xl">
                <div className="flex place-content-center">
                  <div className="w-[95%] my-[20px]">
                    <div className="text-black font-bold">
                      <div className="bg-[#6494d3] rounded-t-3xl flex flex-row h-10 place-items-center">
                        <div className="w-4/12 text-center text-lg font-bold font-['Sarabun']">
                          ชื่อวัตถุดิบ
                        </div>
                        <div className="w-3/12 text-center text-lg font-bold font-['Sarabun']">
                          ชื่อผู้ขอซื้อ
                        </div>
                        <div className="w-1/12 text-center text-lg font-bold font-['Sarabun']">
                          จำนวน
                        </div>
                        <div className="w-1/12 text-center text-lg font-bold font-['Sarabun']">
                          ราคาต่อหน่วย
                        </div>
                        <div className="w-1/12 text-center text-lg font-bold font-['Sarabun']">
                          สถานะ
                        </div>
                        <div className="w-2/12 text-center text-lg font-bold font-['Sarabun']">
                          ยืนยัน
                        </div>
                      </div>
                    </div>
                    <div className="text-black">
                      {orderAllow?.data?.map((data) => {
                        return (
                          <div
                            key={data.ID}
                            className="flex flex-row w-full h-12 hover:bg-gray-200"
                          >
                            <div className="w-4/12 text-start text-lg font-['Sarabun'] flex place-items-center place-content-start">
                              {Translator.item.icon}
                              <h5 className="ml-1">{data.item.name}</h5>
                            </div>
                            <div className="w-3/12 text-center text-lg font-['Sarabun'] flex place-content-start place-items-center">
                              {Translator.user.icon}
                              <h5 className="ml-1">
                                {data.buyBy.name + " " + data.buyBy.surname}
                              </h5>
                            </div>
                            <div className="w-1/12 text-center text-lg font-['Sarabun'] flex place-content-center place-items-center">
                              {data.amount}
                            </div>
                            <div className="w-1/12 text-center text-lg font-['Sarabun'] flex place-content-center place-items-center">
                              {data.costPerItem}
                            </div>
                            <div className="w-1/12 text-center text-lg font-['Sarabun'] flex place-content-center place-items-center">
                              <h3 className="text-[#0046D2] bg-[#87cbff] w-12 text-sm rounded-xl">
                                อนุมัติ
                              </h3>
                            </div>
                            <div className="w-2/12 text-center text-lg font-['Sarabun'] flex place-content-center place-items-center">
                              <button
                                onClick={async () => {
                                  await fetch(
                                    process.env.NEXT_PUBLIC_API_URL +
                                      `item/wantBuy/${data.ID}?type=finished`,
                                    { method: "PATCH" }
                                  );
                                  refreshData();
                                  refreshOrderWaitingData();
                                  refreshOrderAllowData();
                                  refreshOrderFinishData();
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
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex place-content-center ml-10 mr-20">
                <Pagination
                  currentPage={orderAllowPage}
                  allPage={orderAllow.allPage}
                  increase={increaseOrderAllowPage}
                  decrease={decreaseOrderAllowPage}
                  first={firstOrderAllowPage}
                  last={lastOrderAllowPage}
                />
              </div>
              {
                // denied and finished
              }
              <div className="flex flex-row w-full place-items-center">
                <h2 className="ml-40 text-black text-xl font-normal font-['Sarabun']">
                  ประวัติการสั่งซื้อวัตถุดิบ
                </h2>
              </div>
              <div className="ml-10 mr-20 mt-10 flex flex-col place-content-center border border-[#cecece] rounded-xl">
                <div className="flex place-content-center">
                  <div className="w-[95%] my-[20px]">
                    <div className="text-black font-bold">
                      <div className="bg-[#6494d3] rounded-t-3xl flex flex-row h-10 place-items-center">
                        <div className="w-4/12 text-center text-lg font-bold font-['Sarabun']">
                          ชื่อวัตถุดิบ
                        </div>
                        <div className="w-3/12 text-center text-lg font-bold font-['Sarabun']">
                          ชื่อผู้ขอซื้อ
                        </div>
                        <div className="w-1/12 text-center text-lg font-bold font-['Sarabun']">
                          จำนวน
                        </div>
                        <div className="w-1/12 text-center text-lg font-bold font-['Sarabun']">
                          ราคาต่อหน่วย
                        </div>
                        <div className="w-1/12 text-center text-lg font-bold font-['Sarabun']">
                          สถานะ
                        </div>
                        <div className="w-2/12 text-center text-lg font-bold font-['Sarabun']">
                          เวลา
                        </div>
                      </div>
                    </div>
                    <div className="text-black">
                      {orderFinish?.data?.map((data) => {
                        return (
                          <div
                            key={data.ID}
                            className="flex flex-row w-full h-12 hover:bg-gray-200"
                          >
                            <div className="w-4/12 text-start text-lg font-['Sarabun'] flex place-items-center place-content-start">
                              {Translator.item.icon}
                              <h5 className="ml-1">{data.item.name}</h5>
                            </div>
                            <div className="w-3/12 text-center text-lg font-['Sarabun'] flex place-content-start place-items-center">
                              {Translator.user.icon}
                              <h5 className="ml-1">
                                {data.buyBy.name + " " + data.buyBy.surname}
                              </h5>
                            </div>
                            <div className="w-1/12 text-center text-lg font-['Sarabun'] flex place-content-center place-items-center">
                              {data.amount}
                            </div>
                            <div className="w-1/12 text-center text-lg font-['Sarabun'] flex place-content-center place-items-center">
                              {data.costPerItem}
                            </div>
                            <div className="w-1/12 text-center text-lg font-['Sarabun'] flex place-content-center place-items-center">
                              {data.status === "finished" ? (
                                <h3 className="text-[#13A452] bg-[#adff9d] w-14 text-sm rounded-xl">
                                  สำเร็จ
                                </h3>
                              ) : (
                                <h3 className="text-[#ff0000] bg-[#ffa6a6] w-14 text-sm rounded-xl">
                                  ปฏิเสธ
                                </h3>
                              )}
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
                  currentPage={orderFinishPage}
                  allPage={orderFinish.allPage}
                  increase={increaseOrderFinishPage}
                  decrease={decreaseOrderFinishPage}
                  first={firstOrderFinishPage}
                  last={lastOrderFinishPage}
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
