// src/front-end/app/routes/agency-lookup.tsx
import React, { useState } from 'react';
// Quan trọng: Import từ 'react-router' cho thiết lập của bạn
import { Link, NavLink, type MetaFunction } from 'react-router';
// Import icons
import { Search, PlusSquare, Trash2, FileText } from 'lucide-react';

// --- Dữ liệu và Kiểu ---
interface Agency {
  id: number;
  stt: number;
  name: string;
  type: string;
  district: string;
  debt: number;
}

// Dữ liệu mẫu giống trong hình Figma (cập nhật số liệu tiền)
const mockAgencies: Agency[] = [
  { id: 1, stt: 1, name: 'Đại lý A', type: 'Loại 1', district: 'Quận 1', debt: 1500000 },
  { id: 2, stt: 2, name: 'Đại lý B', type: 'Loại 2', district: 'Quận 3', debt: 0 },
  { id: 3, stt: 3, name: 'Đại lý C', type: 'Loại 1', district: 'Quận 1', debt: 3200000 },
  // Thêm các dòng khác nếu cần để test scroll
];

// --- Meta Function ---
export const meta: MetaFunction = () => {
  return [
    { title: "Admin - Tra cứu đại lý" }, // Cập nhật title giống Figma
    { name: "description", content: "Tra cứu thông tin đại lý." },
  ];
};

// --- Component Chính ---
export default function AgencyLookupPageWithCompleteLayout() {
  // State cho nội dung chính
  const [searchTerm, setSearchTerm] = useState('');
  const [agencies, setAgencies] = useState<Agency[]>(mockAgencies);
  const [activeTab, setActiveTab] = useState('agency'); // Tab "Đại lý" active mặc định

  // --- Helper Functions ---

  // Hàm xác định class cho NavLink trong Sidebar
  const getSidebarNavLinkClass = ({ isActive }: { isActive: boolean }): string =>
    `flex items-center px-3 py-2.5 rounded-md text-sm transition-colors duration-150 ease-in-out group ${
      isActive
        ? 'bg-slate-100 text-slate-900 font-medium' // Style active cho sidebar (nền xám nhạt hơn)
        : 'text-gray-600 hover:bg-slate-50 hover:text-gray-900' // Style inactive
    }`;

  // Hàm xử lý tìm kiếm
  const handleSearch = () => {
    const lowerSearchTerm = searchTerm.toLowerCase();
    if (!lowerSearchTerm) {
        setAgencies(mockAgencies); return; // Reset nếu trống
    }
    const filtered = mockAgencies.filter(agency =>
        agency.name.toLowerCase().includes(lowerSearchTerm) ||
        agency.district.toLowerCase().includes(lowerSearchTerm) ||
        agency.type.toLowerCase().includes(lowerSearchTerm)
    );
    setAgencies(filtered);
  };

   // Hàm xử lý Enter trong ô tìm kiếm
  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  };

  // Hàm tạo class cho các Tab nội dung chính
  const getContentTabClass = (tabName: string) =>
    `whitespace-nowrap pb-3 px-1 border-b-2 font-medium text-sm transition-colors duration-150 ease-in-out ${
      activeTab === tabName
        ? 'border-blue-600 text-blue-700' // Style active tab (border xanh, chữ xanh)
        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
    }`;


  // --- JSX Render ---
  return (
    // Container bao toàn bộ trang, nền trắng tổng thể như figma
    <div className="flex flex-col h-screen bg-white">
      {/* --- Header --- */}
      <header className="sticky top-0 z-30 flex items-center justify-between h-16 px-6 border-b border-gray-200"> {/* Header nền trắng */}
        <Link to="/" className="text-xl font-bold text-black"> {/* Chữ đen đậm */}
          agency-me
        </Link>
        <div className="flex items-center space-x-3">
          <img src="https://via.placeholder.com/32" alt="Admin Avatar" className="w-8 h-8 rounded-full object-cover"/>
          <span className="text-sm font-medium text-gray-700">Admin</span> {/* Chữ xám đậm hơn */}
        </div>
      </header>

      {/* --- Body (Sidebar + Main Content) --- */}
      <div className="flex flex-1 overflow-hidden">
        {/* --- Sidebar --- */}
        <aside className="sticky top-16 h-[calc(100vh-4rem)] w-64 flex-shrink-0 overflow-y-auto border-r border-gray-200 p-5 space-y-4 bg-white"> {/* Nền trắng, padding/space */}
          {/* Mục Tra cứu đại lý */}
          <div className="space-y-1">
             {/* Mục con đang active (nền xám nhạt) */}
            <div className="flex items-center px-3 py-2.5 rounded-md text-sm bg-slate-100 text-slate-900 font-medium cursor-default">
              <Search className="w-5 h-5 mr-3 flex-shrink-0 text-slate-700" />
              <span className="truncate">Tra cứu đại lý</span>
            </div>
          </div>
          {/* Mục Quản lý đại lý */}
          <div className="space-y-1">
            <h3 className="px-3 text-base font-semibold text-gray-800 mb-1">Quản lý đại lý</h3> {/* Text to hơn, đậm hơn */}
            <NavLink to="/agencies-add" className={getSidebarNavLinkClass}> {/* Sửa thành path thực tế */}
              <PlusSquare className="w-5 h-5 mr-3 flex-shrink-0" />
              <span className="truncate">Tiếp nhận đại lý</span>
            </NavLink>
            <NavLink to="/agencies-delete" className={getSidebarNavLinkClass}> {/* Sửa thành path thực tế */}
               <Trash2 className="w-5 h-5 mr-3 flex-shrink-0" />
              <span className="truncate">Xóa đại lý</span>
            </NavLink>
          </div>
           {/* Mục Lập phiếu xuất hàng */}
           <div className="space-y-1">
             <h3 className="px-3 text-base font-semibold text-gray-800 mb-1">Lập phiếu xuất hàng</h3>
             <NavLink to="/export-slips-create" className={getSidebarNavLinkClass}> {/* Sửa thành path thực tế */}
               <FileText className="w-5 h-5 mr-3 flex-shrink-0" />
               <span className="truncate">Lập phiếu</span>
             </NavLink>
           </div>
        </aside>

        {/* --- Main Content Area --- */}
        {/* Nền trắng cho khu vực nội dung chính */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8 bg-white">
          {/* Container cho nội dung bên phải */}
          <div className="flex flex-col space-y-5">

            {/* Phần Header Tabs (Không có background/border riêng, nằm trực tiếp trên main) */}
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex space-x-6" aria-label="Tabs">
                <button onClick={() => setActiveTab('agency')} className={getContentTabClass('agency')}>Đại lý</button>
                <button onClick={() => setActiveTab('agencyType')} className={getContentTabClass('agencyType')}>Loại đại lý</button>
                <button onClick={() => setActiveTab('regulation')} className={getContentTabClass('regulation')}>Thay đổi quy định</button>
              </nav>
            </div>

            {/* Nội dung tương ứng với Tab Đại lý */}
            {activeTab === 'agency' && (
              // Container cho nội dung tab, không cần card riêng nếu không muốn
              <div className="space-y-5">
                <h2 className="text-xl font-semibold text-gray-900">Danh sách các đại lý</h2>
                {/* Thanh tìm kiếm */}
                <div className="flex items-center space-x-3">
                  <div className="relative flex-grow">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                      <Search className="h-5 w-5 text-gray-400" aria-hidden="true" />
                    </div>
                    <input type="text" name="search" id="search"
                      // Style input giống figma: border nhẹ, focus xanh
                      className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      placeholder="Tìm kiếm theo tên, loại, quận..."
                      value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} onKeyDown={handleKeyDown}
                    />
                  </div>
                  <button type="button" onClick={handleSearch}
                    // Nút tìm màu đen/xám đậm
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-700">
                    Tìm
                  </button>
                </div>
                {/* Bảng dữ liệu */}
                <div className="overflow-x-auto border border-gray-200 rounded-lg shadow-sm"> {/* Thêm bo góc, shadow nhẹ cho table */}
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50"> {/* Header bảng màu xám cực nhạt */}
                      <tr>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">STT</th>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Đại lý</th>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Loại</th>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quận</th>
                        <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Tiền nợ</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {agencies.length > 0 ? (
                        agencies.map((agency) => (
                          <tr key={agency.id} className="hover:bg-slate-50"> {/* Hover màu xám nhạt */}
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">{agency.stt}</td>
                            {/* Tên đại lý có thể là link và đậm hơn */}
                            <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-blue-600 hover:underline cursor-pointer">{agency.name}</td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{agency.type}</td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{agency.district}</td>
                            {/* Định dạng tiền không có chữ VND */}
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600 text-right">{new Intl.NumberFormat('vi-VN').format(agency.debt)}</td>
                          </tr>
                        ))
                      ) : (
                        <tr><td colSpan={5} className="px-6 py-10 text-center text-sm text-gray-500">Không tìm thấy đại lý nào phù hợp.</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

             {/* Placeholder cho các tab khác */}
            {activeTab === 'agencyType' && ( <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">Nội dung Loại đại lý...</div> )}
            {activeTab === 'regulation' && ( <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">Nội dung Thay đổi quy định...</div> )}

          </div> {/* Kết thúc container nội dung bên phải */}
        </main> {/* Kết thúc main content area */}
      </div> {/* Kết thúc body container */}
    </div> // Kết thúc container bao toàn bộ trang
  );
}