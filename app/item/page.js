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

export default function Item() {
  const session = useSession();
  const role = session?.data?.data?.role;
  const [item, setItem] = useState([]);
  const [itemPage, setItemPage] = useState(1);
  const [like, setLike] = useState("");

  const [itemWaiting, setItemWaiting] = useState([]);
  const [likeWaiting, setLikeWaiting] = useState("");

  useEffect(() => {
    if (session?.status === "authenticated") {
      if (
        role[0] !== "m" &&
        role[1] !== "s" &&
        role[3] !== "w" &&
        role[5] !== "f"
      )
        redirect("/");
    } else if (session?.status === "unauthenticated") {
      redirect("/");
    }
    refreshData();
    refreshWaitingData();
  }, [session, role]);

  useEffect(() => {
    refreshData();
  }, [itemPage, like]);

  useEffect(() => {
    refreshWaitingData();
  }, [likeWaiting]);

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

  const fetchItemWaitingData = async () => {
    const res = await fetch(
      process.env.NEXT_PUBLIC_API_URL + `items/waiting?like=${likeWaiting}`,
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

  const refreshWaitingData = async () => {
    const itemWaitingData = await fetchItemWaitingData();
    setItemWaiting(itemWaitingData);
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

  return (
    <>
      <div className="flex w-screen h-screen scroll-smooth">
        <SideBar className="flex w-auto h-auto" />
        <div className="flex flex-col w-full h-full">
          <Breadcrumb className="w-auto h-auto" />
          <div className="flex flex-col bg-white w-full h-full overflow-y-auto whitespace-nowrap place-items-center pt-[20px] scroll">
            <div className="flex flex-row w-full place-content-between place-items-center">
              <h2 className="ml-20 text-black text-2xl font-bold font-['Sarabun']">
                รายการสิ่งของ
              </h2>
              <div className="pr-20">
                {role &&
                  (role[0] === "m" || role[1] === "s" || role[3] === "w") && (
                    <Link href="/item/picknpay" className="pr-2">
                      <SubmitButton text="เบิก/จ่ายสินค้า" />
                    </Link>
                  )}
                {role && (role[0] === "m" || role[1] === "s") && (
                  <>
                    <Link href="/item/order" className="pr-2">
                      <SubmitButton text="สั่งซื้อสินค้า" />
                    </Link>
                    <Link href="/item/add" className="">
                      <SubmitButton text="เพิ่มสินค้าเข้าระบบ" />
                    </Link>
                  </>
                )}
              </div>
            </div>
            <div className="flex flex-col w-full mt-[50px]">
              <div className="flex flex-row w-full place-items-center">
                <h2 className="ml-40 text-black text-xl font-normal font-['Sarabun']">
                  รายการสิ่งของในระบบ
                </h2>
                <input
                  className="h-[50px] w-[700px] border border-black mt-1 ml-10 px-3 text-2xl font-normal font-['Sarabun'] rounded-md text-black"
                  type="text"
                  placeholder="ค้นหาจากชื่อสินค้า หรือวัตถุดิบ"
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
                          href={`/item/info/${data.ID}`}
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
                            await refreshWaitingData();
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

              <div className="flex flex-row w-full place-items-center mt-10">
                <h2 className="ml-40 text-black text-xl font-normal font-['Sarabun']">
                  รายการสิ่งของที่รอการผลิต
                </h2>
                <input
                  className="h-[50px] w-[700px] border border-black mt-1 ml-10 px-3 text-2xl font-normal font-['Sarabun'] rounded-md text-black"
                  type="text"
                  placeholder="ค้นหาจากชื่อสินค้า หรือวัตถุดิบ"
                  onChange={(e) => setLikeWaiting(e.target.value)}
                />
              </div>
              <div className="ml-10 mr-20 mt-10 flex flex-col place-content-center place-items-center border border-[#cecece] rounded-xl">
                <div className="w-[95%] h-auto my-[20px] flex flex-col">
                  <div className="w-full h-auto flex flex-wrap place-content-start">
                    {itemWaiting?.data?.map((data) => {
                      return (
                        <ItemBox
                          key={data.item_ID}
                          ID={data.item_ID}
                          href={`/item/info/${data.item_ID}`}
                          text={data.item_name}
                          costPrice={data.item_costPrice}
                          salePrice={data.item_salePrice}
                          amount={data.item_amount}
                          options
                          isFavourite={data.item_isFavourite}
                          favourite={async () => {
                            await fetch(
                              process.env.NEXT_PUBLIC_API_URL +
                                `items/favourite/${data.item_ID}`,
                              { method: "PATCH" }
                            );
                            await refreshData();
                            await refreshWaitingData();
                          }}
                        />
                      );
                    })}
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
