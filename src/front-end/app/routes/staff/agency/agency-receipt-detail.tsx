// src/front-end/app/routes/admin/receipt-detail.tsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Loader2 } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

// Assuming you have a service to get receipt details by ID
// and a corresponding return type.
import { getReceiptById, type ReceiptDetail } from '../../../services/receiptService';
import { fetchAgencyByIdAPI, type Agency } from '../../../services/agencyService';

export default function ReceiptDetailPage() {
  // Get receiptId from the URL, e.g., /admin/receipts/123
  const { receiptId } = useParams<{ receiptId: string }>();
  const navigate = useNavigate();

  const [receipt, setReceipt] = useState<ReceiptDetail | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Fetch receipt details when the component mounts or receiptId changes
  useEffect(() => {
    if (!receiptId) {
      toast.error('Không tìm thấy ID phiếu thu.');
      setIsLoading(false);
      return;
    }

    const fetchReceiptDetail = async () => {
      setIsLoading(true);
      try {
        // Call the API to get receipt details
        const receipt = await getReceiptById(receiptId);
        const agency = await fetchAgencyByIdAPI(receipt.daily_id);
        setReceipt({ ...receipt, agency });
      } catch (err) {
        console.error('Error fetching receipt detail:', err);
        toast.error('Không thể tải chi tiết phiếu thu.');
        setReceipt(null); // Reset receipt on error
      } finally {
        setIsLoading(false);
      }
    };

    fetchReceiptDetail();
  }, [receiptId]);

  // Handler for the "Back" button
  const handleBack = () => {
    navigate(-1); // Go back to the previous page in history
  };
  
  // Display loading state
  if (isLoading) {
    return (
      <div className="max-w-2xl mx-auto p-6 text-center flex items-center justify-center h-64">
        <Loader2 className="animate-spin mr-2" />
        <p> Đang tải dữ liệu phiếu thu...</p>
      </div>
    );
  }

  // Display when no data is found
  if (!receipt) {
    return (
      <div className="max-w-2xl mx-auto p-6 text-center">
        <p className="text-gray-600">Không tìm thấy dữ liệu cho phiếu thu này.</p>
         <button
          type="button"
          onClick={handleBack}
          className="mt-4 flex items-center justify-center mx-auto space-x-1 px-4 py-2 border border-gray-300 rounded-md bg-white hover:bg-gray-50"
        >
          <ArrowLeft size={16} />
          <span className="text-sm text-gray-700">Quay lại</span>
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <Toaster position="top-right" />

      <div className="flex justify-between items-center mb-6 border-b pb-4">
        <h1 className="text-2xl font-bold text-gray-800">
          Chi tiết Phiếu Thu
        </h1>
        <button
          type="button"
          onClick={handleBack}
          className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg bg-white hover:bg-gray-100 transition-colors duration-200"
        >
          <ArrowLeft size={16} />
          <span className="text-sm font-medium text-gray-700">Quay lại</span>
        </button>
      </div>

      {/* Display-only information fields */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5">
        
        {/* Agency Name */}
        <div className="col-span-1">
          <label className="block text-sm font-medium text-gray-500 mb-1">
            Tên đại lý
          </label>
          <p className="w-full px-3 py-2 bg-gray-50 rounded-md text-gray-900 text-sm min-h-[40px] flex items-center">
            {receipt.agency.name}
          </p>
        </div>

        {/* Address */}
        <div className="col-span-1">
          <label className="block text-sm font-medium text-gray-500 mb-1">
            Địa chỉ
          </label>
          <p className="w-full px-3 py-2 bg-gray-50 rounded-md text-gray-900 text-sm min-h-[40px] flex items-center">
            {receipt.agency.address}
          </p>
        </div>

        {/* Phone */}
        <div className="col-span-1">
          <label className="block text-sm font-medium text-gray-500 mb-1">
            Điện thoại
          </label>
          <p className="w-full px-3 py-2 bg-gray-50 rounded-md text-gray-900 text-sm min-h-[40px] flex items-center">
            {receipt.agency.phone}
          </p>
        </div>

        {/* Email */}
        <div className="col-span-1">
          <label className="block text-sm font-medium text-gray-500 mb-1">
            Email
          </label>
          <p className="w-full px-3 py-2 bg-gray-50 rounded-md text-gray-900 text-sm min-h-[40px] flex items-center">
            {receipt.agency.email || '(Không có)'}
          </p>
        </div>

        {/* Receipt Date */}
        <div className="col-span-1">
          <label className="block text-sm font-medium text-gray-500 mb-1">
            Ngày thu tiền
          </label>
          <p className="w-full px-3 py-2 bg-gray-50 rounded-md text-gray-900 text-sm min-h-[40px] flex items-center">
            {new Date(receipt.ngay_thu).toLocaleDateString('vi-VN')}
          </p>
        </div>

        {/* Amount */}
        <div className="col-span-1">
          <label className="block text-sm font-medium text-gray-500 mb-1">
            Số tiền thu
          </label>
          <p className="w-full px-3 py-2 bg-gray-50 rounded-md text-gray-900 text-sm font-semibold min-h-[40px] flex items-center">
            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(receipt.so_tien_thu)}
          </p>
        </div>
      </div>
    </div>
  );
}