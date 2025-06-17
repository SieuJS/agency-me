import React, { useState, useEffect } from 'react';
import {
  getRegulation,
  updateRegulation,
  type RegulationOutput
} from '../../../services/regulationService';
import { toast, Toaster } from 'react-hot-toast';

export default function RegulationContent() {
  const [data, setData] = useState<RegulationOutput | null>(null);
  const [maxAgencyTypes, setMaxAgencyTypes] = useState<number | null>(null);
  const [maxAgenciesPerDistrict, setMaxAgenciesPerDistrict] = useState<number | null>(null);
  const [errors, setErrors] = useState({ types: '', agencies: '' });
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch quy định gốc từ server
  const fetchRegulation = async () => {
    setIsLoading(true);
    setErrors({ types: '', agencies: '' });
    try {
      const res = await getRegulation();
      if (res && typeof res === 'object') {
        setData(res);
        setMaxAgencyTypes(res.so_luong_cac_loai_daily ?? 0);
        setMaxAgenciesPerDistrict(res.so_dai_ly_toi_da_trong_quan ?? 0);
      } else {
        setData(null);
        toast.error('Phản hồi từ máy chủ không hợp lệ.');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Không thể tải dữ liệu quy định.';
      toast.error(errorMessage);
      setData(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRegulation();
  }, []);

  // Validation
  const validateTypes = (value: number): string => {
    if (value < 0) return 'Số loại đại lý không được âm.';
    if (data && value < data.so_luong_cac_loai_daily) {
      return `Hiện có ${data.so_luong_cac_loai_daily} loại đại lý. Cần nhập số lớn hơn ${data.so_luong_cac_loai_daily} hoặc nhập ${data.so_luong_cac_loai_daily} để giữ nguyên.`;
    }
    return '';
  };

  const validateAgencies = (value: number): string => {
    if (value < 0) return 'Số đại lý không được âm.';
    if (data && value < data.so_dai_ly_toi_da_trong_quan) {
      return `Hiện mỗi quận có ${data.so_dai_ly_toi_da_trong_quan} đại lý. Cần nhập số lớn hơn ${data.so_dai_ly_toi_da_trong_quan} hoặc nhập ${data.so_dai_ly_toi_da_trong_quan} để giữ nguyên.`;
    }
    return '';
  };

  // CHỈNH SỬA: tách nhánh null trước khi gọi isNaN
  const handleTypesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;

    // Nếu input rỗng → set null, clear lỗi, return
    if (raw === '') {
      setMaxAgencyTypes(null);
      setErrors(prev => ({ ...prev, types: '' }));
      return;
    }

    // parse số và kiểm tra NaN
    const n = parseInt(raw, 10);
    if (isNaN(n)) {
      return; // ký tự không phải số
    }

    setMaxAgencyTypes(n);
    if (data) {
      setErrors(prev => ({ ...prev, types: validateTypes(n) }));
    }
  };

  const handleAgenciesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    if (raw === '') {
      setMaxAgenciesPerDistrict(null);
      setErrors(prev => ({ ...prev, agencies: '' }));
      return;
    }

    const n = parseInt(raw, 10);
    if (isNaN(n)) {
      return;
    }

    setMaxAgenciesPerDistrict(n);
    if (data) {
      setErrors(prev => ({ ...prev, agencies: validateAgencies(n) }));
    }
  };

  // Submit cập nhật lên server
  const handleSubmit = async () => {
    if (!data) {
      toast.error('Dữ liệu gốc chưa được tải. Không thể cập nhật.');
      return;
    }

    const typesValue = maxAgencyTypes ?? 0;
    const agenciesValue = maxAgenciesPerDistrict ?? 0;

    // Validate lại
    const typeError = validateTypes(typesValue);
    const agencyError = validateAgencies(agenciesValue);
    setErrors({ types: typeError, agencies: agencyError });
    if (typeError || agencyError) {
      toast.error('Vui lòng sửa các lỗi trước khi cập nhật.');
      return;
    }

    // Kiểm tra có thay đổi hay không
    const typesChanged = typesValue !== data.so_luong_cac_loai_daily;
    const agenciesChanged = agenciesValue !== data.so_dai_ly_toi_da_trong_quan;
    if (!typesChanged && !agenciesChanged) {
      toast('Không có thay đổi để cập nhật.', { icon: 'ℹ️', duration: 3000 });
      return;
    }

    // Thực hiện cập nhật
    setIsSubmitting(true);
    try {
      const promises: Promise<any>[] = [];

      if (typesChanged) {
        promises.push(updateRegulation({ key: 'so_luong_cac_loai_daily', value: typesValue }));
      }
      if (agenciesChanged) {
        promises.push(updateRegulation({ key: 'so_dai_ly_toi_da_trong_quan', value: agenciesValue }));
      }
      await Promise.all(promises);
      toast.success('Cập nhật thành công!', { duration: 3000 });
      await fetchRegulation();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Đã xảy ra lỗi khi cập nhật.';
      toast.error(errorMessage, { duration: 3000 });
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- Render ---
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-10 w-full max-w-[1000px] mx-auto bg-[#f7f8fa]">
        <h2 className="text-2xl font-bold mb-12 text-center text-black">
          Quy định về số loại đại lý, số đại lý tối đa trong quận
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
          Quy định về số loại đại lý, số đại lý tối đa trong quận
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
        Quy định về số loại đại lý, số đại lý tối đa trong quận
      </h2>

      <div className="flex flex-col gap-10 w-full max-w-lg">
        {/* Số loại đại lý */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:gap-4">
          <label
            htmlFor="maxAgencyTypesInput"
            className="text-base sm:text-lg w-full sm:w-[260px] text-left sm:text-right mb-1 sm:mb-0 sm:mt-1 shrink-0"
          >
            Số loại đại lý tối đa:
          </label>
          <div className="flex flex-col items-start w-full sm:w-auto">
            <input
              id="maxAgencyTypesInput"
              type="number"
              value={maxAgencyTypes === null ? '' : maxAgencyTypes}
              onChange={handleTypesChange}
              className={`border rounded px-3 py-2 w-24 text-center text-lg ${
                errors.types ? 'border-red-500' : 'border-gray-300'
              } ${isSubmitting ? 'bg-gray-100 cursor-not-allowed' : ''}`}
              min="0"
              disabled={isSubmitting}
            />
            <div className="text-red-500 text-sm mt-1 min-h-[1.25rem] w-full max-w-[280px]">
              {errors.types}
            </div>
          </div>
        </div>

        {/* Số đại lý mỗi quận */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:gap-4">
          <label
            htmlFor="maxAgenciesPerDistrictInput"
            className="text-base sm:text-lg w-full sm:w-[260px] text-left sm:text-right mb-1 sm:mb-0 sm:mt-1 shrink-0"
          >
            Số đại lý tối đa trong mỗi quận:
          </label>
          <div className="flex flex-col items-start w-full sm:w-auto">
            <input
              id="maxAgenciesPerDistrictInput"
              type="number"
              value={maxAgenciesPerDistrict === null ? '' : maxAgenciesPerDistrict}
              onChange={handleAgenciesChange}
              className={`border rounded px-3 py-2 w-24 text-center text-lg ${
                errors.agencies ? 'border-red-500' : 'border-gray-300'
              } ${isSubmitting ? 'bg-gray-100 cursor-not-allowed' : ''}`}
              min="0"
              disabled={isSubmitting}
            />
            <div className="text-red-500 text-sm mt-1 min-h-[1.25rem] w-full max-w-[280px]">
              {errors.agencies}
            </div>
          </div>
        </div>

        {/* Nút cập nhật */}
        <div className="flex justify-center mt-6 sm:mt-8">
          <button
            onClick={handleSubmit}
            className="px-10 py-3 bg-slate-600 hover:bg-slate-700 text-white text-lg rounded shadow disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isSubmitting || !!errors.types || !!errors.agencies}
          >
            {isSubmitting ? 'Đang cập nhật...' : 'Cập nhật'}
          </button>
        </div>
      </div>

      <Toaster position="top-right" />
    </div>
  );
}
