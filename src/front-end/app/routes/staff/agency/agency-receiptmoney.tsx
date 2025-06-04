// src/front-end/app/routes/admin/receipt-form.tsx
import React, { useState, useEffect } from 'react';
import { RefreshCw } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

// Bỏ comment các dòng import service thật khi bạn có API
import { getAgencies, fetchAgencyByIdAPI, type Agency } from '../../../services/agencyService';
// import { createReceipt, type ReceiptInput } from '../../../services/receiptService';

// --- BEGIN MOCK DATA AND SERVICES ---

export type ReceiptInput = {
  agencyId: string;
  date: string; // ISO string yyyy-MM-dd
  amount: number;
};




// Mock service createReceipt
const createReceipt = async (payload: ReceiptInput): Promise<{ id: string } & ReceiptInput> => {
  console.log('MOCK: createReceipt called with payload:', payload);
  return new Promise(resolve => {
    setTimeout(() => {
      // Giả lập việc tạo thành công và trả về receipt đã tạo (có thể có thêm ID)
      const newReceipt = {
        id: `mock_receipt_${Date.now()}`,
        ...payload,
      };
      console.log('MOCK: Receipt created:', newReceipt);
      resolve(newReceipt);
    }, 1000); // Giả lập độ trễ mạng
  });
};
// --- END MOCK DATA AND SERVICES ---


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

  const [isLoadingAgencies, setIsLoadingAgencies] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Lấy danh sách đại lý khi component mount
  useEffect(() => {
    const fetchAgencies = async () => {
      setIsLoadingAgencies(true);
      try {
        const response = await getAgencies({ perPage: 1000, page: 1 }); // Sử dụng mock getAgencies
        setAgencies(response.agencies);
      } catch (err) {
        console.error("Error fetching mock agencies:", err);
        toast.error('Không thể tải danh sách đại lý (mock).');
      } finally {
        setIsLoadingAgencies(false);
      }
    };
    fetchAgencies();
  }, []);

  // Khi chọn đại lý, tự động điền địa chỉ, điện thoại, email
  useEffect(() => {
    if (!selectedAgencyId) {
      setAddress('');
      setPhone('');
      setEmail('');
      return;
    }
    const fetchAgencyDetail = async () => {
      try {
        const agency = await fetchAgencyByIdAPI(selectedAgencyId); // Sử dụng mock getAgencyById
        setAddress(agency.address || '');
        setPhone(agency.phone || '');
        setEmail(agency.email || '');
      } catch (err) {
        console.error("Error fetching mock agency detail:", err);
        toast.error('Không thể lấy thông tin đại lý (mock).');
      }
    };
    fetchAgencyDetail();
  }, [selectedAgencyId]);

  useEffect(() => {
  setReceiptDate(new Date().toISOString().split('T')[0]);
}, []);


  // Xử lý reset form
  const handleReset = () => {
    setSelectedAgencyId('');
    setAddress('');
    setPhone('');
    setEmail('');
    setReceiptDate(new Date().toISOString().split('T')[0]);
    setAmount('');
    toast.success('Form đã được đặt lại.');
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
    if (amount === '' || amount <= 0) {
      toast.error('Vui lòng nhập số tiền thu hợp lệ.');
      return;
    }

    const payload: ReceiptInput = {
      agencyId: selectedAgencyId,
      date: receiptDate,
      amount: Number(amount),
    };

    setIsSubmitting(true);
    try {
      await createReceipt(payload); // Sử dụng mock createReceipt
      toast.success('Lưu phiếu thu thành công (mock).');
      handleReset();
    } catch (err) {
      console.error("Error creating mock receipt:", err);
      toast.error('Lỗi khi lưu phiếu thu (mock).');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <Toaster position="top-right" />

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">Phiếu thu tiền </h1>
        <button
          type="button"
          onClick={handleReset}
          className="flex items-center space-x-1 px-3 py-2 border border-gray-300 rounded-md bg-yellow hover:bg-gray-50"
          disabled={isSubmitting}
        >
          <RefreshCw size={16} />
          <span className="text-sm text-black-700">Đặt lại</span>
        </button>
      </div>

      <form onSubmit={(e) => { e.preventDefault(); handleSave(); }}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
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
            {isLoadingAgencies && <p className="text-xs text-gray-500 mt-1">Đang tải danh sách đại lý...</p>}
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
              className="block w-full px-3 py-2 border border-gray-300 bg-gray-50 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
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
              className="block w-full px-3 py-2 border border-gray-300 bg-gray-50 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
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
              className="block w-full px-3 py-2 border border-gray-300 bg-gray-50 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
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
          <div className="col-span-1">
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
              placeholder="Số tiền thu"
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              disabled={isSubmitting}
              min="0" // Thêm để trình duyệt hỗ trợ validation
            />
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            type="submit"
            className="px-6 py-2 bg-gray-800 text-white text-sm font-medium rounded-md hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-700 disabled:opacity-50"
            disabled={isSubmitting || isLoadingAgencies} // Thêm isLoadingAgencies để disable nút khi đang tải
          >
            {isSubmitting ? 'Đang lưu...' : 'Lưu'}
          </button>
        </div>
      </form>
    </div>
  );
}