import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import toast, { Toaster } from "react-hot-toast";
import { ChevronLeft } from "lucide-react";

import {
  getReceiptDebtReport,
  type ReceiptDebtReportOutput,
} from "../../../services/receiptService";

export default function ReceiptDebtReportPage() {
  const [monthYear, setMonthYear] = useState<Date | null>(new Date());
  const [reportData, setReportData] = useState<ReceiptDebtReportOutput[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  // BƯỚC 1: Thêm state mới để theo dõi trạng thái báo cáo
  const [hasReportBeenGenerated, setHasReportBeenGenerated] = useState(false);

  const fetchReport = async () => {
    if (!monthYear) {
      toast.error("Vui lòng chọn tháng.");
      return;
    }
    const month = monthYear.getMonth() + 1;
    const year = monthYear.getFullYear();

    setIsLoading(true);
    // Đặt trạng thái đã tạo báo cáo để chuyển giao diện sang dạng bảng
    setHasReportBeenGenerated(true); 
    
    try {
      const result = await getReceiptDebtReport({ month, year });
      const filtered = result.filter(
        (row) =>
          row.no_dau !== 0 ||
          row.phat_sinh !== 0 ||
          row.tien_thu !== 0 ||
          row.no_cuoi !== 0
      );
      
      // Đã xóa toast ở đây
      setReportData(filtered);
    } catch (err: any) {
      toast.error(err?.message || "Lỗi khi lấy báo cáo công nợ.");
    } finally {
      setIsLoading(false);
    }
  };

  const resetReport = () => {
    setReportData([]);
    setMonthYear(new Date());
    // Reset lại trạng thái để quay về màn hình chọn
    setHasReportBeenGenerated(false); 
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
        Báo cáo công nợ đại lý
      </h2>

      {/* BƯỚC 5: Thay đổi điều kiện render chính */}
      {!hasReportBeenGenerated ? (
        // Giao diện khi chưa xuất báo cáo
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
        // Giao diện sau khi đã xuất báo cáo (luôn hiển thị bảng)
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
                    Nợ đầu
                  </th>
                  <th className="px-4 py-3 text-right font-medium text-gray-600">
                    Phát sinh
                  </th>
                  <th className="px-4 py-3 text-right font-medium text-gray-600">
                    Đã thu
                  </th>
                  <th className="px-4 py-3 text-right font-medium text-gray-600">
                    Nợ cuối
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {/* BƯỚC 6: Thêm logic hiển thị dòng "trống" nếu không có dữ liệu */}
                {isLoading ? (
                    <tr>
                        <td colSpan={6} className="px-4 py-10 text-center text-gray-500">
                            Đang tải báo cáo...
                        </td>
                    </tr>
                ) : reportData.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-10 text-center text-gray-500">
                      Không có dữ liệu công nợ trong tháng đã chọn.
                    </td>
                  </tr>
                ) : (
                  reportData.map((row, idx) => (
                    <tr
                      key={idx}
                      className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}
                    >
                      <td className="px-4 py-3">{idx + 1}</td>
                      <td className="px-4 py-3">{row.ten}</td>
                      <td className="px-4 py-3 text-right">
                        {row.no_dau.toLocaleString("vi-VN", {
                          style: "currency",
                          currency: "VND",
                        })}
                      </td>
                      <td className="px-4 py-3 text-right">
                        {row.phat_sinh.toLocaleString("vi-VN", {
                          style: "currency",
                          currency: "VND",
                        })}
                      </td>
                      <td className="px-4 py-3 text-right">
                        {row.tien_thu.toLocaleString("vi-VN", {
                          style: "currency",
                          currency: "VND",
                        })}
                      </td>
                      <td className="px-4 py-3 text-right font-semibold">
                        {row.no_cuoi.toLocaleString("vi-VN", {
                          style: "currency",
                          currency: "VND",
                        })}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}