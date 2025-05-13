// --- Import các thư viện cần thiết ---
import { useState, type FormEvent } from 'react';
import { useNavigate, Link, useLocation } from 'react-router';

import DatePicker from 'react-datepicker'; // Cần cài đặt: npm install react-datepicker @types/react-datepicker
import 'react-datepicker/dist/react-datepicker.css';

// Import icons từ thư viện lucide-react (Cần cài đặt: npm install lucide-react)
import { FileText, Trash2 } from 'lucide-react';

// --- Import thư viện Toast ---
import toast, { Toaster } from 'react-hot-toast'; // Cần cài đặt: npm install react-hot-toast

// --- Import các UI Component ---
// Điều chỉnh đường dẫn import cho phù hợp với cấu trúc dự án của bạn
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
// import { Dialog } from '../components/ui/Dialog'; // Không cần Dialog nữa

// --- Giả lập hàm gọi API để lưu hồ sơ đại lý (Giữ nguyên) ---
const fakeSaveAgencyApi = (agencyData: any) => {
  console.log('Saving agency data:', agencyData);
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // Giả lập thành công sau 1.5 giây
      if (agencyData.name && agencyData.type && agencyData.address) {
        resolve({ success: true, message: 'Lưu hồ sơ đại lý thành công!' });
      } else {
        // Giả lập thất bại nếu thiếu thông tin cơ bản
        reject(new Error('Vui lòng điền đầy đủ thông tin bắt buộc.'));
      }
    }, 1500);
  });
};
// --- Kết thúc hàm giả lập ---

export default function AgencyReceptionPage() {
  const navigate = useNavigate();
  const location = useLocation(); // Để highlight tab và menu dựa trên URL hiện tại

  // --- State cho các trường nhập liệu ---
  const [agencyName, setAgencyName] = useState('');
  const [agencyType, setAgencyType] = useState('');
  const [district, setDistrict] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [filingDate, setFilingDate] = useState<Date | null>(new Date()); // Mặc định là ngày hiện tại

  // --- State cho validation và trạng thái xử lý ---
  const [errors, setErrors] = useState<{ [key: string]: string }>({}); // Để lưu lỗi cho từng trường
  const [isLoading, setIsLoading] = useState(false);
  // Không cần state cho dialog nữa
  // const [isDialogOpen, setIsDialogOpen] = useState(false);
  // const [dialogMessage, setDialogMessage] = useState('');
  // const [dialogTitle, setDialogTitle] = useState('');

  // --- Hàm Validation ---
  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    if (!agencyName) newErrors.agencyName = 'Tên đại lý không được để trống.';
    if (!agencyType) newErrors.agencyType = 'Loại đại lý không được để trống.';
    if (!district) newErrors.district = 'Quận không được để trống.';
    if (!address) newErrors.address = 'Địa chỉ không được để trống.';
    if (!phone) newErrors.phone = 'Điện thoại không được để trống.';
    if (!email) newErrors.email = 'Email không được để trống.';
    if (email && !/\S+@\S+\.\S+/.test(email)) newErrors.email = 'Email không hợp lệ.';
    if (!filingDate) newErrors.filingDate = 'Ngày lập phiếu không được để trống.';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // Trả về true nếu không có lỗi nào
  };

  // --- Submit Handler ---
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const isValid = validateForm();
    if (!isValid) {
      // Hiển thị lỗi ngay trên form input
      // Có thể thêm toast báo lỗi validation chung nếu muốn
      toast.error('Vui lòng kiểm tra lại các trường bị lỗi.');
      return;
    }

    setIsLoading(true);
    // Không cần ẩn dialog trước khi gọi API nữa
    // setIsDialogOpen(false);
    // setDialogMessage('');
    // setDialogTitle('');

    const agencyData = {
      name: agencyName,
      type: agencyType,
      district: district,
      address: address,
      phone: phone,
      email: email,
      filingDate: filingDate?.toISOString().split('T')[0], // Format ngày tháng
    };

    try {
      const response: any = await fakeSaveAgencyApi(agencyData); // Giả định API trả về { success: boolean, message: string }
      // Sử dụng toast thông báo thành công
      toast.success(response.message || 'Lưu hồ sơ đại lý thành công.');

      // Có thể reset form sau khi lưu thành công nếu cần
      resetForm();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Đã có lỗi xảy ra khi lưu hồ sơ.';
      // Sử dụng toast thông báo lỗi
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  // --- Hàm reset form (Tùy chọn) ---
  const resetForm = () => {
     setAgencyName('');
     setAgencyType('');
     setDistrict('');
     setAddress('');
     setPhone('');
     setEmail('');
     setFilingDate(new Date());
     setErrors({}); // Xóa lỗi khi reset form
    };

  // --- JSX ---
  return (
    /* Container chính: Sử dụng flex-col để header ở trên cùng */
    <div className="min-h-screen flex flex-col bg-gray-100">

      {/* Thêm component Toaster để hiển thị toast */}
      <Toaster position="top-right" reverseOrder={false} />

      {/* --- HEADER --- */}
      <header className="bg-white shadow-md p-4">
        {/* Hàng trên cùng của Header: Logo và Admin Info */}
        <div className="flex items-center justify-between mb-4">
          <div className="text-xl font-bold text-gray-800">
            agency-me
          </div>
          <div className="flex items-center space-x-2">
            {/* Placeholder Avatar */}
            <div className="h-6 w-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold">A</div>
            <span className="text-gray-700 font-semibold">Admin</span>
          </div>
        </div>

        {/* Thanh điều hướng dạng Tab */}
        <nav className="border-b border-gray-300">
          <ul className="flex -mb-px">
            <li className="mr-2">
              {/* Tab "Đại lý" */}
              {/* Highlight tab Đại lý nếu đường dẫn bắt đầu bằng /admin/dai-ly hoặc /admin/agency */}
              <Link
                to="/admin/dai-ly" // Điều chỉnh đường dẫn thực tế cho trang "Đại lý"
                className={`inline-block py-2 px-4 text-sm font-medium border-b-2 ${
                  location.pathname.startsWith('/admin/dai-ly') || location.pathname.startsWith('/admin/agency')
                    ? 'text-blue-600 border-blue-600'
                    : 'text-gray-600 border-transparent hover:text-gray-800 hover:border-gray-300'
                }`}
              >
                Đại lý
              </Link>
            </li>
            <li className="mr-2">
              {/* Tab "Loại đại lý" */}
              <Link
                to="/admin/loai-dai-ly" // Điều chỉnh đường dẫn thực tế cho trang "Loại đại lý"
                className={`inline-block py-2 px-4 text-sm font-medium border-b-2 ${
                  location.pathname.startsWith('/admin/loai-dai-ly')
                    ? 'text-blue-600 border-blue-600'
                    : 'text-gray-600 border-transparent hover:text-gray-800 hover:border-gray-300'
                }`}
              >
                Loại đại lý
              </Link>
            </li>
            <li className="mr-2">
              {/* Tab "Thay đổi quy định" */}
              <Link
                to="/admin/quy-dinh" // Điều chỉnh đường dẫn thực tế cho trang "Thay đổi quy định"
                className={`inline-block py-2 px-4 text-sm font-medium border-b-2 ${
                  location.pathname.startsWith('/admin/quy-dinh')
                    ? 'text-blue-600 border-blue-600'
                    : 'text-gray-600 border-transparent hover:text-gray-800 hover:border-gray-300'
                }`}
              >
                Thay đổi quy định
              </Link>
            </li>
            {/* Thêm các tab khác nếu có */}
          </ul>
        </nav>
      </header>
      {/* --- END HEADER --- */}

      {/* Content Area: Sidebar và Main Content - Sử dụng flex để xếp cạnh nhau */}
      {/* flex-1 để khu vực này chiếm hết không gian còn lại sau header */}
      <div className="flex flex-1">
        {/* Sidebar */}
        <div className="w-64 bg-white shadow-md p-4 flex-shrink-0 overflow-y-auto">
          <div className="space-y-2">
            <div className="text-gray-600 font-semibold uppercase text-sm mb-2">Agency-me Menu</div>
            {/* Menu Items với Link component */}

            {/* Tra cứu đại lý */}
            <Link to="/agency-lookup" className={`block w-full text-left py-2 px-4 rounded ${location.pathname.startsWith('/admin/tra-cuu-dai-ly') ? 'bg-gray-200' : 'hover:bg-gray-200'}`}>Tra cứu đại lý</Link>

            {/* Nhóm menu Quản lý đại lý */}
            {/* Highlight mục cha nếu đang ở bất kỳ trang con nào */}
            <div className={`block w-full text-left py-2 px-4 rounded font-bold ${location.pathname.startsWith('/admin/agency') ? 'bg-gray-200' : ''}`}>
              Quản lý đại lý
            </div>
            {/* Nested menu items */}
            <div className="ml-4 space-y-1">

              {/* Tiếp nhận đại lý - Thêm Icon */}
              <Link
                to="/admin/agency/reception" // Đảm bảo đây là đường dẫn chính xác
                // Highlight khi đường dẫn chính xác là /admin/agency/reception
                className={`flex items-center w-full text-left py-2 px-4 rounded ${location.pathname === '/admin/agency/reception' ? 'bg-blue-100 text-blue-700 font-semibold' : 'hover:bg-gray-200'}`}
              >
                <FileText className="mr-2 h-4 w-4" /> {/* Icon */}
                Tiếp nhận đại lý
              </Link>

              {/* Xóa đại lý - Thêm Icon */}
              <Link
                to="/admin/agency/delete" // Đảm bảo đây là đường dẫn chính xác
                className={`flex items-center w-full text-left py-2 px-4 rounded ${location.pathname === '/admin/agency/delete' ? 'bg-blue-100 text-blue-700 font-semibold' : 'hover:bg-gray-200'}`}
              >
                <Trash2 className="mr-2 h-4 w-4" /> {/* Icon */}
                Xóa đại lý
              </Link>
            </div>

            {/* Lập phiếu xuất hàng */}
            <Link to="/admin/lap-phieu-xuat-hang" className={`block w-full text-left py-2 px-4 rounded ${location.pathname.startsWith('/admin/lap-phieu-xuat-hang') ? 'bg-gray-200' : 'hover:bg-gray-200'}`}>Lập phiếu xuất hàng</Link>

          </div>
        </div>

        {/* Main Content Area */}
        <main className="flex-1 p-8 overflow-y-auto">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">Hồ sơ đại lý</h2>
            <form onSubmit={handleSubmit} noValidate>
              {/* Điều chỉnh grid để phù hợp với thiết kế ảnh */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Row 1: Tên đại lý (span 2 columns) */}
                <div className="md:col-span-2">
                  {/* Giả định component Input có prop label và error */}
                  <Input
                    label="Tên đại lý"
                    id="agencyName"
                    name="agencyName"
                    type="text"
                    value={agencyName}
                    onChange={(e) => setAgencyName(e.target.value)}
                    error={errors.agencyName}
                    disabled={isLoading}
                    required
                  />
                </div>

                {/* Row 2: Loại đại lý (left column) | Ngày lập phiếu (right column) */}
                {/* Cột trái: Loại đại lý */}
                <div> {/* Đây là cột đầu tiên trong hàng thứ 2 */}
                  <label htmlFor="agencyType" className="block text-sm font-medium text-gray-700 mb-1">
                    Loại đại lý
                  </label>
                  <div className="flex items-stretch gap-3">
                    <Input
                      // label prop được bỏ vì dùng thẻ label riêng bên ngoài
                      id="agencyType"
                      name="agencyType"
                      type="text"
                      value={agencyType}
                      onChange={(e) => setAgencyType(e.target.value)}
                      error={errors.agencyType} // Error handler cho Input có thể xử lý
                      disabled={isLoading}
                      required
                      className="flex-grow" // Cho phép input chiếm phần lớn không gian
                    />
                    <div>
                        <Button type="button" disabled={isLoading} className="h-10 w-10 px-0">
                        Thêm
                        </Button>
                    </div>
                    
                  </div>

                </div>
                {/* Cột phải: Ngày tiếp nhận */}
                <div> {/* Đây là cột thứ hai trong hàng thứ 2 */}
                  <label htmlFor="filingDate" className="block text-sm font-medium text-gray-700 mb-1">
                    Ngày tiếp nhận
                  </label>
                  <DatePicker
                    id="filingDate"
                    selected={filingDate}
                    onChange={(date: Date | null) => setFilingDate(date)}
                    dateFormat="dd/MM/yyyy"
                    className={`mt-1 block w-full rounded-md border ${errors.filingDate ? 'border-red-500' : 'border-gray-300'} shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2`}
                    disabled={isLoading}
                    required
                  />
                  {errors.filingDate && <p className="mt-1 text-sm text-red-600">{errors.filingDate}</p>}
                </div>

                {/* Row 3: Quận | Địa chỉ */}
                <div>
                  <Input
                    label="Quận"
                    id="district"
                    name="district"
                    type="text"
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    error={errors.district}
                    disabled={isLoading}
                    required
                  />
                </div>
                <div>
                  <Input
                    label="Địa chỉ"
                    id="address"
                    name="address"
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    error={errors.address}
                    disabled={isLoading}
                    required
                  />
                </div>

                {/* Row 4: Điện thoại | Email */}
                <div>
                  <Input
                    label="Điện thoại"
                    id="phone"
                    name="phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    error={errors.phone}
                    disabled={isLoading}
                    required
                  />
                </div>
                <div>
                  <Input
                    label="Email"
                    id="email"
                    name="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    error={errors.email}
                    disabled={isLoading}
                  />
                </div>

                {/* Row 5 trong code gốc (Ngày lập phiếu) đã bị xóa và chuyển lên Row 2 */}

              </div> {/* End grid */}

              {/* Save Button */}
              <div className="mt-8 text-right">
                <Button type="submit" isLoading={isLoading} disabled={isLoading}>
                  Lưu
                </Button>
              </div>
            </form>
          </div>
        </main>
      </div>

      
    </div>
  );
}