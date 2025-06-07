// src/front-end/app/routes/admin/agency-edit.tsx
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import { Button } from '../../../components/ui/Button';
import { FileText, Edit3, Trash2, ArrowLeft, UserCircle, DollarSign, MapPin, Building, Phone, Mail, CalendarDays } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import {
  fetchAgencyByIdAPI,
  type Agency,
  fetchAgencyTypesAPI,
  fetchDistrictsAPI,
  updateAgencyByIdAPI
} from '../../../services/agencyService';

const fieldLabels: { [key: string]: string } = {
  name: 'Tên đại lý',
  phone: 'Điện thoại',
  address: 'Địa chỉ',
  type: 'Loại đại lý',
  district: 'Quận',
  createdDate: 'Ngày tiếp nhận',
};


export default function AgencyEditPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const id = location.pathname.split('/').pop();

  const agencyFromState = (location.state as { agency?: Agency })?.agency;

  //const [agency, setAgency] = useState<Agency | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [districts, setDistricts] = useState<{ districtId: string; name: string }[]>([]);
  const [types, setTypes] = useState<{ loai_daily_id: string; ten_loai: string }[]>([]);
  //const [originalAgency, setOriginalAgency] = useState<Agency | null>(null);

  const [agency, setAgency] = useState<Agency | null>(agencyFromState || null);
  const [originalAgency, setOriginalAgency] = useState<Agency | null>(agencyFromState || null);



  useEffect(() => {
    if (!id) {
      toast.error('Thiếu ID đại lý.');
      navigate('/admin/agency/lookup');
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
        setOriginalAgency(agencyData);
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

    // Kiểm tra các trường bắt buộc
  const requiredFields = ['name', 'phone', 'address', 'type', 'district', 'createdDate', 'email'];
  for (const field of requiredFields) {
    if (!agency[field as keyof typeof agency]) {
      const label = fieldLabels[field] || field;
      toast.error(`Trường "${label}" không được để trống.`);
      return;
    }
  }


  // Kiểm tra định dạng email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (agency.email && !emailRegex.test(agency.email)) {
    toast.error('Email không hợp lệ.');
    return;
  }

  // Kiểm tra định dạng số điện thoại
  const phoneRegex = /^0\d{9}$/;
  if (!phoneRegex.test(agency.phone)) {
    toast.error('Số điện thoại phải bắt đầu bằng số 0 và có đúng 10 chữ số.');
    return;
  }

  if (originalAgency) {
    const isUnchanged =
      agency.name === originalAgency.name &&
      agency.phone === originalAgency.phone &&
      agency.email === originalAgency.email &&
      agency.debt === originalAgency.debt &&
      agency.address === originalAgency.address &&
      agency.district === originalAgency.district &&
      agency.type === originalAgency.type &&
      agency.createdDate === originalAgency.createdDate;

    if (isUnchanged) {
      toast('Không có thay đổi nào được thực hiện.', { icon: 'ℹ️' });
      navigate(-1);
      return;
    }
  }


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
      navigate('/admin/agency/detail/' + id);
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
           <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 pb-4 border-b border-gray-200">
        <div className="flex items-center mb-4 sm:mb-0">
          <h2 className="text-lg font-semibold flex items-center gap-2 ">
            <Edit3 className="w-5 h-5 text-blue-800" />
            Chỉnh sửa đại lý
          </h2>
        </div>
        <div className="flex space-x-2">
          <Button onClick={() => navigate(-1)} className="bg-gray-200 hover:bg-gray-300 text-gray-800">
            <ArrowLeft className="mr-2 h-4 w-4" /> Quay lại
          </Button>
  
        </div>
      </div>
      
      <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Tên đại lý */}
          <div className="col-span-1">
            <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
              <UserCircle className="mr-2 h-5 w-5 text-blue-500" />
              Tên đại lý
            </label>
            <input
              type="text"
              name="name"
              value={agency.name}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded"
            />
          </div>

          {/* Ngày tiếp nhận */}
          <div className="col-span-1">
            <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
              <CalendarDays className="mr-2 h-5 w-5 text-blue-500" />
              Ngày tiếp nhận
            </label>
            <DatePicker
              selected={agency.createdDate ? new Date(agency.createdDate) : null}
              onChange={handleDateChange}
              dateFormat="dd/MM/yyyy"
              className="w-full px-4 py-2 border rounded"
              placeholderText="Chọn ngày tiếp nhận"
              popperPlacement="bottom-start"
            />
          </div>

          {/* Loại đại lý */}
          <div className="col-span-1">
            <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
              <Building className="mr-2 h-5 w-5 text-blue-500" />
              Loại đại lý
            </label>
            <select
              name="type"
              value={agency.type}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded"
            >
              <option value="">Chọn loại đại lý</option>
              {types.map((t) => (
                <option key={t.loai_daily_id} value={t.ten_loai}>
                  {t.ten_loai}
                </option>
              ))}
            </select>
          </div>

          {/* Quận */}
          <div className="col-span-1">
            <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
              <MapPin className="mr-2 h-5 w-5 text-blue-500" />
              Quận
            </label>
            <select
              name="district"
              value={agency.district}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded"
            >
              <option value="">Chọn quận</option>
              {districts.map((d) => (
                <option key={d.districtId} value={d.name}>
                  {d.name}
                </option>
              ))}
            </select>
          </div>

          {/* Địa chỉ */}
          <div className="col-span-1">
            <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
              <MapPin className="mr-2 h-5 w-5 text-blue-500" />
              Địa chỉ
            </label>
            <input
              type="text"
              name="address"
              value={agency.address}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded"
            />
          </div>

          {/* Điện thoại */}
          <div className="col-span-1">
            <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
              <Phone className="mr-2 h-5 w-5 text-blue-500" />
              Điện thoại
            </label>
            <input
              type="text"
              name="phone"
              value={agency.phone}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded"
            />
          </div>

          {/* Email */}
          <div className="col-span-1">
            <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
              <Mail className="mr-2 h-5 w-5 text-blue-500" />
              Email
            </label>
            <input
              type="text"
              name="email"
              value={agency.email}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded"
            />
          </div>

          {/* Nút Cập nhật */}
          <div className="col-span-full mt-4">
            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white">
              <Edit3 className="mr-2 h-4 w-4" /> Cập nhật 
            </Button>
          </div>
        </form>
    </div>
  );
}