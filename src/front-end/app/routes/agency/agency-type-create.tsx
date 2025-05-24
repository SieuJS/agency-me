// src/front-end/app/routes/admin/agency-type-create.tsx
import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import { createAgencyTypeAPI } from '../../services/agencyService';

export default function CreateAgencyTypePage() {
  const [name, setName] = useState('');
  const [maxDebt, setMaxDebt] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || maxDebt <= 0) {
      toast.error('Vui lòng nhập tên loại và tiền nợ tối đa hợp lệ.');
      return;
    }

    try {
      await createAgencyTypeAPI({
        ten_loai: name.trim(),
        tien_no_toi_da: maxDebt,
      });
      toast.success('Thêm loại đại lý thành công.');
      setName('');
      setMaxDebt(0);
    } catch (error: any) {
      console.error(error);
      toast.error(error?.message || 'Lỗi khi tạo loại đại lý.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded shadow">
      <h2 className="text-xl font-semibold text-gray-800 mb-6">Thêm Loại Đại Lý</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Tên loại đại lý</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-2 border rounded"
            placeholder="Nhập tên loại đại lý"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Tiền nợ tối đa</label>
          <input
            type="number"
            value={maxDebt}
            onChange={(e) => setMaxDebt(Number(e.target.value))}
            className="w-full px-4 py-2 border rounded"
            placeholder="Nhập số tiền nợ tối đa"
            min={0}
            required
          />
        </div>

        <div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {isSubmitting ? 'Đang lưu...' : 'Tạo loại đại lý'}
          </button>
        </div>
      </form>
    </div>
  );
}
