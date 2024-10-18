"use client";

import { Chart } from "chart.js/auto";
import { useEffect, useRef, useState } from "react";

export default function TopSellingProduct() {
  useEffect(() => {
    refreshData();
  }, []);

  const pieChartRef = useRef(null);
  const pieChartInstance = useRef(null);
  const [topSellingProduct, setTopSellingProduct] = useState([]);

  const fetchTopSellingProduct = async () => {
    const res = await fetch(
      process.env.NEXT_PUBLIC_API_URL + "summary/productTopSale?limit=5",
      { method: "GET" }
    );
    if (!res.ok) throw new Error("Failed to fetch data.");
    return await res.json();
  };

  const refreshData = async () => {
    const fetchData = await fetchTopSellingProduct();
    setTopSellingProduct(fetchData.data);
  };

  useEffect(() => {
    let label = [];
    let data = [];

    for (let i of topSellingProduct) {
      label.push(i["itemName"]);
      data.push(i["count"]);
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
      });
    }
  }, [topSellingProduct]);

  return (
    <div className="w-full h-full border border-black rounded-2xl bg-white">
      <div className="w-full h-[10%] flex place-content-between place-items-center pl-5">
        <h1 className="text-black font-['Sarabun'] font-bold text-2xl">
          สินค้าขายดี
        </h1>
      </div>
      <div className="w-full h-[90%] flex place-items-center place-content-center">
        <canvas className="w-full h-full" ref={pieChartRef}></canvas>
      </div>
    </div>
  );
}
