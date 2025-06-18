import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import toast, { Toaster } from "react-hot-toast";
import { ChevronLeft } from "lucide-react";

import {
  getRevenueReport,
  type RevenueReportOutput,
} from "../../../services/agencyService";

export default function RevenueReportPage() {
  const [monthYear, setMonthYear] = useState<Date | null>(new Date());
  const [reportData, setReportData] = useState<RevenueReportOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchReport = async () => {
    if (!monthYear) {
      toast.error("Vui lòng chọn tháng.");
      return;
    }

    // Lấy đầu tháng và cuối tháng (giờ cuối cùng)
    const start = new Date(monthYear.getFullYear(), monthYear.getMonth(), 1);
    const end = new Date(monthYear.getFullYear(), monthYear.getMonth() + 1, 0, 23, 59, 59, 999);

    setIsLoading(true);
    try {
      const result = await getRevenueReport({
        tu_ngay: start.toISOString(),
        den_ngay: end.toISOString(),
      });

      if (result.danh_sach_doanh_so.length === 0) {
        toast("Không có dữ liệu doanh số cho tháng này.");
      }

      setReportData(result);
    } catch (err: any) {
      toast.error(err?.message || "Lỗi khi lấy báo cáo doanh số.");
    } finally {
      setIsLoading(false);
    }
  };

  const resetReport = () => {
    setReportData(null);
    setMonthYear(new Date());
  };

  const formatMonthYear = (date: Date) => {
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const yyyy = date.getFullYear();
    return `${mm}/${yyyy}`;
  };

  return (
    <div className="flex-1 p-6 bg-white rounded-lg shadow">
      <Toaster position="top-right" />
      <h2 className="text-2xl font-semibold text-center mb-6 text-gray-800">
        Báo cáo doanh số đại lý
      </h2>

      {!reportData ? (
        <div className="flex flex-col items-center space-y-4">
          <div className="text-center">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tháng
            </label>
            <DatePicker
              selected={monthYear}
              onChange={(date) => setMonthYear(date)}
              dateFormat="MM/yyyy"
              showMonthYearPicker
              className="h-10 w-48 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <button
            onClick={fetchReport}
            disabled={isLoading}
            className="w-44 bg-[#1F2937] hover:bg-[#111827] text-white text-sm font-medium rounded-md py-2 shadow-sm transition-colors disabled:opacity-50"
          >
            {isLoading ? "Đang tải..." : "Xuất báo cáo"}
          </button>
        </div>
      ) : (
        <>
          <div className="w-full mb-4 flex justify-end">
            <button
              onClick={resetReport}
              className="flex items-center justify-center w-32 bg-[#1F2937] hover:bg-[#111827] text-white text-sm font-medium rounded-md py-2 shadow-sm transition-colors"
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              Quay lại
            </button>
          </div>

          <div className="text-center mb-4 text-gray-700">
            Tháng {formatMonthYear(monthYear!)}
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-3 text-left font-medium text-gray-600">
                    STT
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-gray-600">
                    Đại lý
                  </th>
                  <th className="px-4 py-3 text-right font-medium text-gray-600">
                    Số phiếu xuất
                  </th>
                  <th className="px-4 py-3 text-right font-medium text-gray-600">
                    Tổng trị giá
                  </th>
                  <th className="px-4 py-3 text-right font-medium text-gray-600">
                    Tỷ lệ
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {reportData.danh_sach_doanh_so.map((row, idx) => (
                  <tr
                    key={row.daily_id}
                    className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}
                  >
                    <td className="px-4 py-3">{idx + 1}</td>
                    <td className="px-4 py-3">{row.ten_daily}</td>
                    <td className="px-4 py-3 text-right">{row.so_phieu_xuat_hang}</td>
                    <td className="px-4 py-3 text-right">
                      {row.tong_doanh_so.toLocaleString("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      })}
                    </td>
                    <td className="px-4 py-3 text-right">
                      {row.ty_le_phan_tram.toFixed(2)}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
