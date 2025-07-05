// src/front-end/app/routes/admin/receipt-form.tsx
import React, { useState, useEffect } from 'react';
import { RefreshCw } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

import { getAgencies, fetchAgencyByIdAPI, type Agency } from '../../../services/agencyService';
import { addReceipt, type AddRecepitPayload } from '../../../services/receiptService';

export default function ReceiptFormPage() {
  // Danh sách đại lý để chọn
  const [agencies, setAgencies] = useState<Agency[]>([]);
  // Giá trị của form
  const [selectedAgencyId, setSelectedAgencyId] = useState<string>('');
  const [address, setAddress] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [receiptDate, setReceiptDate] = useState<string>(''); // ISO string yyyy-MM-dd
  const [amount, setAmount] = useState<number | ''>('');
  
  // 1. THÊM STATE CHO SỐ TIỀN NỢ
  const [debt, setDebt] = useState<number | ''>('');

  const [isLoadingAgencies, setIsLoadingAgencies] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Lấy danh sách đại lý khi component mount
  useEffect(() => {
    const fetchAgencies = async () => {
      setIsLoadingAgencies(true);
      try {
        const response = await getAgencies({ perPage: 1000, page: 1 });
        setAgencies(response.agencies);
      } catch (err) {
        console.error('Error fetching agencies:', err);
        toast.error('Không thể tải danh sách đại lý.');
      } finally {
        setIsLoadingAgencies(false);
      }
    };
    fetchAgencies();
  }, []);

  // Khi chọn đại lý, tự động điền địa chỉ, điện thoại, email, và số nợ
  useEffect(() => {
    // 2. CẬP NHẬT LOGIC
    if (!selectedAgencyId) {
      setAddress('');
      setPhone('');
      setEmail('');
      setDebt(''); // Reset nợ khi không chọn đại lý
      return;
    }
    const fetchAgencyDetail = async () => {
      try {
        const agency = await fetchAgencyByIdAPI(selectedAgencyId);
        console.log('Fetched agency detail:', agency);
        setAddress(agency.address || '');
        setPhone(agency.phone || '');
        setEmail(agency.email || '');
        setDebt(agency.debt ?? ''); // Lấy số nợ
      } catch (err) {
        console.error('Error fetching agency detail:', err);
        toast.error('Không thể lấy thông tin đại lý.');
      }
    };
    fetchAgencyDetail();
    console.log('Selected agency ID:', selectedAgencyId);
    console.log('Selected agency debt:', debt);
  }, [selectedAgencyId]);

  // Mặc định để ngày hiện tại
  useEffect(() => {
    setReceiptDate(new Date().toISOString().split('T')[0]);
  }, []);

  // Xử lý reset form
  const handleReset = () => {
    setSelectedAgencyId('');
    setAddress('');
    setPhone('');
    setEmail('');
    setDebt(''); // Reset nợ
    setReceiptDate(new Date().toISOString().split('T')[0]);
    setAmount('');
  };

  // Xử lý lưu phiếu thu
  const handleSave = async () => {
    // Validation đơn giản
    if (!selectedAgencyId) {
      toast.error('Vui lòng chọn tên đại lý.');
      return;
    }
    if (!receiptDate) {
      toast.error('Vui lòng chọn ngày thu tiền.');
      return;
    }
    const today = new Date();
    const inputDate = new Date(receiptDate);

    today.setHours(0, 0, 0, 0);
    inputDate.setHours(0, 0, 0, 0);

    if (inputDate > today) {
      toast.error('Ngày lập phiếu không được lớn hơn ngày hiện tại.');
      return; // Thêm return để dừng lại
    }

    if (amount === '' || amount <= 0) {
      toast.error('Vui lòng nhập số tiền thu hợp lệ.');
      return;
    }

    const payload: AddRecepitPayload = {
      daily_id: selectedAgencyId,
      ngay_thu: receiptDate,
      so_tien_thu: Number(amount),
    };

    setIsSubmitting(true);
    try {
      const message = await addReceipt(payload);
      toast.success(message);
      // Sau khi lưu thành công, cập nhật lại số nợ của đại lý đang chọn
      if (selectedAgencyId) {
          const updatedAgency = await fetchAgencyByIdAPI(selectedAgencyId);
          setDebt(updatedAgency.debt || '');
      }
      handleReset(); // Reset form sau khi thành công
    } catch (err: any) {
      console.error('Error creating receipt:', err);
      const errorMsg = err?.response?.data?.message || 'Lỗi khi lưu phiếu thu.';
      toast.error(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <Toaster position="top-right" />

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">
          Phiếu thu tiền
        </h1>
        <button
          type="button"
          onClick={handleReset}
          className="flex items-center space-x-1 px-3 py-2 border border-gray-300 rounded-md bg-white hover:bg-gray-50"
          disabled={isSubmitting}
        >
          <RefreshCw size={16} />
          <span className="text-sm text-gray-700">Đặt lại</span>
        </button>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSave();
        }}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
          {/* ... Các trường Tên đại lý, Địa chỉ, Điện thoại ... */}
          {/* Tên đại lý */}
          <div className="col-span-1">
            <label htmlFor="agencySelect" className="block text-sm font-medium text-gray-700 mb-1">
              Tên đại lý
            </label>
            <select
              id="agencySelect"
              value={selectedAgencyId}
              onChange={(e) => setSelectedAgencyId(e.target.value)}
              className="block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              disabled={isLoadingAgencies || isSubmitting}
            >
              <option value="">-- Chọn tên đại lý --</option>
              {agencies.map((a) => (
                <option key={a.id} value={String(a.id)}>
                  {a.name}
                </option>
              ))}
            </select>
            {isLoadingAgencies && (
              <p className="text-xs text-gray-500 mt-1">Đang tải danh sách đại lý...</p>
            )}
          </div>

          {/* Địa chỉ */}
          <div className="col-span-1">
            <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
              Địa chỉ
            </label>
            <input
              type="text"
              id="address"
              value={address}
              readOnly
              placeholder="(Autofill theo đại lý)"
              className="block w-full px-3 py-2 border border-gray-300 bg-gray-50 rounded-md shadow-sm sm:text-sm"
            />
          </div>

          {/* Điện thoại */}
          <div className="col-span-1">
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
              Điện thoại
            </label>
            <input
              type="text"
              id="phone"
              value={phone}
              readOnly
              placeholder="(Autofill theo đại lý)"
              className="block w-full px-3 py-2 border border-gray-300 bg-gray-50 rounded-md shadow-sm sm:text-sm"
            />
          </div>

          {/* Email */}
          <div className="col-span-1">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="text"
              id="email"
              value={email}
              readOnly
              placeholder="(Autofill theo đại lý)"
              className="block w-full px-3 py-2 border border-gray-300 bg-gray-50 rounded-md shadow-sm sm:text-sm"
            />
          </div>

          {/* 3. THÊM TRƯỜNG "SỐ TIỀN NỢ" VÀO JSX */}
          <div className="col-span-1">
            <label htmlFor="debt" className="block text-sm font-medium text-gray-700 mb-1">
              Tiền nợ hiện tại
            </label>
            <input
              type="text" // Dùng text để hiển thị chuỗi đã định dạng
              id="debt"
              value={debt === '' ? '' : `${Number(debt).toLocaleString('vi-VN')} VND`}
              readOnly
              placeholder="(Autofill theo đại lý)"
              className="block w-full px-3 py-2 border border-gray-300 bg-gray-50 rounded-md shadow-sm sm:text-sm font-medium text-red-600"
            />
          </div>

          {/* Ngày thu tiền */}
          <div className="col-span-1">
            <label htmlFor="receiptDate" className="block text-sm font-medium text-gray-700 mb-1">
              Ngày thu tiền
            </label>
            <input
              type="date"
              id="receiptDate"
              value={receiptDate}
              onChange={(e) => setReceiptDate(e.target.value)}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              disabled={isSubmitting}
            />
          </div>

          {/* Số tiền thu */}
          <div className="col-span-2"> {/* Cho chiếm cả hàng để nổi bật hơn */}
            <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
              Số tiền thu
            </label>
            <input
              type="number"
              id="amount"
              value={amount}
              onChange={(e) => {
                const val = e.target.value;
                setAmount(val === '' ? '' : Number(val));
              }}
              placeholder="Nhập số tiền thu"
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              disabled={isSubmitting}
              min="0"
            />
          </div>
        </div>

        <div className="mt-8 flex justify-end">
          <button
            type="submit"
            className="w-full sm:w-auto px-8 py-3 bg-gray-800 text-white text-base font-medium rounded-md hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-700 disabled:opacity-50"
            disabled={isSubmitting || isLoadingAgencies}
          >
            {isSubmitting ? 'Đang lưu...' : 'Lập phiếu thu'}
          </button>
        </div>
      </form>
    </div>
  );
}