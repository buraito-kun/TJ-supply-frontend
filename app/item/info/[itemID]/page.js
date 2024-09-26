"use client";

import SideBar from "@/components/Sidebar";
import Breadcrumb from "@/components/Breadcrumb";
import Footer from "@/components/Footer";
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { redirect } from "next/navigation";
import Link from "next/link";
import Pagination from "@/components/Pagination";
import BackButton from "@/components/BackButton";
import Translator from "@/translator";

export default function InfoItem({ params }) {
  const session = useSession();
  const role = session?.data?.data?.role;
  const [item, setItem] = useState([]);
  const [like, setLike] = useState("");
  const [itemPage, setItemPage] = useState(1);

  useEffect(() => {
    if (session?.status === "authenticated") {
    } else if (session?.status === "unauthenticated") {
      redirect("/");
    }
    fetchItemData();
  }, [session, role]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchItemData();
      setItem(data);
    };
    fetchData();
  }, [itemPage, like]);

  const increasePage = () => {
    setItemPage(itemPage >= item.allPage ? item.allPage : itemPage + 1);
  };
  const decreasePage = () => {
    setItemPage(itemPage <= 1 ? 1 : itemPage - 1);
  };
  const firstPage = () => {
    setItemPage(1);
  };
  const lastPage = () => {
    setItemPage(item.allPage);
  };

  const fetchItemData = async () => {
    const res = await fetch(
      process.env.NEXT_PUBLIC_API_URL +
        `items/construct/${params.itemID}?limit=50&page=${itemPage}&status=waiting&like=${like}`
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
          <div className="flex flex-col bg-white w-full h-full overflow-y-auto whitespace-nowrap place-items-center pt-[50px]">
            <div className="flex flex-row w-full place-items-center">
              <Link href="../" className="ml-20">
                <BackButton text="ย้อนกลับ" />
              </Link>
              <h2 className="ml-20 text-black text-2xl font-bold font-['Sarabun']">
                ประวัติของสิ่งของ
              </h2>
            </div>
            <div className="flex flex-row w-full place-items-center mt-10">
              <h2 className="ml-40 text-black text-xl font-normal font-['Sarabun']">
                รายการรหัสสินค้าหรือวัตถุดิบ
              </h2>
              <input
                className="h-[50px] w-[700px] border border-black mt-1 ml-10 px-3 text-2xl font-normal font-['Sarabun'] rounded-md text-black"
                type="number"
                placeholder="ค้นหาจากรหัสสินค้า หรือวัตถุดิบ"
                onChange={(e) => setLike(e.target.value)}
              />
            </div>
            <div className="flex flex-col w-full">
              <div className="ml-10 mr-20 mt-10 flex flex-col place-content-center border border-[#cecece] rounded-xl">
                <div className="flex place-content-center">
                  <div className="w-[95%] my-[20px]">
                    <div className="text-black font-bold">
                      <div className="bg-[#6494d3] rounded-t-3xl flex flex-row h-10 place-items-center">
                        <div className="w-2/12 text-center text-lg font-bold font-['Sarabun']">
                          รหัสสินค้า
                        </div>
                        <div className="w-2/12 text-center text-lg font-bold font-['Sarabun']">
                          ชื่อแผนการผลิต
                        </div>
                        <div className="w-4/12 text-center text-lg font-bold font-['Sarabun']">
                          ชื่อล็อตการผลิต
                        </div>
                        <div className="w-1/12 text-center text-lg font-bold font-['Sarabun']">
                          สถานะ
                        </div>
                        <div className="w-2/12 text-center text-lg font-bold font-['Sarabun']">
                          เวลา
                        </div>
                        <div className="w-1/12 text-center text-lg font-bold font-['Sarabun']">
                          การผลิต
                        </div>
                      </div>
                    </div>
                    <div className="text-black">
                      {item?.data?.map((data) => {
                        return (
                          <div
                            key={data.ID}
                            className="flex flex-row w-full h-12 hover:bg-gray-200"
                          >
                            <div className="w-2/12 text-start text-lg font-['Sarabun'] flex place-items-center">
                              {Translator.item.icon}
                              <h5 className="ml-1">{data.ID}</h5>
                            </div>
                            <div className="w-2/12 text-center text-lg font-['Sarabun'] flex place-content-center place-items-center overflow-hidden">
                              {
                                data.productionSub.productionLot.productionPlan
                                  .planName
                              }
                            </div>
                            <div className="w-4/12 text-center text-lg font-['Sarabun'] flex place-content-start place-items-center overflow-hidden">
                              {data.productionSub.productionLot.name}
                            </div>
                            <div className="w-1/12 text-center text-lg font-['Sarabun'] flex place-content-center place-items-center">
                              {data.status === "finish" ? (
                                <h3 className="text-[#13A452] bg-[#adff9d] w-12 text-sm rounded-xl">
                                  สำเร็จ
                                </h3>
                              ) : (
                                <h3 className="text-[#ff6600] bg-[#ffea8f] w-24 text-sm rounded-xl">
                                  รอการประกอบ
                                </h3>
                              )}
                            </div>
                            <div className="w-2/12 text-center text-lg font-['Sarabun'] flex place-content-center place-items-center">
                              {data.updatedAt.split("T")[0] +
                                " " +
                                data.updatedAt.split("T")[1]}
                            </div>
                            <div className="w-1/12 text-center text-lg font-['Sarabun'] flex place-content-center place-items-center">
                              <Link href={`/item/info/${params.itemID}/detail/${data.ID}`}>
                                <svg
                                  width="30"
                                  height="30"
                                  viewBox="0 0 30 30"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    d="M15 1.875C18.4812 1.875 21.8198 3.25791 24.2814 5.7195C26.743 8.18109 28.1259 11.5197 28.1259 15.0009C28.1259 18.4822 26.743 21.8208 24.2814 24.2824C21.8198 26.744 18.4812 28.1269 15 28.1269C11.5188 28.1269 8.18014 26.744 5.71855 24.2824C3.25696 21.8208 1.87405 18.4822 1.87405 15.0009C1.87405 11.5197 3.25696 8.18109 5.71855 5.7195C8.18014 3.25791 11.5188 1.875 15 1.875ZM16.9687 9.93375C17.9437 9.93375 18.735 9.25687 18.735 8.25375C18.735 7.25062 17.9419 6.57375 16.9687 6.57375C15.9937 6.57375 15.2062 7.25062 15.2062 8.25375C15.2062 9.25687 15.9937 9.93375 16.9687 9.93375ZM17.3119 20.4844C17.3119 20.2838 17.3812 19.7625 17.3419 19.4662L15.8006 21.24C15.4819 21.5756 15.0825 21.8081 14.895 21.7462C14.8099 21.7149 14.7388 21.6543 14.6945 21.5753C14.6501 21.4962 14.6355 21.4039 14.6531 21.315L17.2219 13.2C17.4319 12.1706 16.8544 11.2313 15.63 11.1113C14.3381 11.1113 12.4369 12.4219 11.28 14.085C11.28 14.2838 11.2425 14.7787 11.2819 15.075L12.8212 13.2994C13.14 12.9675 13.5112 12.7331 13.6987 12.7969C13.7911 12.83 13.8668 12.8981 13.9096 12.9864C13.9524 13.0748 13.9588 13.1763 13.9275 13.2694L11.3812 21.345C11.0869 22.29 11.6437 23.2163 12.9937 23.4263C14.9812 23.4263 16.155 22.1475 17.3137 20.4844H17.3119Z"
                                    fill="#EE6C4D"
                                  />
                                </svg>
                              </Link>
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
                  currentPage={itemPage}
                  allPage={item.allPage}
                  increase={increasePage}
                  decrease={decreasePage}
                  first={firstPage}
                  last={lastPage}
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
