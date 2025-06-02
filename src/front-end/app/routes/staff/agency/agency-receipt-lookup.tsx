import React, { useState, useEffect, useCallback } from "react";
import { Search } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

import { Input } from "../../../components/ui/Input";
import { Button } from "../../../components/ui/Button";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
// Removed: import { Slider } from "@/components/ui/slider";
import { getReceipts,type Receipt } from "../../../services/receiptService";
// Removed: import Pagination from "@/components/shared/Pagination";

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
  const [maxAmountRange, setMaxAmountRange] = useState(10000000);
  const [currentAmountFilterValue, setCurrentAmountFilterValue] =
    useState<number>(0);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [lastSearchParams, setLastSearchParams] = useState<ReceiptSearchParams>(
    {}
  );

  const perPage = 10;

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
            : "Không thể tải dữ liệu phiếu thu."
        );
        setReceipts([]);
      } finally {
        setIsLoading(false);
      }
    },
    [currentPage, perPage]
  );

  useEffect(() => {
    const fetchFilterOptions = async () => {
      setIsLoadingFilters(true);
      try {
        const newMinAmount = 0;
        const newMaxAmount = 50000000;
        setMinAmountRange(newMinAmount);
        setMaxAmountRange(newMaxAmount > newMinAmount ? newMaxAmount : newMinAmount + 1000000);
        setCurrentAmountFilterValue(newMinAmount);
      } catch (error) {
        toast.error("Lỗi tải tùy chọn bộ lọc số tiền.");
        setMinAmountRange(0);
        setMaxAmountRange(10000000);
        setCurrentAmountFilterValue(0);
      } finally {
        setIsLoadingFilters(false);
      }
    };
    fetchFilterOptions();
  }, []);

  useEffect(() => {
    fetchData(lastSearchParams);
  }, [fetchData, currentPage, lastSearchParams]);

  useEffect(() => {
    setCurrentAmountFilterValue(minAmountRange);
  }, [minAmountRange]);

  const handleSearch = () => {
    setCurrentPage(1);
    const searchParams: ReceiptSearchParams = {};
    if (searchAgencyName.trim()) searchParams.agencyName = searchAgencyName.trim();
    if (selectedReceiptDate) {
      searchParams.date = selectedReceiptDate.toISOString().split("T")[0];
    }
    if (currentAmountFilterValue > minAmountRange || currentAmountFilterValue > 0) {
         searchParams.minAmount = currentAmountFilterValue;
    } else if (currentAmountFilterValue === 0 && minAmountRange < 0) {
        searchParams.minAmount = 0;
    }
    setLastSearchParams(searchParams);
  };

  const handleResetSearch = () => {
    setSearchAgencyName("");
    setSelectedReceiptDate(null);
    setCurrentAmountFilterValue(minAmountRange);
    setLastSearchParams({});
    setCurrentPage(1);
    fetchData({});
  };

  const isFilterSectionLoading = isLoadingFilters || isLoading;
  const calculatedStep = Math.max(1, Math.floor((maxAmountRange - minAmountRange) / 100) || 50000);


  return (
    <div className="p-6 flex flex-col space-y-5">
      <Toaster position="top-right" />
      <h2 className="text-xl font-bold mb-0">Danh sách các phiếu thu tiền</h2>

      <div className="space-y-4 p-4 border border-gray-200 rounded-lg bg-gray-50/50">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-4 items-end">
          <div>
            <label htmlFor="searchAgencyName" className="block text-sm font-medium text-gray-700 mb-1">
              Tên đại lý
            </label>
            <Input
              id="searchAgencyName"
              placeholder="Tìm theo tên đại lý"
              value={searchAgencyName}
              onChange={(e) => setSearchAgencyName(e.target.value)}
              className="w-full"
              disabled={isLoading}
            />
          </div>

          <div>
            <label htmlFor="receiptDate" className="block text-sm font-medium text-gray-700 mb-1">
              Ngày thu tiền
            </label>
            <DatePicker
              id="receiptDate"
              selected={selectedReceiptDate}
              onChange={(date) => setSelectedReceiptDate(date)}
              placeholderText="Tìm theo ngày thu tiền"
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              dateFormat="yyyy-MM-dd"
              disabled={isLoading}
            />
          </div>

          <div className="md:col-span-2 lg:col-span-1">
            <label htmlFor="amountSlider" className="block text-sm font-medium text-gray-700 mb-1">
              Số tiền thu (tối thiểu)
            </label>
            <div className="flex items-center gap-2 sm:gap-3">
              <input
                type="range"
                id="amountSlider"
                min={minAmountRange}
                max={maxAmountRange}
                value={currentAmountFilterValue}
                step={calculatedStep}
                onChange={(e) => setCurrentAmountFilterValue(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isFilterSectionLoading || minAmountRange >= maxAmountRange}
              />
              <span className="text-sm text-gray-700 w-28 text-right tabular-nums">
                {new Intl.NumberFormat("vi-VN", {
                  style: "currency",
                  currency: "VND",
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0,
                }).format(currentAmountFilterValue)}
              </span>
            </div>
          </div>

          <div className="flex items-end">
            <Button
              onClick={handleSearch}
              disabled={isLoading}
              className="w-full inline-flex items-center justify-center"
            >
              <Search className="h-4 w-4 mr-2 -ml-1" /> Tìm
            </Button>
          </div>
        </div>
        <div className="pt-2">
          <Button
            onClick={handleResetSearch}
            disabled={isLoading}
          >
            Đặt lại bộ lọc
          </Button>
        </div>
      </div>

      <div className="overflow-x-auto border rounded-lg">
        {isLoading && receipts.length === 0 ? (
          <div className="p-10 text-center text-sm text-gray-500">
            Đang tải dữ liệu phiếu thu...
          </div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">STT</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Đại lý</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Số tiền thu</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ngày thu tiền</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {isLoading && receipts.length > 0 && (
                <tr><td colSpan={4} className="p-2 text-center text-xs text-gray-400">Đang cập nhật...</td></tr>
              )}
              {!isLoading && receipts.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-10 text-center text-sm text-gray-500">
                    Không có dữ liệu phiếu thu nào phù hợp.
                  </td>
                </tr>
              ) : (
                receipts.map((receipt) => (
                  <tr key={receipt.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3 text-gray-600">{receipt.stt}</td>
                    <td className="px-4 py-3 font-medium text-gray-800">{receipt.agencyName}</td>
                    <td className="px-4 py-3 text-gray-600 text-right">
                      {receipt.amount.toLocaleString("vi-VN", { style: "currency", currency: "VND" })}
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {new Date(receipt.date).toLocaleDateString("vi-VN")}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination Section - Implemented as in AgencyLookupPage */}
      {!isLoading && totalPages > 1 && (
        <div className="flex justify-center items-center gap-3 mt-4">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
            disabled={currentPage === 1 || isLoading}
            className="px-3 py-1 border rounded-md bg-white text-sm hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            ←
          </button>
          <div className="relative">
            <select
              value={currentPage}
              onChange={(e) => setCurrentPage(Number(e.target.value))}
              disabled={isLoading}
              className="px-4 py-1.5 border border-gray-300 rounded-md bg-white text-sm cursor-pointer focus:ring-1 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-70 disabled:cursor-not-allowed"
              // Note: For custom arrow on select, you might need more complex styling or a wrapper.
              // AgencyLookupPage's select has `py-1`, this is `py-1.5` to better fit text. Adjust as needed.
            >
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (pageNumber: number) => (
                  <option key={pageNumber} value={pageNumber}>
                    Trang {pageNumber}/{totalPages}
                  </option>
                )
              )}
            </select>
          </div>
          <button
            onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages || isLoading}
            className="px-3 py-1 border rounded-md bg-white text-sm hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            →
          </button>
        </div>
      )}
    </div>
  );
}

