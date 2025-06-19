import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import { PlusCircle, Trash2, Calendar as CalendarIcon } from 'lucide-react';
import { Toaster, toast } from 'react-hot-toast';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

import { getUserData } from '../../../services/authService';
import { getAllAgencies, type Agency } from '../../../services/agencyService';
import { createExportSheetAPI, type ExportSheetInputPayload } from '../../../services/exportSheetService';
import { fetchItemsAPI, type Item } from '../../../services/itemService';

// BƯỚC 1: Sửa interface
interface ExportSlipItemUI {
  id: string;
  mathang_id: string;
  ten?: string;
  ky_hieu: string; // Đổi từ don_vi_tinh
  so_luong: number;
  don_gia: number;
  thanh_tien: number;
}

export default function CreateExportSlipPage() {
  const [agencies, setAgencies] = useState<Agency[]>([]);
  const [itemsList, setItemsList] = useState<Item[]>([]);
  const [selectedAgencyId, setSelectedAgencyId] = useState<string>('');
  const [ngayLapPhieu, setNgayLapPhieu] = useState<Date | null>(new Date());
  const [slipItems, setSlipItems] = useState<ExportSlipItemUI[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);

  const userData = getUserData();
  const nhanVienLapPhieuId = userData?.nhan_vien_id || '';

  useEffect(() => {
    const loadInitialData = async () => {
      setIsLoadingData(true);
      try {
        const [agenciesData, itemsData] = await Promise.all([
          getAllAgencies(),
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

  // BƯỚC 2: Sửa logic
  const handleAddItemRow = () => {
    setSlipItems([
      ...slipItems,
      {
        id: Date.now().toString(),
        mathang_id: '',
        ky_hieu: '', // Đổi từ don_vi_tinh
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
              updatedItem.ky_hieu = selectedProduct.ky_hieu; // Đổi từ don_vi_tinh
              updatedItem.don_gia = selectedProduct.don_gia;
            } else {
              updatedItem.ky_hieu = ''; // Đổi từ don_vi_tinh
              updatedItem.don_gia = 0;
            }
          }
          if (field === 'so_luong' || field === 'don_gia' || field === 'mathang_id') {
              const soLuong = field === 'so_luong' ? Number(value) : updatedItem.so_luong;
              const donGia = updatedItem.don_gia;
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
    } else {
        const today = new Date();
        const inputDate = new Date(ngayLapPhieu);
        today.setHours(0, 0, 0, 0);
        inputDate.setHours(0, 0, 0, 0);
        if (inputDate > today) {
            toast.error('Ngày lập phiếu không được lớn hơn ngày hiện tại.');
            return; // Thêm return để dừng hàm
        }
    }
    if (slipItems.length === 0) {
      toast.error('Vui lòng thêm ít nhất một mặt hàng.');
      return;
    }
    if (!nhanVienLapPhieuId) {
        toast.error('Không tìm thấy thông tin nhân viên. Vui lòng đăng nhập lại.');
        return;
    }
    const invalidItem = slipItems.find(item => !item.mathang_id || item.so_luong <= 0);
    if (invalidItem) {
        toast.error('Thông tin mặt hàng không hợp lệ. Vui lòng kiểm tra lại.');
        return;
    }

    setIsSubmitting(true);
    const payload: ExportSheetInputPayload = {
      daily_id: selectedAgencyId,
      ngay_lap_phieu: ngayLapPhieu,
      nhan_vien_lap_phieu: nhanVienLapPhieuId,
      items: slipItems.map(item => ({
        mathang_id: item.mathang_id,
        so_luong: Number(item.so_luong),
      })),
    };

    try {
      await createExportSheetAPI(payload);
      toast.success('Phiếu xuất hàng đã được tạo thành công!');
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

  if (isLoadingData) {
    return (
        <div className="flex justify-center items-center h-64">
            <p className="text-gray-500">Đang tải dữ liệu...</p>
        </div>
    );
  }

  return (
    <>
      <Toaster position="top-right" />
      <div className="space-y-6">
        <form onSubmit={handleSubmit} className="p-6 md:p-8 bg-white rounded-lg shadow">
          <h1 className="text-2xl font-semibold text-gray-800 mb-6 border-b pb-4">
            Lập Phiếu Xuất Hàng
          </h1>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Đại lý</label>
                  <Select
                      options={agencies.map((agency) => ({ value: String(agency.id), label: agency.name }))}
                      value={agencies.find(a => a.id === selectedAgencyId) ? { value: selectedAgencyId, label: agencies.find(a => a.id === selectedAgencyId)?.name || '' } : null}
                      onChange={(selected) => setSelectedAgencyId(selected?.value || '')}
                      className="react-select-container"
                      classNamePrefix="react-select"
                      placeholder="-- Chọn đại lý --"
                      isSearchable
                  />
              </div>
              <div>
                  <label htmlFor="issueDate" className="block text-sm font-medium text-gray-700 mb-1">
                      Ngày lập phiếu <span className="text-red-500">*</span>
                  </label>
                  <div className="mt-1 relative rounded-md ">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <CalendarIcon className="h-5 w-5 text-gray-400" />
                      </div>
                      <DatePicker
                          selected={ngayLapPhieu}
                          onChange={(date: Date | null) => setNgayLapPhieu(date)}
                          dateFormat="dd/MM/yyyy"
                          className="inset-y-0 w-full pl-10 py-2 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          placeholderText="Chọn ngày"
                      />
                  </div>
              </div>
          </div>
          <div className="mb-8">
              <div className="flex justify-between items-center mb-3">
                  <h2 className="text-lg font-medium text-gray-800">Chi tiết phiếu xuất hàng</h2>
                  <button type="button" onClick={handleAddItemRow} className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-700">
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
                              {/* BƯỚC 3: Sửa giao diện */}
                              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kí hiệu</th>
                              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Số lượng</th>
                              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Đơn giá</th>
                              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Thành tiền</th>
                              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-16"></th>
                          </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                          {slipItems.length === 0 && (
                              <tr><td colSpan={7} className="px-4 py-4 text-sm text-gray-500 text-center">Chưa có mặt hàng nào. Nhấn "Thêm" để bắt đầu.</td></tr>
                          )}
                          {slipItems.map((item, index) => (
                              <tr key={item.id}>
                                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{index + 1}</td>
                                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                                      <select value={item.mathang_id} onChange={(e) => handleItemChange(item.id, 'mathang_id', e.target.value)} className="block w-full py-1.5 px-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" >
                                          <option value="" disabled>-- Chọn mặt hàng --</option>
                                          {itemsList.map(prod => (<option key={prod.mathang_id} value={prod.mathang_id}>{prod.ten}</option>))}
                                      </select>
                                  </td>
                                  {/* BƯỚC 3: Sửa giao diện */}
                                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500"><input type="text" value={item.ky_hieu || ''} readOnly className="block w-full py-1.5 px-2 border-gray-300 rounded-md shadow-sm sm:text-sm bg-gray-100 cursor-not-allowed" placeholder="Tự động"/></td>
                                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500"><input type="number" min="1" value={item.so_luong} onChange={(e) => handleItemChange(item.id, 'so_luong', parseInt(e.target.value, 10) || 0)} className="block w-full py-1.5 px-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" /></td>
                                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500"><input type="number" value={item.don_gia} readOnly className="block w-full py-1.5 px-2 border-gray-300 rounded-md shadow-sm sm:text-sm bg-gray-100 cursor-not-allowed" placeholder="Tự động"/></td>
                                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500"><input type="text" value={item.thanh_tien.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })} readOnly className="block w-full py-1.5 px-2 border-gray-300 rounded-md shadow-sm sm:text-sm bg-gray-100 cursor-not-allowed"/></td>
                                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 text-center">
                                      <button type="button" onClick={() => handleRemoveItemRow(item.id)} className="text-red-600 hover:text-red-800" title="Xóa mặt hàng"><Trash2 size={18} /></button>
                                  </td>
                              </tr>
                          ))}
                      </tbody>
                  </table>
              </div>
          </div>
          <div className="flex justify-end items-center mb-8">
              <span className="text-lg font-medium text-gray-700 mr-2">Tổng cộng:</span>
              <span className="text-xl font-semibold text-gray-900">{calculateGrandTotal().toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</span>
          </div>
          <div className="flex justify-end">
              <button type="submit" className="inline-flex items-center justify-center px-6 py-2.5 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-black hover:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black disabled:opacity-50 disabled:cursor-wait" disabled={isSubmitting}>
                  {isSubmitting ? 'Đang lưu...' : 'Lưu'}
              </button>
          </div>
        </form>
      </div>
    </>
  );
}