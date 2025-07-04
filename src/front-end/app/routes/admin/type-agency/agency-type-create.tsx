// src/front-end/app/routes/admin/agency-type-create.tsx

import React, { useState, useEffect, type FormEvent } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { createAgencyTypeAPI, type AgencyTypeCreatePayload } from '../../../services/agencyService';
import { Button } from '../../../components/ui/Button'; // Sử dụng Button component để đồng bộ
import { Input } from '../../../components/ui/Input';   // Sử dụng Input component để đồng bộ

export default function CreateAgencyTypePage() {
  const [name, setName] = useState('');
  // --- THAY ĐỔI 1: Lưu maxDebt dưới dạng string để xử lý input dễ dàng hơn ---
  const [maxDebt, setMaxDebt] = useState('');
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  // --- THAY ĐỔI 2: Thêm state để quản lý lỗi của từng trường ---
  const [errors, setErrors] = useState<{ name?: string; maxDebt?: string }>({});

  const toastOptions = {
    duration: 3000,
    position: 'top-right' as const,
  };

  // --- THAY ĐỔI 3: Thêm useEffect để validate Tên loại đại lý real-time ---
  useEffect(() => {
    // Chỉ validate sau khi người dùng đã bắt đầu nhập
    if (name) {
      if (!name.trim()) {
        setErrors(prev => ({ ...prev, name: 'Tên không được chứa toàn khoảng trắng.' }));
      } else {
        // Nếu hợp lệ, xóa lỗi cho trường này
        setErrors(prev => {
          const { name, ...rest } = prev;
          return rest;
        });
      }
    } else {
      // Nếu người dùng xóa hết chữ, cũng xóa lỗi
      setErrors(prev => {
        const { name, ...rest } = prev;
        return rest;
      });
    }
  }, [name]);

  // --- THAY ĐỔI 4: Thêm useEffect để validate Tiền nợ tối đa real-time ---
  useEffect(() => {
    // Chỉ validate sau khi người dùng đã bắt đầu nhập
    if (maxDebt) {
      const debtValue = Number(maxDebt);
      if (isNaN(debtValue) || debtValue < 0) {
        setErrors(prev => ({ ...prev, maxDebt: 'Tiền nợ tối đa phải là một số không âm.' }));
      } else {
        // Nếu hợp lệ, xóa lỗi cho trường này
        setErrors(prev => {
          const { maxDebt, ...rest } = prev;
          return rest;
        });
      }
    } else {
       // Nếu người dùng xóa hết chữ, cũng xóa lỗi
       setErrors(prev => {
        const { maxDebt, ...rest } = prev;
        return rest;
      });
    }
  }, [maxDebt]);

  // Hàm validate lần cuối trước khi submit
  const validateOnSubmit = (): boolean => {
    const newErrors: { name?: string; maxDebt?: string } = {};
    if (!name.trim()) {
      newErrors.name = 'Tên loại đại lý không được để trống.';
    }
    if (!maxDebt.trim()) {
      newErrors.maxDebt = 'Tiền nợ tối đa không được để trống.';
    } else if (Number(maxDebt) < 0) {
      newErrors.maxDebt = 'Tiền nợ tối đa phải là một số không âm.';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateOnSubmit()) {
      toast.error('Vui lòng kiểm tra lại thông tin đã nhập.', toastOptions);
      return;
    }

    setIsSubmitting(true);
    try {
      const payload: AgencyTypeCreatePayload = {
        ten_loai: name.trim(),
        tien_no_toi_da: Number(maxDebt),
      };

      await createAgencyTypeAPI(payload);
      toast.success('Thêm loại đại lý thành công.', toastOptions);
      setName('');
      setMaxDebt(''); // Reset về chuỗi rỗng
      setErrors({});   // Xóa tất cả lỗi
    } catch (error: any) {
      const errMsg = error?.response?.data?.message || 'Lỗi khi tạo loại đại lý.';
      toast.error(errMsg, toastOptions);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Nút submit sẽ bị vô hiệu hóa nếu đang gửi, hoặc có lỗi, hoặc các trường bắt buộc chưa điền
  const isButtonDisabled = isSubmitting || !name.trim() || !maxDebt.trim() || Object.keys(errors).length > 0;

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded shadow">
      <Toaster toastOptions={toastOptions} />

      <h2 className="text-xl font-semibold text-gray-800 mb-6">Thêm Loại Đại Lý</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* --- THAY ĐỔI 5: Sử dụng component Input đã có để hiển thị lỗi --- */}
        <Input
          label="Tên loại đại lý"
          id="agencyTypeName"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          error={errors.name}
          disabled={isSubmitting}
          placeholder="Nhập tên loại đại lý"
          required
        />

        <Input
          label="Tiền nợ tối đa"
          id="maxDebt"
          type="number"
          value={maxDebt}
          onChange={(e) => setMaxDebt(e.target.value)}
          error={errors.maxDebt}
          disabled={isSubmitting}
          placeholder="Nhập số tiền nợ tối đa"
          min={0}
          required
        />

        <div className="flex justify-center pt-4">
          <Button
            type="submit"
            isLoading={isSubmitting}
            disabled={isButtonDisabled}
          >
            Tạo loại đại lý
          </Button>
        </div>
      </form>
    </div>
  );
}