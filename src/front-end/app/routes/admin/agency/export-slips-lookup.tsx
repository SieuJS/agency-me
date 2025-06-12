import React, { useState, useEffect, useCallback } from "react";
import { Search } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router";
import { Link, type MetaFunction } from 'react-router';

import { Input } from "../../../components/ui/Input";
import { Button } from "../../../components/ui/Button";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import { getExportSheets, type ExportSheet, type ExportSheetSearchParams } from "../../../services/exportSheetService";
import { getAllAgencies } from "../../../services/agencyService";
import { type Agency } from "../../../services/agencyService";



// --- Helper function để định dạng ngày an toàn ---
const formatDateForAPI = (date: Date | null): string | undefined => {
  if (!date) return undefined;
  // Lấy các thành phần ngày tháng dựa trên múi giờ của client
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  return `${year}-${month}-${day}`;
};


export default function ExportSheetSearchRefactored() {
  // =================================================================
  // BƯỚC 1: Khai báo tất cả state và hooks ở top-level
  // =================================================================
  const [exportsheets, setExportSheets] = useState<ExportSheet[]>([]);
  const [agenciesMap, setAgenciesMap] = useState<Map<string | number, string>>(
    new Map()
  );
  const [searchName, setSearchName] = useState('');
  const [agencies, setAgencies] = useState<Agency[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingFilters, setIsLoadingFilters] = useState(true);

  // States cho các ô filter
  const [selectedAgencyId, setSelectedAgencyId] = useState<string>(""); // Giữ lại nếu cần, nếu không có thể xóa
  const [selectedReceiptDate, setSelectedReceiptDate] = useState<Date | null>(null);
  const [currentAmountFilterValue, setCurrentAmountFilterValue] = useState<number>(0);

  // States cho giá trị min/max của thanh trượt
  const [minAmountRange, setMinAmountRange] = useState(0);
  const [maxAmountRange, setMaxAmountRange] = useState(10_000_000);

  // States cho pagination và search params
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [lastSearchParams, setLastSearchParams] = useState<ExportSheetSearchParams>({});

  // Hook điều hướng
  const navigate = useNavigate();

  // =================================================================
  // BƯỚC 2: Khai báo các hằng số và giá trị phụ
  // =================================================================
  const perPage = 10;

  // =================================================================
  // BƯỚC 3: Khai báo các useEffect cho side-effects
  // =================================================================

  // useEffect để lấy danh sách đại lý (chạy 1 lần)
  useEffect(() => {
    const fetchAllAgenciesData = async () => {
      try {
        // Giả định bạn có hàm getAllAgencies được import
        const allAgenciesData = await getAllAgencies(); 
        setAgencies(allAgenciesData);
        const newMap = new Map<string | number, string>();
        allAgenciesData.forEach((agency) => {
          newMap.set(agency.id, agency.name);
        });
        setAgenciesMap(newMap);
      } catch (error) {
        toast.error("Không thể tải danh sách đại lý.");
      }
    };
    fetchAllAgenciesData();
  }, []); // Mảng rỗng -> chạy 1 lần

  // useEffect để khởi tạo giá trị bộ lọc (chạy 1 lần)
  useEffect(() => {
    const fetchFilterOptions = async () => {
      setIsLoadingFilters(true);
      try {
        const newMinAmount = 0;
        const newMaxAmount = 50_000_000;
        setMinAmountRange(newMinAmount);
        setMaxAmountRange(newMaxAmount);
        setCurrentAmountFilterValue(newMinAmount);
      } catch (error) {
        toast.error("Lỗi tải tùy chọn bộ lọc số tiền.");
      } finally {
        setIsLoadingFilters(false); // Quan trọng: Báo hiệu filter sẵn sàng
      }
    };
    fetchFilterOptions();
  }, []); // Mảng rỗng -> chạy 1 lần

  // useEffect chính để tải dữ liệu danh sách
  useEffect(() => {
    const fetchDataNow = async () => {
      setIsLoading(true);
      try {
        const finalParams = {
          ...lastSearchParams,
          page: currentPage,
          perPage: perPage,
        };
        const { items: fetchedExportSheets, meta } = await getExportSheets(finalParams);
        const exportSheetsWithStt = fetchedExportSheets.map((sheet, index) => ({
          ...sheet,
          stt: (meta.curPage - 1) * meta.perPage + index + 1,
        }));
        setExportSheets(exportSheetsWithStt);
        setTotalPages(meta.totalPage || 1);
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Lỗi tải danh sách phiếu xuất hàng.");
        setExportSheets([]);
      } finally {
        setIsLoading(false);
      }
    };

    if (!isLoadingFilters) {
      fetchDataNow();
    }
  }, [currentPage, lastSearchParams, isLoadingFilters, perPage]);

  // =================================================================
  // BƯỚC 4: Khai báo các hàm xử lý sự kiện (handlers)
  // =================================================================
  const handleSearch = () => {
    const searchParams: ExportSheetSearchParams = {
      daily_name: searchName || undefined,
      ngay_lap_phieu: formatDateForAPI(selectedReceiptDate),
      tong_tien: currentAmountFilterValue > minAmountRange ? currentAmountFilterValue : undefined,
    };
    setLastSearchParams(searchParams);
    setCurrentPage(1);
  };

  const handleResetSearch = () => {
    setSearchName("");
    setSelectedReceiptDate(null);
    setCurrentAmountFilterValue(minAmountRange);
    setLastSearchParams({});
    setCurrentPage(1);
  };

  // Các giá trị tính toán cho UI
  const isFilterSectionLoading = isLoadingFilters;
  const calculatedStep = Math.max(
    1,
    Math.floor((maxAmountRange - minAmountRange) / 100) || 50_000
  );


  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      <Toaster position="top-right" toastOptions={{ duration: 3000 }} />

      <h2 className="text-2xl font-bold text-gray-800">
        Danh sách phiếu xuất hàng
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
                    Đại lý
                </label>
                <input type="text" id="searchAgencyName" value={searchName} onChange={(e) => setSearchName(e.target.value)}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Tìm theo tên đại lý..." />
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
                    Tổng tiền (tối thiểu)
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


      {/* Phần Table và Pagination (giữ nguyên không đổi) */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-auto">
        {isLoading && exportsheets.length === 0 ? (
          <div className="p-10 text-center text-gray-500 text-sm">
            Đang tải dữ liệu phiếu xuất hàng...
          </div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-gray-600 uppercase">STT</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600 uppercase">Đại lý</th>
                <th className="px-4 py-3 text-right font-medium text-gray-600 uppercase">Ngày lập phiếu</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600 uppercase">Tổng tiền</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {isLoading && exportsheets.length > 0 && (
                <tr>
                  <td colSpan={5} className="p-4 text-center text-gray-400">Đang cập nhật…</td>
                </tr>
              )}
              {!isLoading && exportsheets.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-10 text-center text-gray-500 text-sm">Không có dữ liệu phiếu xuất hàng nào phù hợp.</td>
                </tr>
              ) : (
                exportsheets.map((exportsheet) => (
                  <tr key={exportsheet.phieu_id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 text-gray-700">{exportsheet.stt}</td>
                    <td className="px-4 py-3 font-medium text-gray-800">
                      <Link
                          to={`/admin/agency/export-slips-detail/${exportsheet.phieu_id}`}
                          className="text-blue-600 hover:underline"
                        >{agenciesMap.get(exportsheet.daily_name) || exportsheet.daily_name}
                        </Link>                    
                    </td>
                    
                    <td className="px-4 py-3 text-gray-700">
                      {new Date(exportsheet.ngay_lap_phieu).toLocaleDateString("vi-VN")}
                    </td>
                    <td className="px-4 py-3 text-gray-700 text-right">
                      {exportsheet.tong_tien.toLocaleString("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      })}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>

      {!isLoading && totalPages > 1 && (
        <div className="flex items-center justify-center space-x-3 mt-6">
            <button
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 border rounded-md bg-white text-sm hover:bg-gray-100 disabled:opacity-50"
            >
                ←
            </button>
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
            <button
                onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-1 border rounded-md bg-white text-sm hover:bg-gray-100 disabled:opacity-50"
            >
                →
            </button>
        </div>
      )}
    </div>
  );
}