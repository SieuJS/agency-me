// src/front-end/app/routes/admin/agency-edit.tsx
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import toast, { Toaster } from 'react-hot-toast';
import {
  fetchAgencyByIdAPI,
  type Agency,
  fetchAgencyTypesAPI,
  fetchDistrictsAPI,
  updateAgencyByIdAPI
} from '../../services/agencyService';

export default function AgencyEditPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const id = location.pathname.split('/').pop();

  const [agency, setAgency] = useState<Agency | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [districts, setDistricts] = useState<{ districtId: string; name: string }[]>([]);
  const [types, setTypes] = useState<{ loai_daily_id: string; ten_loai: string }[]>([]);

  useEffect(() => {
    if (!id) {
      toast.error('Thiếu ID đại lý.');
      navigate('/agency/lookup');
      return;
    }

    const fetchData = async () => {
      try {
        const [agencyData, districtList, typeList] = await Promise.all([
          fetchAgencyByIdAPI(id),
          fetchDistrictsAPI(),
          fetchAgencyTypesAPI(),
        ]);
        setAgency(agencyData);
        setDistricts(districtList);
        setTypes(typeList);
      } catch (error) {
        toast.error('Lỗi khi tải dữ liệu.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    if (!agency) return;
    const { name, value } = e.target;
    setAgency({ ...agency, [name]: name === 'debt' ? Number(value) : value });
  };
    const handleDateChange = (date: Date | null) => {
    if (!agency || !date) return;
    const formatted = date.toISOString().split('T')[0];
    setAgency({ ...agency, createdDate: formatted });
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agency || !id) return;

    const payload = {
      ten: agency.name,
      dien_thoai: agency.phone,
      email: agency.email,
      tien_no: agency.debt,
      dia_chi: agency.address,
      quan: agency.district,
      loai_daily: agency.type,
      ngay_tiep_nhan: agency.createdDate,
      loai_daily_id: types.find(t => t.ten_loai === agency.type)?.loai_daily_id,
      quan_id: districts.find(d => d.name === agency.district)?.districtId,
    };

    try {
      await updateAgencyByIdAPI(id, payload);
      toast.success('Cập nhật đại lý thành công.');
      navigate('/agency/detail/' + id);
    } catch (error) {
      toast.error('Cập nhật thất bại.');
    }
  };

  if (isLoading || !agency) {
    return <div className="p-10 text-center text-gray-500">Đang tải dữ liệu...</div>;
  }

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded shadow">
      <Toaster position="top-right" />
      <h2 className="text-xl font-semibold text-gray-800 mb-6">Chỉnh sửa đại lý</h2>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="col-span-1">
          <label className="block text-sm font-medium text-gray-700 mb-1">Tên đại lý</label>
          <input type="text" name="name" value={agency.name} onChange={handleChange}
            className="w-full px-4 py-2 border rounded" required />
        </div>

        <div className="col-span-1">
          <label className="block text-sm font-medium text-gray-700 mb-1">Ngày tiếp nhận</label>
          <DatePicker
            selected={agency.createdDate ? new Date(agency.createdDate) : null}
            onChange={handleDateChange}
            dateFormat="dd/MM/yyyy"
            className="w-full px-4 py-2 border rounded"
            required
          />
        </div>

        <div className="col-span-1">
          <label className="block text-sm font-medium text-gray-700 mb-1">Loại đại lý</label>
          <select name="type" value={agency.type} onChange={handleChange}
            className="w-full px-4 py-2 border rounded" required>
            <option value="">Chọn loại đại lý</option>
            {types.map(t => (
              <option key={t.loai_daily_id} value={t.ten_loai}>{t.ten_loai}</option>
            ))}
          </select>
        </div>

        <div className="col-span-1">
          <label className="block text-sm font-medium text-gray-700 mb-1">Quận</label>
          <select name="district" value={agency.district} onChange={handleChange}
            className="w-full px-4 py-2 border rounded" required>
            <option value="">Chọn quận</option>
            {districts.map(d => (
              <option key={d.districtId} value={d.name}>{d.name}</option>
            ))}
          </select>
        </div>

        <div className="col-span-1">
          <label className="block text-sm font-medium text-gray-700 mb-1">Địa chỉ</label>
          <input type="text" name="address" value={agency.address} onChange={handleChange}
            className="w-full px-4 py-2 border rounded" required />
        </div>

        <div className="col-span-1">
          <label className="block text-sm font-medium text-gray-700 mb-1">Điện thoại</label>
          <input type="text" name="phone" value={agency.phone} onChange={handleChange}
            className="w-full px-4 py-2 border rounded" required />
        </div>

        <div className="col-span-1">
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input type="email" name="email" value={agency.email} onChange={handleChange}
            className="w-full px-4 py-2 border rounded" />
        </div>

        <div className="col-span-full mt-4">
          <button type="submit"
            className="px-6 py-2 bg-gray-800 text-white rounded hover:bg-gray-900">
            Cập nhật
          </button>
        </div>
      </form>
    </div>
  );
}