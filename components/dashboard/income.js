"use client";

import { Chart } from "chart.js/auto";
import { useEffect, useRef, useState } from "react";

export default function Income() {
  useEffect(() => {
    refreshData();
  }, []);

  const incomeChartRef = useRef(null);
  const incomeChartInstance = useRef(null);
  const [incomeChartFilter, setIncomeChartFilter] = useState("เดือน");
  const filterPool = ["เดือน", "ปี", "ทั้งหมด"];
  const allMonth = [
    "มกราคม",
    "กุมภาพันธ์",
    "มีนาคม",
    "เมษายน",
    "พฤษภาคม",
    "มิถุนายน",
    "กรกฏาคม",
    "สิงหาคม",
    "กันยายน",
    "ตุลาคม",
    "พฤศจิกายน",
    "ธันวาคม",
  ];
  const [statement, setStatement] = useState({});
  const [incomeSum, setIncomeSum] = useState(0);

  const fetchStatement = async () => {
    const res = await fetch(
      process.env.NEXT_PUBLIC_API_URL + "summary/statement",
      { method: "GET" }
    );
    if (!res.ok) throw new Error("Failed to fetch data.");
    return await res.json();
  };

  const refreshData = async () => {
    const statementData = await fetchStatement();
    setStatement(statementData.data);
  };

  useEffect(() => {
    if (incomeChartInstance.current) {
      incomeChartInstance.current.destroy();
      incomeChartInstance.current = null;
    }
    if (!incomeChartInstance.current) {
      const currentTime = new Date();
      const label = [];
      const data = [];

      if (incomeChartFilter === "เดือน" && statement?.income) {
        for (let i = 0; i <= 30; i++) {
          label.push(
            `${currentTime.getDate()}/${
              currentTime.getMonth() + 1
            }/${currentTime.getFullYear()}`
          );
          try {
            if (
              statement["income"][currentTime.getFullYear()][
                currentTime.getMonth() + 1
              ][currentTime.getDate()] === undefined
            ) {
              data.push(0);
            } else {
              data.push(
                statement["income"][currentTime.getFullYear()][
                  currentTime.getMonth() + 1
                ][currentTime.getDate()]
              );
            }
          } catch (err) {
            data.push(0);
          }
          currentTime.setDate(currentTime.getDate() - 1);
        }
      } else if (incomeChartFilter === "ปี" && statement?.income) {
        currentTime.setDate(1);
        for (let i = 0; i <= 12; i++) {
          label.push(
            `${allMonth[currentTime.getMonth()]} ${currentTime.getFullYear()}`
          );
          try {
            let value = 0;
            for (let d of Object.keys(
              statement["income"][currentTime.getFullYear()][
                currentTime.getMonth() + 1
              ]
            )) {
              value +=
                statement["income"][currentTime.getFullYear()][
                  currentTime.getMonth() + 1
                ][d];
            }
            data.push(value);
          } catch (err) {
            data.push(0);
          }
          currentTime.setMonth(currentTime.getMonth() - 1);
        }
      } else if (statement?.income) {
        currentTime.setDate(1);
        let minYear = Object.keys(statement["total"])[0];
        let minMonth = Object.keys(statement["total"][minYear])[0];
        while (
          minYear <= currentTime.getFullYear() &&
          minMonth <= currentTime.getMonth() + 1
        ) {
          label.push(
            `${allMonth[currentTime.getMonth()]} ${currentTime.getFullYear()}`
          );
          try {
            let value = 0;
            for (let d of Object.keys(
              statement["income"][currentTime.getFullYear()][
                currentTime.getMonth() + 1
              ]
            )) {
              value +=
                statement["income"][currentTime.getFullYear()][
                  currentTime.getMonth() + 1
                ][d];
            }
            data.push(value);
          } catch (err) {
            data.push(0);
          }
          currentTime.setMonth(currentTime.getMonth() - 1);
        }
      }
      label.reverse();
      data.reverse();
      setIncomeSum(data.reduce((a, b)=>a+b, 0))
      incomeChartInstance.current = new Chart(incomeChartRef.current, {
        type: "line",
        data: {
          labels: label,
          datasets: [
            {
              data: data,
              backgroundColor: "rgba(93, 42, 30, 0.2)",
              fill: false,
              borderColor: "#ee6c4d",
              tension: 0.5,
            },
          ],
        },
        options: {
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: false,
            },
          },
          scales: {
            x: {
              ticks: {
                display: false,
              },
            },
          },
        },
      });
    }
  }, [incomeChartFilter, statement]);

  const changeIncomeChartFilter = () => {
    setIncomeChartFilter(
      filterPool[(filterPool.indexOf(incomeChartFilter) + 1) % 3]
    );
  };
  
  return (
    <div className="w-full h-full border border-black rounded-2xl bg-white">
      <div className="w-full h-[10%] flex place-content-between place-items-center pl-5">
        <h1 className="text-black font-['Sarabun'] font-bold text-2xl">
          รายรับ
        </h1>
        <div className="flex h-full place-items-center">
          <button
            onClick={changeIncomeChartFilter}
            className="text-black font-['Sarabun'] font-normal min-w-12"
          >
            {incomeChartFilter}
          </button>
        </div>
      </div>
      <div className="w-full h-[30%] bg-white flex place-content-start place-items-center">
        <h1 className="text-green-500 font-['Sarabun'] font-bold text-[80px]">
          ฿{" "}
          {Intl.NumberFormat("en-US", {
            notation: "compact",
            maximumFractionDigits: 2,
          }).format(incomeSum)}
        </h1>
      </div>
      <div className="w-full h-[60%] flex place-items-center place-content-center">
        <canvas className="w-full h-full" ref={incomeChartRef}></canvas>
      </div>
    </div>
  );
}
