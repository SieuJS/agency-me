import React, { useState, useEffect } from 'react';
import { PlusCircle, Trash2, Calendar as CalendarIcon } from 'lucide-react';
import { toast } from 'react-hot-toast';
// Assuming you have a date picker component or will use a library
// import DatePicker from 'react-datepicker'; // Example
// import 'react-datepicker/dist/react-datepicker.css'; // Example styling
import { getUserData } from '../../services/authService'; // To get NhanVienLapPhieu

import DatePicker from 'react-datepicker'; // Cần cài đặt: npm install react-datepicker @types/react-datepicker
import 'react-datepicker/dist/react-datepicker.css';

//import { getAgencies } from '../../services/agencyService'; // Đường dẫn đúng
//import type { Agency } from '../../services/agencyService'; // Import kiểu Agency

import { getAgencies, type Agency} from '../../services/agencyService';
import { createExportSheetAPI, type ExportSheetInputPayload} from '../../services/exportSheetService';
import { fetchItemsAPI, type Item} from '../../services/itemService';
// --- Helper Functions/Services (Illustrative - to be implemented) ---
// These would ideally be in separate service files

//const [agencies, setAgencies] = useState<Agency[]>([]);

interface ExportSlipItemUI {
  id: string; // Unique key for React list
  mathang_id: string;
  ten?: string;
  don_vi_tinh: string;
  so_luong: number;
  don_gia: number;
  thanh_tien: number;
}


export default function CreateExportSlipPage() {
  const [agencies, setAgencies] = useState<Agency[]>([]);
  const [itemsList, setItemsList] = useState<Item[]>([]); // Full list of available items

  const [selectedAgencyId, setSelectedAgencyId] = useState<string>('');
  const [ngayLapPhieu, setNgayLapPhieu] = useState<Date | null>(new Date()); // Default to today
  const [slipItems, setSlipItems] = useState<ExportSlipItemUI[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false); // For submission loading state
  const [isLoadingData, setIsLoadingData] = useState(true); // For initial data loading

  const userData = getUserData();
  // Assuming your userData contains 'nhanvien_id' or similar for the logged-in staff
  const nhanVienLapPhieuId = userData?.nhan_vien_id || ''; // Adjust if your user data structure is different

  useEffect(() => {
    const loadInitialData = async () => {
      setIsLoadingData(true);
      try {
        // Use API functions
        const [agenciesData, itemsData] = await Promise.all([
          getAgencies(),
          fetchItemsAPI()
        ]);
        setAgencies(agenciesData);
        setItemsList(itemsData);
      } catch (error: any) {
        console.error("Failed to load initial data:", error);
        toast.error(error.message || 'Không thể tải dữ liệu cần thiết.');
      } finally {
        setIsLoadingData(false);
      }
    };
    loadInitialData();
  }, []);

  const handleAddItemRow = () => {
    setSlipItems([
      ...slipItems,
      {
        id: Date.now().toString(),
        mathang_id: '',
        don_vi_tinh: '',
        so_luong: 1,
        don_gia: 0,
        thanh_tien: 0,
      },
    ]);
  };

  const handleRemoveItemRow = (id: string) => {
    setSlipItems(slipItems.filter((item) => item.id !== id));
  };

  const handleItemChange = (id: string, field: keyof ExportSlipItemUI, value: string | number) => {
    setSlipItems(
      slipItems.map((item) => {
        if (item.id === id) {
          const updatedItem = { ...item, [field]: value };

          if (field === 'mathang_id') {
            const selectedProduct = itemsList.find(p => p.mathang_id === value);
            if (selectedProduct) {
              updatedItem.ten = selectedProduct.ten;
              updatedItem.don_vi_tinh = selectedProduct.don_vi_tinh;
              updatedItem.don_gia = selectedProduct.don_gia;
            } else {
              updatedItem.don_vi_tinh = '';
              updatedItem.don_gia = 0;
            }
          }

          if (field === 'so_luong' || field === 'don_gia' || field === 'mathang_id') {
             const soLuong = field === 'so_luong' ? Number(value) : updatedItem.so_luong;
             const donGia = field === 'don_gia' ? Number(value) : updatedItem.don_gia; // Use existing if field isn't don_gia
             updatedItem.thanh_tien = (soLuong || 0) * (donGia || 0);
          }
          return updatedItem;
        }
        return item;
      })
    );
  };

  const calculateGrandTotal = () => {
    return slipItems.reduce((total, item) => total + item.thanh_tien, 0);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!selectedAgencyId) {
      toast.error('Vui lòng chọn đại lý.');
      return;
    }
    if (!ngayLapPhieu) {
      toast.error('Vui lòng chọn ngày lập phiếu.');
      return;
    }
    if (slipItems.length === 0) {
      toast.error('Vui lòng thêm ít nhất một mặt hàng.');
      return;
    }
    if (!nhanVienLapPhieuId) {
        toast.error('Không tìm thấy thông tin nhân viên lập phiếu (ID). Vui lòng đăng nhập lại.');
        return;
    }

    const invalidItem = slipItems.find(item => !item.mathang_id || item.so_luong <= 0 || item.don_gia < 0); // don_gia should not be negative
    if (invalidItem) {
        toast.error('Thông tin mặt hàng không hợp lệ. Vui lòng kiểm tra lại mã hàng, số lượng và đơn giá.');
        return;
    }

    setIsSubmitting(true);

    const payload: ExportSheetInputPayload = {
      daily_id: selectedAgencyId,
      ngay_lap_phieu: ngayLapPhieu, // The backend service uses new Date(), so sending the selected date is correct.
      nhan_vien_lap_phieu: nhanVienLapPhieuId, // Crucial: This must be the NhanVien ID
      items: slipItems.map(item => ({
        mathang_id: item.mathang_id,
        so_luong: Number(item.so_luong),
      })),
    };

    try {
      const result = await createExportSheetAPI(payload);
      console.log('Export slip created:', result);
      toast.success('Phiếu xuất hàng đã được tạo thành công!');

      // Reset form
      setSelectedAgencyId('');
      setNgayLapPhieu(new Date());
      setSlipItems([]);

    } catch (error: any) {
      console.error('Error saving export slip:', error);
      toast.error(error.message || 'Lỗi khi lưu phiếu xuất.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoadingData) { // Initial full page load spinner
    return (
        <div className="flex justify-center items-center h-64">
            <p className="text-gray-500">Đang tải dữ liệu...</p>
        </div>
    );
  }

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="p-6 md:p-8 bg-white rounded-lg shadow">
        <h1 className="text-2xl font-semibold text-gray-800 mb-6 border-b pb-4">
          Lập Phiếu Xuất Hàng
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Tên đại lý */}
          <div>
            <label htmlFor="agencyName" className="block text-sm font-medium text-gray-700 mb-1">
              Tên đại lý <span className="text-red-500">*</span>
            </label>
            <select
  id="agencyName"
  value={selectedAgencyId}
  onChange={(e) => setSelectedAgencyId(e.target.value)}
  className={`mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm
    `}
  required
>
  <option value="" disabled hidden>
    -- Chọn đại lý --
  </option>
  {agencies.map((agency) => (
    <option key={agency.id} value={agency.id}>
      {agency.name}
    </option>
  ))}
</select>



          </div>

          {/* Ngày lập phiếu */}
          <div>
            <label htmlFor="issueDate" className="block text-sm font-medium text-gray-700 mb-1">
              Ngày lập phiếu <span className="text-red-500">*</span>
            </label>
            {/* Basic Date Input - Replace with a proper DatePicker if needed */}
            {/* <input
                type="date"
                id="issueDate"
                value={ngayLapPhieu ? ngayLapPhieu.toISOString().split('T')[0] : ''}
                onChange={(e) => setNgayLapPhieu(e.target.value ? new Date(e.target.value) : null)}
                className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                required
            /> */}
            
            <div className="mt-1 relative rounded-md ">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <CalendarIcon className="h-5 w-5 text-gray-400" />
                </div>
                <DatePicker // This is an example, use your actual DatePicker
                    selected={ngayLapPhieu}
                    onChange={(date: Date | null) => setNgayLapPhieu(date)}
                    dateFormat="dd/MM/yyyy"
                    className="inset-y-0 w-full pl-10 py-2 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholderText="Chọn ngày"
                    required
                />
            </div>
           
          </div>
        </div>

        {/* Chi tiết phiếu xuất hàng */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-lg font-medium text-gray-800">Chi tiết phiếu xuất hàng</h2>
            <button
              type="button"
              onClick={handleAddItemRow}
               className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-700 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-700"
            >
              <PlusCircle size={18} className="mr-2" />
              Thêm
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 border border-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-10">STT</th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-2/5">Mặt hàng</th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Đơn vị tính</th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Số lượng</th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Đơn giá</th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Thành tiền</th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-16"></th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {slipItems.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-4 py-4 text-sm text-gray-500 text-center">
                      Chưa có mặt hàng nào. Nhấn "Thêm" để bắt đầu.
                    </td>
                  </tr>
                )}
                {slipItems.map((item, index) => (
                  <tr key={item.id}>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{index + 1}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                      <select
                        value={item.mathang_id}
                        onChange={(e) => handleItemChange(item.id, 'mathang_id', e.target.value)}
                        className="block w-full py-1.5 px-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        required
                      >
                        <option value="" disabled hidden>-- Chọn mặt hàng --</option>
                        {itemsList.map(prod => (
                          <option key={prod.mathang_id} value={prod.mathang_id}>
                            {prod.ten}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                      <input
                        type="text"
                        value={item.don_vi_tinh}
                        readOnly // Autofill based on item selection
                        className="block w-full py-1.5 px-2 border-gray-300 rounded-md shadow-sm sm:text-sm bg-gray-50 cursor-not-allowed"
                        placeholder="Autofill"
                      />
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                      <input
                        type="number"
                        min="1"
                        value={item.so_luong}
                        onChange={(e) => handleItemChange(item.id, 'so_luong', parseInt(e.target.value, 10) || 0)}
                        className="block w-full py-1.5 px-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        required
                      />
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                       <input
                        type="number"
                        value={item.don_gia}
                        readOnly // Autofill based on item selection, or make editable if needed
                        onChange={(e) => handleItemChange(item.id, 'don_gia', parseFloat(e.target.value) || 0)}
                        className="block w-full py-1.5 px-2 border-gray-300 rounded-md shadow-sm sm:text-sm bg-gray-50 cursor-not-allowed"
                        placeholder="Autofill"
                      />
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                       <input
                        type="text" // Display only, formatted
                        value={item.thanh_tien.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
                        readOnly
                        className="block w-full py-1.5 px-2 border-gray-300 rounded-md shadow-sm sm:text-sm bg-gray-50 cursor-not-allowed"
                        placeholder="Autofill"
                      />
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 text-center">
                      <button
                        type="button"
                        onClick={() => handleRemoveItemRow(item.id)}
                        className="text-red-600 hover:text-red-800"
                        title="Xóa mặt hàng"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Tổng cộng */}
        <div className="flex justify-end items-center mb-8">
          <span className="text-lg font-medium text-gray-700 mr-2">Tổng cộng:</span>
          <span className="text-xl font-semibold text-gray-900">
            {calculateGrandTotal().toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
          </span>
        </div>

        {/* Nút Lưu */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="inline-flex items-center justify-center px-6 py-2.5 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-black hover:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black disabled:opacity-50"
            disabled={isLoadingData}
          >
            {isLoadingData ? 'Đang lưu...' : 'Lưu'}
          </button>
        </div>
      </form>
    </div>
  );
}