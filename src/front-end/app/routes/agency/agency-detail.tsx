// --- Import các thư viện cần thiết ---
import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom'; // Giả sử bạn dùng react-router-dom v6

// Import icons
import { FileText, Edit3, Trash2, ArrowLeft, UserCircle, DollarSign, MapPin, Building, Phone, Mail, CalendarDays } from 'lucide-react';

// --- Import thư viện Toast ---
import toast, { Toaster } from 'react-hot-toast';

// --- Import các UI Component ---
import { Button } from '../../components/ui/Button'; // Điều chỉnh đường dẫn
// import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from '../../components/ui/Dialog'; // Nếu bạn có Dialog component

// --- Import service và types ---
import { fetchAgencyByIdAPI, type Agency } from '../../services/agencyService'; // Điều chỉnh đường dẫn

// Helper để định dạng ngày tháng
const formatDate = (dateString: string | undefined) => {
  if (!dateString) return 'N/A';
  try {
    const date = new Date(dateString);
    // Thêm kiểm tra isNaN cho ngày không hợp lệ sau khi parse
    if (isNaN(date.getTime())) return 'Ngày không hợp lệ';
    return date.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  } catch (error) {
    console.error("Lỗi định dạng ngày:", error);
    return 'Ngày không hợp lệ';
  }
};

// Helper để định dạng tiền tệ
const formatCurrency = (amount: number | undefined) => {
    if (typeof amount === 'undefined') return 'N/A';
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
};


export default function AgencyDetailsPage() {
  const navigate = useNavigate();
  const { agencyId } = useParams<{ agencyId: string }>(); // Lấy agencyId từ URL

  const [agency, setAgency] = useState<Agency | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  // const [showDeleteConfirm, setShowDeleteConfirm] = useState(false); // State cho Dialog xác nhận xóa

  useEffect(() => {
    if (!agencyId) {
      setError('Không tìm thấy ID đại lý.');
      setIsLoading(false);
      toast.error('ID đại lý không hợp lệ.');
      navigate('/agency/lookup'); // Chuyển hướng về trang danh sách nếu không có ID
      return;
    }

    const loadAgencyDetails = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await fetchAgencyByIdAPI(agencyId);
        setAgency(data);
      } catch (err) {
        console.error("Lỗi tải chi tiết đại lý:", err);
        const message = err instanceof Error ? err.message : 'Lỗi không xác định khi tải chi tiết đại lý.';
        setError(message);
        toast.error(message);
      } finally {
        setIsLoading(false);
      }
    };

    loadAgencyDetails();
  }, [agencyId, navigate]);

  

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
        <p className="ml-4 text-lg text-gray-600">Đang tải dữ liệu...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg shadow-md" role="alert">
        <div className="flex items-center">
          <FileText className="h-6 w-6 mr-2" />
          <strong className="font-bold">Lỗi:</strong>
        </div>
        <span className="block sm:inline ml-8">{error}</span>
        <div className="mt-4 text-right">
          <Button onClick={() => navigate('/agency/lookup')} >
            <ArrowLeft className="mr-2 h-4 w-4" /> Quay lại danh sách
          </Button>
        </div>
      </div>
    );
  }

  if (!agency) {
    return (
      <div className="text-center p-10">
        <FileText size={48} className="mx-auto text-gray-400 mb-4" />
        <p className="text-xl text-gray-600">Không tìm thấy thông tin đại lý.</p>
        <Button onClick={() => navigate('/agencies')} className="mt-6" >
            <ArrowLeft className="mr-2 h-4 w-4" /> Quay lại danh sách
        </Button>
      </div>
    );
  }

  // Item hiển thị thông tin
  const DetailItem = ({ icon: Icon, label, value }: { icon: React.ElementType, label: string, value: string | number | undefined | null }) => (
    <div className="flex items-start py-3">
      <Icon className="h-5 w-5 text-blue-600 mr-3 mt-1 flex-shrink-0" />
      <div>
        <p className="text-sm font-medium text-gray-500">{label}</p>
        <p className="text-md text-gray-800">{value || 'N/A'}</p>
      </div>
    </div>
  );

  return (
    <div className="bg-white p-6 md:p-8 rounded-lg shadow-xl max-w-4xl mx-auto">
      <Toaster position="top-right" reverseOrder={false} />

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 pb-4 border-b border-gray-200">
        <div className="flex items-center mb-4 sm:mb-0">
          <FileText className="h-8 w-8 text-blue-600 mr-3" />
          <h2 className="text-3xl font-semibold text-gray-800">Chi Tiết Đại Lý</h2>
        </div>
        <div className="flex space-x-2">
          <Button onClick={() => navigate(-1)}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Quay lại
          </Button>
          <Button 
            onClick={() => navigate(`/agency/edit/${agency.id}`)} // Giả sử có trang chỉnh sửa
            className="bg-yellow-500 hover:bg-yellow-600 text-white"
            disabled={isDeleting}
          >
            <Edit3 className="mr-2 h-4 w-4" /> Sửa
          </Button>
        </div>
      </div>

      {/* Agency Info Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2">
        <DetailItem icon={UserCircle} label="Tên đại lý" value={agency.name} />
        <DetailItem icon={Building} label="Loại đại lý" value={agency.type} />
        <DetailItem icon={MapPin} label="Quận" value={agency.district} />
        <DetailItem icon={MapPin} label="Địa chỉ" value={agency.address} />
        <DetailItem icon={Phone} label="Điện thoại" value={agency.phone} />
        <DetailItem icon={Mail} label="Email" value={agency.email} />
        <DetailItem icon={CalendarDays} label="Ngày tiếp nhận" value={formatDate(agency.createdDate)} />
        <DetailItem icon={DollarSign} label="Tiền nợ hiện tại" value={formatCurrency(agency.debt)} />
      </div>
    </div>
  );
}