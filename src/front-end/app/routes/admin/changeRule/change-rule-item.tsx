import React, { useState, useEffect } from 'react';
import {
  getRegulation,
  updateRegulation,
  type RegulationOutput
} from '../../../services/regulationService';
import { toast, Toaster } from 'react-hot-toast';

export default function RegulationItemsContent() {
  const [data, setData] = useState<RegulationOutput | null>(null);
  const [maxItems, setMaxItems] = useState<number | null>(null);
  const [maxUnits, setMaxUnits] = useState<number | null>(null);
  const [errors, setErrors] = useState({ items: '', units: '' });
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchRegulation = async () => {
    setIsLoading(true);
    setErrors({ items: '', units: '' });
    try {
      const res = await getRegulation();
      setData(res);
      setMaxItems(res.so_luong_mat_hang_toi_da ?? 0);
      setMaxUnits(res.so_luong_don_vi_tinh ?? 0);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Không thể tải dữ liệu quy định.');
      setData(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRegulation();
  }, []);

  const validateItems = (v: number): string => {
    if (v < 0) return 'Số mặt hàng không được âm.';
    if (data && v < data.so_luong_mat_hang_toi_da) {
      return `Hiện đang có ${data.so_luong_mat_hang_toi_da} mặt hàng. Cần nhập số lớn hơn ${data.so_luong_mat_hang_toi_da} hoặc nhập ${data.so_luong_mat_hang_toi_da} để giữ nguyên.`;
    }
    return '';
  };
  const validateUnits = (v: number): string => {
    if (v < 0) return 'Số đơn vị tính không được âm.';
    if (data && v < data.so_luong_don_vi_tinh) {
      return `Hiện đang có ${data.so_luong_don_vi_tinh} đơn vị tính. Cần nhập số lớn hơn ${data.so_luong_don_vi_tinh} hoặc nhập ${data.so_luong_don_vi_tinh} để giữ nguyên.`;
    }
    return '';
  };

  const handleItemsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    if (raw === '') {
      setMaxItems(null);
      setErrors(prev => ({ ...prev, items: '' }));
      return;
    }
    const n = parseInt(raw, 10);
    if (isNaN(n)) return;
    setMaxItems(n);
    setErrors(prev => ({ ...prev, items: validateItems(n) }));
  };

  const handleUnitsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    if (raw === '') {
      setMaxUnits(null);
      setErrors(prev => ({ ...prev, units: '' }));
      return;
    }
    const n = parseInt(raw, 10);
    if (isNaN(n)) return;
    setMaxUnits(n);
    setErrors(prev => ({ ...prev, units: validateUnits(n) }));
  };

  const handleSubmit = async () => {
    if (!data) {
      toast.error('Dữ liệu gốc chưa được tải. Không thể cập nhật.');
      return;
    }
    const itemsValue = maxItems ?? 0;
    const unitsValue = maxUnits ?? 0;
    const errItems = validateItems(itemsValue);
    const errUnits = validateUnits(unitsValue);
    setErrors({ items: errItems, units: errUnits });
    if (errItems || errUnits) {
      toast.error('Vui lòng sửa các lỗi trước khi cập nhật.');
      return;
    }

    const itemsChanged = itemsValue !== data.so_luong_mat_hang_toi_da;
    const unitsChanged = unitsValue !== data.so_luong_don_vi_tinh;
    if (!itemsChanged && !unitsChanged) {
      toast('Không có thay đổi để cập nhật.', { icon: 'ℹ️', duration: 3000 });
      return;
    }

    setIsSubmitting(true);
    try {
      const promises: Promise<any>[] = [];
      if (itemsChanged) {
        promises.push(
          updateRegulation({ key: 'so_luong_mat_hang_toi_da', value: itemsValue })
        );
      }
      if (unitsChanged) {
        promises.push(
          updateRegulation({ key: 'so_luong_don_vi_tinh', value: unitsValue })
        );
      }
      await Promise.all(promises);
      toast.success('Cập nhật thành công!', { duration: 3000 });
      await fetchRegulation();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Đã xảy ra lỗi khi cập nhật.', {
        duration: 3000
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-10 w-full max-w-[1000px] mx-auto bg-[#f7f8fa]">
        <h2 className="text-2xl font-bold mb-12 text-center text-black">
          Quy định về số lượng mặt hàng và đơn vị tính
        </h2>
        <p className="text-lg">Đang tải dữ liệu...</p>
        <Toaster position="top-right" />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex flex-col items-center justify-center py-10 w-full max-w-[1000px] mx-auto bg-[#f7f8fa]">
        <h2 className="text-2xl font-bold mb-12 text-center text-black">
          Quy định về số lượng mặt hàng và đơn vị tính
        </h2>
        <p className="text-lg text-red-500">Không thể tải dữ liệu. Vui lòng thử lại.</p>
        <button
          onClick={fetchRegulation}
          className="mt-4 px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded"
        >
          Thử lại
        </button>
        <Toaster position="top-right" />
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center py-10 w-full max-w-[1000px] mx-auto bg-[#f7f8fa]">
      <h2 className="text-2xl font-bold mb-12 text-center text-black">
        Quy định về số lượng mặt hàng và đơn vị tính
      </h2>

      <div className="flex flex-col gap-10 w-full max-w-lg">
        {/* Số mặt hàng tối đa */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:gap-4">
          <label
            htmlFor="maxItemsInput"
            className="text-base sm:text-lg w-full sm:w-[260px] text-left sm:text-right mb-1 sm:mb-0 sm:mt-1 shrink-0"
          >
            Số mặt hàng tối đa:
          </label>
          <div className="flex flex-col items-start w-full sm:w-auto">
            <input
              id="maxItemsInput"
              type="number"
              value={maxItems === null ? '' : maxItems}
              onChange={handleItemsChange}
              className={`border rounded px-3 py-2 w-24 text-center text-lg ${
                errors.items ? 'border-red-500' : 'border-gray-300'
              } ${isSubmitting ? 'bg-gray-100 cursor-not-allowed' : ''}`}
              min="0"
              disabled={isSubmitting}
            />
            <div className="text-red-500 text-sm mt-1 min-h-[1.25rem] w-full max-w-[280px]">
              {errors.items}
            </div>
          </div>
        </div>

        {/* Số đơn vị tính tối đa */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:gap-4">
          <label
            htmlFor="maxUnitsInput"
            className="text-base sm:text-lg w-full sm:w-[260px] text-left sm:text-right mb-1 sm:mb-0 sm:mt-1 shrink-0"
          >
            Số đơn vị tính tối đa:
          </label>
          <div className="flex flex-col items-start w-full sm:w-auto">
            <input
              id="maxUnitsInput"
              type="number"
              value={maxUnits === null ? '' : maxUnits}
              onChange={handleUnitsChange}
              className={`border rounded px-3 py-2 w-24 text-center text-lg ${
                errors.units ? 'border-red-500' : 'border-gray-300'
              } ${isSubmitting ? 'bg-gray-100 cursor-not-allowed' : ''}`}
              min="0"
              disabled={isSubmitting}
            />
            <div className="text-red-500 text-sm mt-1 min-h-[1.25rem] w-full max-w-[280px]">
              {errors.units}
            </div>
          </div>
        </div>

        {/* Nút cập nhật */}
        <div className="flex justify-center mt-6 sm:mt-8">
          <button
            onClick={handleSubmit}
            className="px-10 py-3 bg-slate-600 hover:bg-slate-700 text-white text-lg rounded shadow disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isSubmitting || !!errors.items || !!errors.units}
          >
            {isSubmitting ? 'Đang cập nhật...' : 'Cập nhật'}
          </button>
        </div>
      </div>
      <Toaster position="top-right" />
    </div>
  );
}
