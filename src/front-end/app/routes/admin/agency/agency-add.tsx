// src/front-end/app/routes/admin/agency-reception.tsx

// Thêm useCallback vào import
import { useEffect, useState, type FormEvent, useCallback } from 'react';
import { useNavigate } from 'react-router';

import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

import toast, { Toaster } from 'react-hot-toast';

import { Input } from '../../../components/ui/Input';
import { Button } from '../../../components/ui/Button';

import {
  addAgency,
  fetchAgencyTypesAPI,
  fetchDistrictsAPI,
  type AddAgencyPayload,
} from '../../../services/agencyService';

// Import component modal đã tạo
import { AddAgencyTypeModal } from '../../../components/modals/AddAgencyTypeModal';

export default function AgencyReceptionPage() {
  const navigate = useNavigate();

  // --- State cho các trường nhập liệu ---
  const [agencyName, setAgencyName] = useState('');
  const [agencyType, setAgencyType] = useState('');
  const [district, setDistrict] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [filingDate, setFilingDate] = useState<Date | null>(new Date());

  // --- State cho validation và trạng thái xử lý ---
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isLoading, setIsLoading] = useState(false);
  const [agencyTypesFromAPI, setAgencyTypesFromAPI] = useState<
    { loai_daily_id: string; ten_loai: string }[]
  >([]);
  const [districtsFromAPI, setDistrictsFromAPI] = useState<
    { districtId: string; name: string }[]
  >([]);
  const [isAgencyTypesLoading, setIsAgencyTypesLoading] = useState(true);
  const [isDistrictsLoading, setIsDistrictsLoading] = useState(true);

  // --- State để quản lý việc mở/đóng modal ---
  const [isAddTypeModalOpen, setIsAddTypeModalOpen] = useState(false);

  const toastOptions = {
    duration: 3000,
    position: 'top-right' as const,
  };

  // --- Tách logic tải dữ liệu ra hàm riêng để tái sử dụng ---
  const fetchAgencyTypes = useCallback(async () => {
    try {
      setIsAgencyTypesLoading(true);
      const types = await fetchAgencyTypesAPI();
      setAgencyTypesFromAPI(types);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Lỗi tải loại đại lý.',
        toastOptions
      );
    } finally {
      setIsAgencyTypesLoading(false);
    }
  }, []); // Dependency rỗng vì không phụ thuộc props/state

  const fetchDistricts = useCallback(async () => {
    try {
      setIsDistrictsLoading(true);
      const districtsData = await fetchDistrictsAPI();
      setDistrictsFromAPI(districtsData);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Lỗi tải danh sách quận.',
        toastOptions
      );
    } finally {
      setIsDistrictsLoading(false);
    }
  }, []); // Dependency rỗng

  // useEffect để tải dữ liệu ban đầu khi component được render
  useEffect(() => {
    fetchAgencyTypes();
    fetchDistricts();
  }, [fetchAgencyTypes, fetchDistricts]);

  // --- Hàm Validation ---
  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    if (!agencyName.trim()) newErrors.agencyName = 'Tên đại lý không được để trống.';
    if (!agencyType) newErrors.agencyType = 'Loại đại lý không được để trống.';
    if (!district) newErrors.district = 'Quận không được để trống.';
    if (!address.trim()) newErrors.address = 'Địa chỉ không được để trống.';
    if (!phone) newErrors.phone = 'Điện thoại không được để trống.';
    else if (!/^0\d{9}$/.test(phone)) newErrors.phone = 'Số điện thoại không hợp lệ.';
    if (!email) newErrors.email = 'Email không được để trống.';
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = 'Email không hợp lệ.';
    if (!filingDate) newErrors.filingDate = 'Ngày lập phiếu không được để trống.';
    else {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const inputDate = new Date(filingDate);
      inputDate.setHours(0, 0, 0, 0);
      if (inputDate > today) newErrors.filingDate = 'Ngày lập phiếu không được lớn hơn ngày hiện tại.';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // --- Submit Handler ---
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!validateForm()) {
      toast.error('Vui lòng kiểm tra lại các trường bị lỗi.', toastOptions);
      return;
    }
    setIsLoading(true);

    const defaultNhanVienTiepNhanId = 'nv003';
    const defaultTienNo = 0;

    const agencyData: AddAgencyPayload = {
      ten: agencyName,
      loai_daily_id: agencyType,
      quan_id: district,
      dia_chi: address,
      dien_thoai: phone,
      email: email,
      ngay_tiep_nhan: (filingDate ?? new Date()).toISOString().split('T')[0],
      tien_no: defaultTienNo,
      nhan_vien_tiep_nhan: defaultNhanVienTiepNhanId,
    };

    try {
      await addAgency(agencyData);
      toast.success('Lưu hồ sơ đại lý thành công.', toastOptions);
      resetForm();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Đã có lỗi xảy ra khi lưu hồ sơ.';
      toast.error(message, toastOptions);
    } finally {
      setIsLoading(false);
    }
  };

  // --- Hàm reset form ---
  const resetForm = () => {
    setAgencyName(''); setAgencyType(''); setDistrict(''); setAddress('');
    setPhone(''); setEmail(''); setFilingDate(new Date()); setErrors({});
  };

  // --- Hàm xử lý khi thêm loại đại lý thành công từ modal ---
  const handleTypeAddedSuccess = () => {
    fetchAgencyTypes(); // Tải lại danh sách
    setIsAddTypeModalOpen(false); // Đóng modal
    setAgencyType(''); // Reset dropdown

  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <Toaster toastOptions={toastOptions} />

      {/* Render Modal: Nó sẽ ẩn/hiện dựa trên state isAddTypeModalOpen */}
      <AddAgencyTypeModal
        isOpen={isAddTypeModalOpen}
        onClose={() => setIsAddTypeModalOpen(false)}
        onSuccess={handleTypeAddedSuccess}
      />

      <h2 className="text-2xl font-semibold text-gray-800 mb-6">Hồ sơ đại lý</h2>
      <form onSubmit={handleSubmit} noValidate>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Tên đại lý */}
          <div className="md:col-span-2">
            <Input label="Tên đại lý" id="agencyName" name="agencyName" type="text" value={agencyName} onChange={(e) => setAgencyName(e.target.value)} error={errors.agencyName} disabled={isLoading} required />
          </div>

          {/* Loại đại lý */}
          <div>
            <label htmlFor="agencyType" className="block text-sm font-medium text-gray-700 mb-1">Loại đại lý</label>
            <div className="flex items-end gap-2">
              <select id="agencyType" name="agencyType" value={agencyType} onChange={(e) => setAgencyType(e.target.value)} disabled={isLoading || isAgencyTypesLoading} required className={`flex-grow mt-1 block w-full rounded-md border ${errors.agencyType ? 'border-red-500' : 'border-gray-300'} shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 h-[42px]`}>
                <option value="" disabled hidden>{isAgencyTypesLoading ? 'Đang tải...' : '-- Chọn loại đại lý --'}</option>
                {!isAgencyTypesLoading && agencyTypesFromAPI.map((type) => (
                  <option key={type.loai_daily_id} value={type.loai_daily_id}>{type.ten_loai}</option>
                ))}
              </select>
              <Button type="button" onClick={() => setIsAddTypeModalOpen(true)} disabled={isLoading || isAgencyTypesLoading} className="p-2 h-[42px] w-auto">
                Thêm
              </Button>
            </div>
            {errors.agencyType && <p className="mt-1 text-xs text-red-600">{errors.agencyType}</p>}
          </div>

          {/* Ngày tiếp nhận */}
          <div>
            <label htmlFor="filingDate" className="block text-sm font-medium text-gray-700 mb-1">Ngày tiếp nhận</label>
            <DatePicker id="filingDate" selected={filingDate} onChange={(date: Date | null) => setFilingDate(date)} dateFormat="dd/MM/yyyy" className={`mt-1 block w-full rounded-md border ${errors.filingDate ? 'border-red-500' : 'border-gray-300'} shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2`} disabled={isLoading} required />
            {errors.filingDate && <p className="mt-1 text-xs text-red-600">{errors.filingDate}</p>}
          </div>

          {/* Quận */}
          <div>
            <label htmlFor="district" className="block text-sm font-medium text-gray-700 mb-1">Quận <span className="text-red-500">*</span></label>
            <select id="district" name="district" value={district} onChange={(e) => setDistrict(e.target.value)} disabled={isLoading || isDistrictsLoading} required className={`mt-1 block w-full rounded-md border ${errors.district ? 'border-red-500' : 'border-gray-300'} shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 h-[42px]`}>
              <option value="" disabled hidden>{isDistrictsLoading ? 'Đang tải...' : '-- Chọn quận --'}</option>
              {!isDistrictsLoading && districtsFromAPI.map((dist) => (
                <option key={dist.districtId} value={dist.districtId}>{dist.name}</option>
              ))}
            </select>
            {errors.district && <p className="mt-1 text-xs text-red-600">{errors.district}</p>}
          </div>

          {/* Địa chỉ */}
          <div>
            <Input label="Địa chỉ" id="address" name="address" type="text" value={address} onChange={(e) => setAddress(e.target.value)} error={errors.address} disabled={isLoading} required />
          </div>

          {/* Điện thoại */}
          <div>
            <Input label="Điện thoại" id="phone" name="phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} error={errors.phone} disabled={isLoading} required />
          </div>

          {/* Email */}
          <div>
            <Input label="Email" id="email" name="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} error={errors.email} disabled={isLoading} />
          </div>
        </div>

        {/* Nút Lưu */}
        <div className="mt-8 text-right">
          <Button type="submit" isLoading={isLoading} disabled={isLoading}>
            Lưu
          </Button>
        </div>
      </form>
    </div>
  );
}