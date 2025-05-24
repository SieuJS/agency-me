// src/front-end/app/routes/admin/agency-lookup.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { Link, type MetaFunction } from 'react-router';
import { Search, Trash2 } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

import { getAgencies, type Agency, type AgencySearchParams } from '../../services/agencyService'; 
import ConfirmationModal from '../../components/ui/ConfirmationModal'; 

export const meta: MetaFunction = () => {
  return [
    { title: "Admin - Tra cứu đại lý" },
    { name: "description", content: "Tra cứu thông tin đại lý." },
  ];
};

export default function AgencyLookupPage() {
  const [agencies, setAgencies] = useState<Agency[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('agency');

  const [searchName, setSearchName] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [selectedType, setSelectedType] = useState('');

  const [allDistricts, setAllDistricts] = useState<string[]>([]);
  const [allTypes, setAllTypes] = useState<string[]>([]);
  const [minDebtRange, setMinDebtRange] = useState(0);
  const [maxDebtRange, setMaxDebtRange] = useState(1000000);
  const [currentDebtFilterValue, setCurrentDebtFilterValue] = useState<number>(maxDebtRange);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [agencyToDelete, setAgencyToDelete] = useState<{ id: string | number; name: string } | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [lastSearchParams, setLastSearchParams] = useState<AgencySearchParams>({});

  const fetchData = useCallback(async (params?: AgencySearchParams) => {
    setIsLoading(true);
    try {
      const finalParams = {
        ...params,
        page: currentPage,
        perPage: 10,
      };

      const { agencies: fetchedAgencies, meta } = await getAgencies(finalParams);

      const agenciesWithStt = fetchedAgencies.map((agency, index) => ({
        ...agency,
        stt: (meta.curPage - 1) * meta.perPage + index + 1,
      }));

      setAgencies(agenciesWithStt);
      setTotalPages(meta.totalPage || 1);

      if ((!params || Object.keys(params).length === 0) && fetchedAgencies.length > 0) {
        setAllDistricts([...new Set(fetchedAgencies.map(a => a.district).filter(Boolean))].sort());
        setAllTypes([...new Set(fetchedAgencies.map(a => a.type).filter(Boolean))].sort());
        const debts = fetchedAgencies.map(a => a.debt);
        const newMinDebt = Math.min(0, ...debts);
        const newMaxDebt = Math.max(0, ...debts);
        //setMinDebtRange(newMinDebt);
        const effectiveMaxDebt = newMaxDebt > 0 ? newMaxDebt : 5000000;
        //setMaxDebtRange(effectiveMaxDebt);
        //setCurrentDebtFilterValue(effectiveMaxDebt);
      } else if ((!params || Object.keys(params).length === 0)) {
        setAllDistricts([]); setAllTypes([]);
        setMinDebtRange(0); setMaxDebtRange(5000000); setCurrentDebtFilterValue(5000000);
      }

    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Lỗi tải danh sách đại lý.");
      setAgencies([]);
    } finally {
      setIsLoading(false);
    }
  }, [currentPage]);

  useEffect(() => {
  fetchData(lastSearchParams); 
}, [fetchData, currentPage, lastSearchParams]);


  useEffect(() => {
    setCurrentDebtFilterValue(maxDebtRange);
  }, [maxDebtRange]);

  const handleSearch = () => {
    setCurrentPage(1);
    const searchParams: AgencySearchParams = {};
    if (searchName.trim()) searchParams.ten = searchName.trim();
    if (selectedDistrict) searchParams.quan = selectedDistrict;
    if (selectedType) searchParams.loai_daily = selectedType;
    searchParams.tien_no = currentDebtFilterValue;
    setLastSearchParams(searchParams); // 👈 Lưu lại
    fetchData(searchParams);
  };

  const handleResetSearch = () => {
    setSearchName('');
    setSelectedDistrict('');
    setSelectedType('');
    setLastSearchParams({});
    setCurrentPage(1);
    fetchData();
  };

  const handleDeleteClick = (agencyId: string | number, agencyName: string) => {
    setAgencyToDelete({ id: agencyId, name: agencyName });
    setIsDeleteModalOpen(true);
  };

  const confirmDeleteAgency = () => {
    if (!agencyToDelete) return;
    const { id, name } = agencyToDelete;
    const deletePromise = new Promise((resolve) => {
      setTimeout(() => {
        console.log(`Simulating delete for agency ID: ${id}`);
        resolve(`Đã xóa đại lý ${name}.`);
      }, 1000);
    });

    toast.promise(deletePromise, {
      loading: `Đang xóa đại lý "${name}"...`,
      success: (message) => {
        setAgencies(prevAgencies => prevAgencies.filter(agency => agency.id !== id));
        return String(message);
      },
      error: (err) => `Lỗi khi xóa đại lý "${name}": ${err.message || 'Unknown error'}.`,
    });
  };

  return (
    <div className="flex flex-col space-y-5">
      <Toaster position="top-right" />

      {activeTab === 'agency' && (
        <div className="space-y-5">
          <h2 className="text-xl font-semibold text-gray-900">Danh sách các đại lý</h2>

          <div className="space-y-4 p-4 border border-gray-200 rounded-lg bg-gray-50/50">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-4 items-end">
              <div className="md:col-span-1">
                <label htmlFor="searchName" className="block text-sm font-medium text-gray-700 mb-1">Tên đại lý</label>
                <input type="text" id="searchName" value={searchName} onChange={(e) => setSearchName(e.target.value)}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Tìm theo tên đại lý..." />
              </div>
              <div className="md:col-span-1">
                <label htmlFor="searchType" className="block text-sm font-medium text-gray-700 mb-1">Loại đại lý</label>
                <select id="searchType" value={selectedType} onChange={(e) => setSelectedType(e.target.value)}
                  className="block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  disabled={isLoading}>
                  <option value="">Tất cả loại</option>
                  {allTypes.map(type => ( <option key={type} value={type}>{type}</option> ))}
                </select>
              </div>
              <div className="md:col-span-1">
                <label htmlFor="searchDistrict" className="block text-sm font-medium text-gray-700 mb-1">Quận</label>
                <select id="searchDistrict" value={selectedDistrict} onChange={(e) => setSelectedDistrict(e.target.value)}
                  className="block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  disabled={isLoading}>
                  <option value="">Tất cả quận</option>
                  {allDistricts.map(district => ( <option key={district} value={district}>{district}</option> ))}
                </select>
              </div>
              <div className="md:col-span-1 flex items-end">
                <button type="button" onClick={handleSearch} disabled={isLoading}
                  className="w-full inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-700 disabled:opacity-50 h-[38px]">
                  <Search className="h-4 w-4 mr-2 -ml-1" /> Tìm
                </button>
              </div>
            </div>

            <div className="pt-4">
              <div className="flex items-center space-x-3 sm:space-x-4">
                <label
                  htmlFor="searchMaxDebt"
                  className="text-sm font-medium text-gray-700 whitespace-nowrap"
                >
                  Tiền nợ
                </label>
                <div className="flex-grow max-w-xs sm:max-w-sm md:max-w-[300px]">
                  <input
                    type="range"
                    id="searchMaxDebt"
                    min={minDebtRange}
                    max={maxDebtRange}
                    value={currentDebtFilterValue}
                    onChange={(e) => setCurrentDebtFilterValue(Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                    disabled={isLoading || minDebtRange >= maxDebtRange}
                  />
                </div>
                <span className="text-sm text-gray-700 w-32 sm:w-36 text-right tabular-nums">
                  {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(currentDebtFilterValue)}
                </span>
              </div>
            </div>

            <div className="pt-2">
              <button onClick={handleResetSearch} disabled={isLoading}
                className="px-4 py-2 border rounded-md bg-white text-gray-700">
                Đặt lại
              </button>
            </div>
          </div>

          <div className="overflow-x-auto border rounded-lg">
            {isLoading ? (
              <div className="p-10 text-center text-sm text-gray-500">Đang tải danh sách đại lý...</div>
            ) : (
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">STT</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Đại lý</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Loại</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Quận</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Tiền nợ</th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {agencies.length > 0 ? agencies.map((agency) => (
                    <tr key={agency.id} className="hover:bg-slate-50">
                      <td className="px-4 py-3 text-sm text-gray-600">{agency.stt}</td>
                      <td className="px-4 py-3 text-sm font-medium">
                        <Link to={`/agency/detail/${agency.id}`} className="text-blue-600 hover:underline">{agency.name}</Link>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-500">{agency.type}</td>
                      <td className="px-4 py-3 text-sm text-gray-500">{agency.district}</td>
                      <td className="px-4 py-3 text-sm text-gray-600 text-right">
                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(agency.debt)}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <button onClick={() => handleDeleteClick(agency.id, agency.name)}
                          className="bg-slate-800 hover:bg-slate-700 text-white p-2 rounded-md">
                          <Trash2 size={18} strokeWidth={2.5} />
                        </button>
                      </td>
                    </tr>
                  )) : (
                    <tr><td colSpan={6} className="p-10 text-center text-sm text-gray-500">Không tìm thấy đại lý nào phù hợp.</td></tr>
                  )}
                </tbody>
              </table>
            )}
          </div>

            {!isLoading && totalPages > 1 && (
              <div className="flex justify-center items-center gap-3 mt-4">
                {/* Nút Trang trước */}
                <button
                  onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1 border rounded-md bg-white text-sm hover:bg-gray-100 disabled:opacity-50"
                >
                  ←
                </button>

                {/* Dropdown chọn trang */}
                <div className="relative">
                  <select
                    value={currentPage}
                    onChange={(e) => setCurrentPage(Number(e.target.value))}
                    className="px-4 py-1 border border-gray-300 rounded-md bg-white text-sm cursor-pointer"
                  >
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <option key={page} value={page}>
                        Trang {page}/{totalPages}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Nút Trang sau */}
                <button
                  onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 border rounded-md bg-white text-sm hover:bg-gray-100 disabled:opacity-50"
                >
                  →
                </button>
              </div>
            )}


        </div>
      )}

      {agencyToDelete && (
        <ConfirmationModal
          isOpen={isDeleteModalOpen}
          onClose={() => { setIsDeleteModalOpen(false); setAgencyToDelete(null); }}
          onConfirm={confirmDeleteAgency}
          title="Bạn chắc chắn muốn xóa chứ?"
          message="Không thể hoàn tác hành động này. Thao tác này sẽ xóa vĩnh viễn đại lý này và các dữ liệu liên quan."
          confirmButtonText="Tiếp tục"
          cancelButtonText="Hủy"
        />
      )}
    </div>
  );
}