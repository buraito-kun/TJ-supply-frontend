"use client";

import { Chart } from "chart.js/auto";
import { useEffect, useRef, useState } from "react";

export default function QcPassFail() {
  useEffect(() => {
    refreshData();
  }, []);

  const barChartRef = useRef(null);
  const barChartInstance = useRef(null);
  const [qcPassFailCount, setQcPassFailCount] = useState([]);

  const fetchQcPassFailCount = async () => {
    const res = await fetch(
      process.env.NEXT_PUBLIC_API_URL + "summary/qc/eachQcPassFailCount",
      { method: "GET" }
    );
    if (!res.ok) throw new Error("Failed to fetch data.");
    return await res.json();
  };

  const refreshData = async () => {
    const fetchData = await fetchQcPassFailCount();
    setQcPassFailCount(fetchData.data);
  };

  useEffect(() => {
    if (!qcPassFailCount["passed"]) return;
    let label = [];
    let data_pass = [];
    let data_fail = [];

    for (let i of Object.keys(qcPassFailCount["all"])) {
      label.push(i);
      data_pass.push(qcPassFailCount["passed"][i] || 0);
      data_fail.push(qcPassFailCount["failed"][i] || 0);
    }

    if (barChartInstance.current) {
      barChartInstance.current.destroy();
      barChartInstance.current = null;
    }
    if (!barChartInstance.current) {
      barChartInstance.current = new Chart(barChartRef.current, {
        type: "bar",
        data: {
          labels: label,
          datasets: [
            {
              data: data_pass,
              label: "ผ่าน",
              backgroundColor: "#22c55e"
            },
            {
              data: data_fail,
              label: "ไม่ผ่าน",
              backgroundColor: "#dc2626"
            },
          ],
        },
        options: {
          maintainAspectRatio: false,
        }
      });
    }
  }, [qcPassFailCount]);

  return (
    <div className="w-full h-full border border-black rounded-2xl bg-white">
      <div className="w-full h-[10%] flex place-content-between place-items-center pl-5">
        <h1 className="text-black font-['Sarabun'] font-bold text-2xl">
          จำนวนการทดสอบแต่ละประเภท
        </h1>
      </div>
      <div className="w-full h-[90%] flex place-items-center place-content-center">
        <canvas className="w-full h-full" ref={barChartRef}></canvas>
      </div>
    </div>
  );
}
