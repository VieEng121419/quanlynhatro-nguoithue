"use client";

import { useState } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  type TooltipItem,
} from "chart.js";
import { DayPicker, UI, DayFlag, SelectionState } from "react-day-picker";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { CalendarDays, Droplets, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface UtilityInfoProps {
  electricityUsage: number;
  waterUsage: number;
  serviceAmount: number;
  className?: string;
}

export function UtilityInfo({
  electricityUsage,
  waterUsage,
  serviceAmount,
  className,
}: UtilityInfoProps) {
  const [selectedMonth, setSelectedMonth] = useState<Date>(new Date());
  const [showPicker, setShowPicker] = useState(false);

  const monthLabel = format(selectedMonth, "MM/yyyy", { locale: vi });

  const chartData = {
    labels: ["Điện", "Nước"],
    datasets: [
      {
        label: "Số sử dụng",
        data: [electricityUsage, waterUsage],
        backgroundColor: ["#A73414", "#0051D5"],
        borderRadius: 8,
        barThickness: 40,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (context: TooltipItem<"bar">) =>
            `${context.dataset.label ?? ""}: ${context.raw}`,
        },
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: "#58413C", font: { size: 12 } },
      },
      y: {
        beginAtZero: true,
        grid: { color: "#FFE9E4" },
        ticks: { color: "#58413C", font: { size: 12 } },
      },
    },
  };

  const estimatedCost = serviceAmount - 10000;

  return (
    <div className={cn("bg-white rounded-[20px] p-4 shadow-sm", className)}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-semibold text-[#251915]">
          Điện & Nước tháng {monthLabel}
        </h2>
        <button
          type="button"
          onClick={() => setShowPicker((prev) => !prev)}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-[#FFF8F6] border border-[#E0BFB7] rounded-lg text-sm text-[#A73414] hover:bg-[#FFE9E4] transition-colors"
        >
          <CalendarDays className="w-4 h-4" />
          {format(selectedMonth, "MM/yyyy")}
        </button>
      </div>

      {/* Date Picker */}
      {showPicker && (
        <div className="mb-4 p-3 bg-[#FFF8F6] border border-[#E0BFB7] rounded-xl">
          <DayPicker
            mode="single"
            selected={selectedMonth}
            onSelect={(date) => {
              if (date) {
                setSelectedMonth(date);
                setShowPicker(false);
              }
            }}
            locale={vi}
            className="!m-0"
            classNames={{
              [UI.Months]: "!flex !justify-center",
              [UI.Month]: "!w-full",
              [UI.MonthCaption]: "!flex !justify-center !items-center !mb-2",
              [UI.CaptionLabel]: "!text-sm !font-semibold !text-[#251915]",
              [UI.Nav]: "!flex !items-center !gap-1",
              [UI.PreviousMonthButton]:
                "!w-7 !h-7 !rounded-lg !text-[#A73414] hover:!bg-[#FFE9E4]",
              [UI.NextMonthButton]:
                "!w-7 !h-7 !rounded-lg !text-[#A73414] hover:!bg-[#FFE9E4]",
              [UI.MonthGrid]: "!w-full",
              [UI.Weekdays]: "!flex !justify-between !mb-1",
              [UI.Weekday]: "!text-xs !text-[#58413C] !font-medium",
              [UI.Week]: "!flex !justify-between !mt-1",
              [UI.Day]: "!w-8 !h-8 !rounded-lg !text-[#251915] hover:!bg-[#FFE9E4]",
              [SelectionState.selected]:
                "!bg-[#A73414] !text-white hover:!bg-[#A73414]",
              [DayFlag.today]: "!font-bold !text-[#A73414]",
            }}
          />
        </div>
      )}

      {/* Bar Chart */}
      <div className="h-[180px] mb-4">
        <Bar data={chartData} options={chartOptions} />
      </div>

      {/* Labels */}
      <div className="flex items-center justify-around mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[#FFE9E4] flex items-center justify-center">
            <Zap className="w-4 h-4 text-[#A73414]" />
          </div>
          <div>
            <p className="text-xs text-[#58413C]">Số điện</p>
            <p className="text-sm font-semibold text-[#251915]">
              {electricityUsage} kWh
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[#E8F0FF] flex items-center justify-center">
            <Droplets className="w-4 h-4 text-[#0051D5]" />
          </div>
          <div>
            <p className="text-xs text-[#58413C]">Số nước</p>
            <p className="text-sm font-semibold text-[#251915]">
              {waterUsage} m³
            </p>
          </div>
        </div>
      </div>

      {/* Estimated Cost */}
      <div className="flex items-center justify-between pt-3 border-t border-[#F0E6E2]">
        <p className="text-sm text-[#58413C]">Chi phí dự kiến</p>
        <p className="text-base font-bold text-[#A73414]">
          ~{estimatedCost.toLocaleString("vi-VN")}đ
        </p>
      </div>
    </div>
  );
}