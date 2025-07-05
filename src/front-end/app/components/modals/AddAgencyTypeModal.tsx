// src/front-end/app/components/modals/AddAgencyTypeModal.tsx

import { useState, useEffect } from 'react'; // Thêm useEffect
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Dialog } from '../ui/Dialog';
import { createAgencyTypeAPI, type AgencyTypeCreatePayload } from '../../services/agencyService'; 
import toast from 'react-hot-toast';

interface AddAgencyTypeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function AddAgencyTypeModal({ isOpen, onClose, onSuccess }: AddAgencyTypeModalProps) {
  const [typeName, setTypeName] = useState('');
  const [maxDebt, setMaxDebt] = useState('');
  const [errors, setErrors] = useState<{ typeName?: string; maxDebt?: string }>({});
  const [isLoading, setIsLoading] = useState(false);

  // --- THAY ĐỔI CHÍNH 1: VALIDATE TÊN LOẠI ĐẠI LÝ REAL-TIME ---
  useEffect(() => {
    // Chỉ validate sau khi người dùng đã bắt đầu nhập
    if (typeName) {
      if (!typeName.trim()) {
        setErrors(prevErrors => ({
          ...prevErrors,
          typeName: 'Tên không được chứa toàn khoảng trắng.'
        }));
      } else {
        // Nếu hợp lệ, xóa lỗi cho trường này
        setErrors(prevErrors => {
          const { typeName, ...rest } = prevErrors;
          return rest;
        });
      }
    } else {
      // Nếu người dùng xóa hết, cũng xóa lỗi
      setErrors(prevErrors => {
        const { typeName, ...rest } = prevErrors;
        return rest;
      });
    }
  }, [typeName]);

  // --- THAY ĐỔI CHÍNH 2: VALIDATE TIỀN NỢ TỐI ĐA REAL-TIME ---
  useEffect(() => {
    // Chỉ validate sau khi người dùng đã bắt đầu nhập
    if (maxDebt) {
      const debtValue = Number(maxDebt);
      if (isNaN(debtValue) || debtValue < 0) {
        setErrors(prevErrors => ({
          ...prevErrors,
          maxDebt: 'Tiền nợ tối đa phải là một số không âm.'
        }));
      } else {
        // Nếu hợp lệ, xóa lỗi cho trường này
        setErrors(prevErrors => {
          const { maxDebt, ...rest } = prevErrors;
          return rest;
        });
      }
    } else {
      // Nếu người dùng xóa hết, cũng xóa lỗi
      setErrors(prevErrors => {
        const { maxDebt, ...rest } = prevErrors;
        return rest;
      });
    }
  }, [maxDebt]);

  // Hàm validate tổng thể để kiểm tra lần cuối trước khi submit
  const validateOnSubmit = () => {
    const newErrors: { typeName?: string; maxDebt?: string } = {};
    if (!typeName.trim()) {
      newErrors.typeName = 'Tên loại đại lý không được để trống.';
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
    // Vẫn gọi validate lần cuối để bắt trường hợp người dùng chưa nhập gì đã bấm Lưu
    if (!validateOnSubmit()) return;
    
    setIsLoading(true);

    try {
      const payload: AgencyTypeCreatePayload = { 
        ten_loai: typeName.trim(),
        tien_no_toi_da: Number(maxDebt) 
      };
      
      await createAgencyTypeAPI(payload);
      
      toast.success('Thêm loại đại lý thành công!');
      onSuccess(); 
      handleClose();
      
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Lỗi không xác định.';
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setTypeName('');
    setMaxDebt('');
    setErrors({});
    onClose();
  };

  return (
    <Dialog isOpen={isOpen} onClose={handleClose} title="Thêm Loại Đại Lý Mới">
      <form onSubmit={handleSubmit} noValidate>
        <div className="p-4 space-y-4">
          <Input
            label="Tên loại đại lý"
            id="newAgencyTypeName"
            value={typeName}
            onChange={(e) => setTypeName(e.target.value)}
            error={errors.typeName}
            disabled={isLoading}
            required
            autoFocus
          />
          <Input
            label="Tiền nợ tối đa"
            id="maxDebt"
            type="number"
            value={maxDebt}
            onChange={(e) => setMaxDebt(e.target.value)}
            error={errors.maxDebt}
            disabled={isLoading}
            required
            min="0"
          />
          <div className="mt-6 flex justify-end gap-4">
            <Button type="button" onClick={handleClose} disabled={isLoading}>
              Hủy
            </Button>
            <Button type="submit" isLoading={isLoading} disabled={isLoading}>
              Lưu
            </Button>
          </div>
        </div>
      </form>
    </Dialog>
  );
}