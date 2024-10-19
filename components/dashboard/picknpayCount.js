"use client";

import { Chart } from "chart.js/auto";
import { useEffect, useRef, useState } from "react";

export default function PicknpayCount() {
  const pieChartRef = useRef(null);
  const pieChartInstance = useRef(null);
  const [picknpayCount, setPicknpayCount] = useState([]);
  const [picknpayFilter, setPicknpayFilter] = useState("เดือน")
  const filterPool = ["เดือน", "ปี", "ทั้งหมด"];

  useEffect(() => {
    refreshData();
  }, [picknpayFilter]);

  const fetchPicknpayCount = async () => {
    const res = await fetch(
      process.env.NEXT_PUBLIC_API_URL + `summary/item/picknpayCount?limit=5&filter=${picknpayFilter==="เดือน"?"month":picknpayFilter==="ปี"?"year":"all"}`,
      { method: "GET" }
    );
    if (!res.ok) throw new Error("Failed to fetch data.");
    return await res.json();
  };

  const refreshData = async () => {
    const fetchData = await fetchPicknpayCount();
    setPicknpayCount(fetchData.data);
  };

  useEffect(() => {
    if (!picknpayCount) return;
    let label = [];
    let data = [];

    for (let i of picknpayCount) {
      label.push(i["itemName"]);
      data.push(i["amount"]);
    }

    if (pieChartInstance.current) {
      pieChartInstance.current.destroy();
      pieChartInstance.current = null;
    }
    if (!pieChartInstance.current) {
      pieChartInstance.current = new Chart(pieChartRef.current, {
        type: "pie",
        data: {
          labels: label,
          datasets: [
            {
              data: data,
            },
          ],
        },
        options: {
          maintainAspectRatio: false,
        }
      });
    }
  }, [picknpayCount]);

  const changeFilter = () => {
    setPicknpayFilter(
      filterPool[(filterPool.indexOf(picknpayFilter) + 1) % 3]
    );
  };

  return (
    <div className="w-full h-full border border-black rounded-2xl bg-white">
      <div className="w-full h-[10%] flex place-content-between place-items-center pl-5">
        <h1 className="text-black font-['Sarabun'] font-bold text-2xl">
          วัตถุดิบ/สินค้าที่เบิกบ่อย
        </h1>
        <div className="flex h-full place-items-center">
          <button
            onClick={changeFilter}
            className="text-black font-['Sarabun'] font-normal min-w-12"
          >
            {picknpayFilter}
          </button>
        </div>
      </div>
      <div className="w-full h-[90%] flex place-items-center place-content-center">
        <canvas className="w-full h-full" ref={pieChartRef}></canvas>
      </div>
    </div>
  );
}
