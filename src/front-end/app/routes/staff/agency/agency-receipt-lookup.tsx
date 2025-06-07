import React, { useState, useEffect, useCallback } from "react";
import { Search } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

import { Input } from "../../../components/ui/Input";
import { Button } from "../../../components/ui/Button";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import { getReceipts, type Receipt } from "../../../services/receiptService";

interface ReceiptSearchParams {
  agencyName?: string;
  date?: string;
  minAmount?: number;
}

export default function ReceiptSearchRefactored() {
  const [receipts, setReceipts] = useState<Receipt[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingFilters, setIsLoadingFilters] = useState(true);

  const [searchAgencyName, setSearchAgencyName] = useState("");
  const [selectedReceiptDate, setSelectedReceiptDate] = useState<Date | null>(
    null
  );

  const [minAmountRange, setMinAmountRange] = useState(0);
  const [maxAmountRange, setMaxAmountRange] = useState(10_000_000);
  const [currentAmountFilterValue, setCurrentAmountFilterValue] =
    useState<number>(0);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [lastSearchParams, setLastSearchParams] = useState<
    ReceiptSearchParams
  >({});

  const perPage = 10;

  // Hàm fetchData với useCallback để tránh re-render không cần thiết
  const fetchData = useCallback(
    async (paramsToFetch?: ReceiptSearchParams) => {
      setIsLoading(true);
      try {
        const finalParams = {
          ...paramsToFetch,
          page: currentPage,
          perPage: perPage,
        };

        const apiParams = {
          agencyName: finalParams.agencyName || undefined,
          fromDate: finalParams.date || undefined,
          minAmount: finalParams.minAmount || undefined,
          page: finalParams.page,
          perPage: finalParams.perPage,
        };

        const res = await getReceipts(apiParams);

        // Thêm STT dựa trên currentPage + index
        const receiptsWithStt = res.receipts.map((receipt, index) => ({
          ...receipt,
          stt: (currentPage - 1) * perPage + index + 1,
        }));

        setReceipts(receiptsWithStt);
        setTotalPages(res.totalPage || 1);
      } catch (error) {
        toast.error(
          error instanceof Error
            ? error.message
            : "Không thể tải dữ liệu phiếu thu.",
          { duration: 3000, position: "top-right" }
        );
        setReceipts([]);
      } finally {
        setIsLoading(false);
      }
    },
    [currentPage, perPage]
  );

  // Khi component mount, khởi tạo giá trị bộ lọc
  useEffect(() => {
    const fetchFilterOptions = async () => {
      setIsLoadingFilters(true);
      try {
        // Giả định backend không cung cấp min/max, nên set cứng
        const newMinAmount = 0;
        const newMaxAmount = 50_000_000;
        setMinAmountRange(newMinAmount);
        setMaxAmountRange(
          newMaxAmount > newMinAmount ? newMaxAmount : newMinAmount + 1_000_000
        );
        setCurrentAmountFilterValue(newMinAmount);
      } catch (error) {
        toast.error("Lỗi tải tùy chọn bộ lọc số tiền.", {
          duration: 3000,
          position: "top-right",
        });
        setMinAmountRange(0);
        setMaxAmountRange(10_000_000);
        setCurrentAmountFilterValue(0);
      } finally {
        setIsLoadingFilters(false);
      }
    };
    fetchFilterOptions();
  }, []);

  // Mỗi khi currentPage hoặc lastSearchParams thay đổi, gọi lại dữ liệu
  useEffect(() => {
    fetchData(lastSearchParams);
  }, [fetchData, currentPage, lastSearchParams]);

  // Khi minAmountRange thay đổi (lần đầu tiên), đồng bộ giá trị hiện tại = min
  useEffect(() => {
    setCurrentAmountFilterValue(minAmountRange);
  }, [minAmountRange]);

  // Xử lý tìm kiếm: xây dựng params và reset page về 1
  const handleSearch = () => {
    setCurrentPage(1);
    const searchParams: ReceiptSearchParams = {};
    if (searchAgencyName.trim())
      searchParams.agencyName = searchAgencyName.trim();
    if (selectedReceiptDate) {
      searchParams.date = selectedReceiptDate.toISOString().split("T")[0];
    }
    if (currentAmountFilterValue > minAmountRange) {
      searchParams.minAmount = currentAmountFilterValue;
    }
    setLastSearchParams(searchParams);
  };

  // Reset toàn bộ bộ lọc và dữ liệu
  const handleResetSearch = () => {
    setSearchAgencyName("");
    setSelectedReceiptDate(null);
    setCurrentAmountFilterValue(minAmountRange);
    setLastSearchParams({});
    setCurrentPage(1);
    fetchData({});
  };

  const isFilterSectionLoading = isLoadingFilters || isLoading;
  const calculatedStep = Math.max(
    1,
    Math.floor((maxAmountRange - minAmountRange) / 100) || 50_000
  );

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Toaster chung (3s) */}
      <Toaster position="top-right" toastOptions={{ duration: 3000 }} />

      <h2 className="text-2xl font-bold text-gray-800">
        Danh sách phiếu thu tiền
      </h2>

{/* Phần Filter */}
<div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm mb-6">
  <div className="flex flex-wrap items-center gap-4">
    {/* Ô “Tên đại lý” */}
    <div className="flex-none w-full sm:w-auto flex-1 min-w-[200px]">
      <label
        htmlFor="searchAgencyName"
        className="block text-sm font-medium text-gray-700 mb-1"
      >
        Tên đại lý
      </label>
      <input
        id="searchAgencyName"
        type="text"
        placeholder="Nhập tên đại lý"
        value={searchAgencyName}
        onChange={(e) => setSearchAgencyName(e.target.value)}
        disabled={isLoading}
        className="h-10 w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm"
      />
    </div>

    {/* Ô “Ngày thu tiền” */}
    <div className="flex-none w-full sm:w-auto flex-1 min-w-[200px]">
      <label
        htmlFor="receiptDate"
        className="block text-sm font-medium text-gray-700 mb-1"
      >
        Ngày thu tiền
      </label>
      <div className="relative">
        <DatePicker
          id="receiptDate"
          selected={selectedReceiptDate}
          onChange={(date) => setSelectedReceiptDate(date)}
          placeholderText="Chọn ngày"
          dateFormat="yyyy-MM-dd"
          disabled={isFilterSectionLoading}
          className="h-10 w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm"
        />
      </div>
    </div>

    {/* Ô “Số tiền thu (tối thiểu)” */}
    <div className="flex-none w-full sm:w-auto flex-1 min-w-[240px]">
      <label
        htmlFor="amountSlider"
        className="block text-sm font-medium text-gray-700 mb-1"
      >
        Số tiền thu (tối thiểu)
      </label>
      <div className="flex items-center gap-3">
        <input
          type="range"
          id="amountSlider"
          min={minAmountRange}
          max={maxAmountRange}
          value={currentAmountFilterValue}
          step={calculatedStep}
          onChange={(e) =>
            setCurrentAmountFilterValue(Number(e.target.value))
          }
          disabled={
            isFilterSectionLoading || minAmountRange >= maxAmountRange
          }
          className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
        />
        <span className="w-32 text-right text-sm text-gray-700 tabular-nums">
          {new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
          }).format(currentAmountFilterValue)}
        </span>
      </div>
    </div>

    {/* Khoảng trắng đẩy nút sang bên phải */}
    <div className="flex-auto" />

    {/* Hai nút “Tìm” và “Đặt lại” */}
    <div className="flex-none flex space-x-3">
      <button
        onClick={handleSearch}
        disabled={isLoading}
        className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg px-5 py-2 shadow-md transition-colors disabled:opacity-50"
      >
        <Search className="h-4 w-4" />
        <span>Tìm</span>
      </button>
      <button
        onClick={handleResetSearch}
        disabled={isLoading}
        className="flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium rounded-lg px-5 py-2 shadow-sm transition-colors disabled:opacity-50"
      >
        Đặt lại
      </button>
    </div>
  </div>
</div>


      {/* Phần Table */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-auto">
        {isLoading && receipts.length === 0 ? (
          <div className="p-10 text-center text-gray-500 text-sm">
            Đang tải dữ liệu phiếu thu...
          </div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-gray-600 uppercase">
                  STT
                </th>
                <th className="px-4 py-3 text-left font-medium text-gray-600 uppercase">
                  Đại lý
                </th>
                <th className="px-4 py-3 text-right font-medium text-gray-600 uppercase">
                  Số tiền thu
                </th>
                <th className="px-4 py-3 text-left font-medium text-gray-600 uppercase">
                  Ngày thu tiền
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {isLoading && receipts.length > 0 && (
                <tr>
                  <td colSpan={4} className="p-4 text-center text-gray-400">
                    Đang cập nhật…
                  </td>
                </tr>
              )}
              {!isLoading && receipts.length === 0 ? (
                <tr>
                  <td
                    colSpan={4}
                    className="p-10 text-center text-gray-500 text-sm"
                  >
                    Không có dữ liệu phiếu thu nào phù hợp.
                  </td>
                </tr>
              ) : (
                receipts.map((receipt) => (
                  <tr
                    key={receipt.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-4 py-3 text-gray-700">{receipt.stt}</td>
                    <td className="px-4 py-3 font-medium text-gray-800">
                      {receipt.agencyName}
                    </td>
                    <td className="px-4 py-3 text-gray-700 text-right">
                      {receipt.amount.toLocaleString("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      })}
                    </td>
                    <td className="px-4 py-3 text-gray-700">
                      {new Date(receipt.date).toLocaleDateString("vi-VN")}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      {!isLoading && totalPages > 1 && (
        <div className="flex items-center justify-center space-x-3 mt-6">
          <Button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1 || isLoading}
            
          >
            ←
          </Button>
          <select
            value={currentPage}
            onChange={(e) => setCurrentPage(Number(e.target.value))}
            disabled={isLoading}
            className="px-3 py-1 border border-gray-300 rounded-md bg-white text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-70"
          >
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(
              (pageNumber) => (
                <option key={pageNumber} value={pageNumber}>
                  Trang {pageNumber}/{totalPages}
                </option>
              )
            )}
          </select>
          <Button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages || isLoading}
    
          >
            →
          </Button>
        </div>
      )}
    </div>
  );
}
