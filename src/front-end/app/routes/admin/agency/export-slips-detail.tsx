import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { toast } from 'react-hot-toast';
import { FileText, ArrowLeft, Printer } from 'lucide-react';

import { type ExportSlipItemDetail, type ExportSlipDetails,  getExportSlipDetailsAPI } from '../../../services/exportSheetService';


export default function ExportSlipDetailPage() {
    const [slipDetails, setSlipDetails] = useState<ExportSlipDetails | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const { exportsheetId } = useParams<{ exportsheetId: string }>(); // Lấy ID từ URL, ví dụ: /phieu-xuat/04ed4891...
    const navigate = useNavigate();

    useEffect(() => {
        const fetchDetails = async () => {
            if (!exportsheetId) {
                setError('Không tìm thấy ID của phiếu xuất.');
                setIsLoading(false);
                return;
            }

            setIsLoading(true);
            try {
                const data = await getExportSlipDetailsAPI(exportsheetId);
                setSlipDetails(data);
            } catch (err: any) {
                console.error("Failed to fetch export slip details:", err);
                setError(err.message || 'Không thể tải chi tiết phiếu xuất.');
                toast.error(err.message || 'Không thể tải chi tiết phiếu xuất.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchDetails();
    }, [exportsheetId]);

    const handlePrint = () => {
        window.print();
    };


    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-64">
                <p className="text-gray-500 text-lg">Đang tải chi tiết phiếu xuất...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col justify-center items-center h-64 text-center">
                <p className="text-red-500 text-lg">{error}</p>
                 <button
                    onClick={() => navigate(-1)} // Quay lại trang trước
                    className="mt-4 inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50"
                >
                    <ArrowLeft size={18} className="mr-2" />
                    Quay lại
                </button>
            </div>
        );
    }
    
    if (!slipDetails) {
        return <div className="text-center p-8">Không tìm thấy dữ liệu cho phiếu xuất này.</div>
    }

    return (
        <div className="space-y-6">
            <div className="p-6 md:p-8 bg-white rounded-lg shadow-md printable-area">
                <div className="flex justify-between items-start mb-6 border-b pb-4">
                     <div>
                        <h1 className="text-2xl font-semibold text-gray-800">
                           Chi tiết Phiếu Xuất Hàng
                        </h1>
                     </div>
                     <div className="flex space-x-2 no-print">
                          <button
                                onClick={() => navigate(-1)} // Quay lại trang trước
                                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50"
                           >
                                <ArrowLeft size={18} className="mr-2" />
                                Quay lại
                           </button>
                     </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 mb-8">
                    {/* Tên đại lý */}
                    <div className="flex flex-col">
                        <label className="block text-sm font-medium text-gray-500 mb-1">Đại lý</label>
                        <p className="text-base font-semibold text-gray-900">{slipDetails.daily_name}</p>
                    </div>

                    {/* Ngày lập phiếu */}
                    <div className="flex flex-col">
                        <label className="block text-sm font-medium text-gray-500 mb-1">Ngày lập phiếu</label>
                        <p className="text-base text-gray-900">
                           {new Date(slipDetails.ngay_lap_phieu).toLocaleDateString('vi-VN', {
                                day: '2-digit', month: '2-digit', year: 'numeric'
                           })}
                        </p>
                    </div>

                    {/* Nhân viên lập phiếu */}
                     <div className="flex flex-col">
                        <label className="block text-sm font-medium text-gray-500 mb-1">Nhân viên lập phiếu</label>
                        <p className="text-base text-gray-900">{slipDetails.nhan_vien_lap_phieu}</p>
                    </div>
                </div>

                {/* Chi tiết phiếu xuất hàng */}
                <div className="mb-8">
                    <h2 className="text-lg font-medium text-gray-800 mb-3">Chi tiết mặt hàng</h2>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200 border border-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-10">STT</th>
                                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-2/5">Mặt hàng</th>
                                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Đơn vị tính</th>
                                    <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Số lượng</th>
                                    <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Đơn giá</th>
                                    <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Thành tiền</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {slipDetails.items.map((item, index) => (
                                    <tr key={item.mathang_id}>
                                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{index + 1}</td>
                                        <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">{item.ten}</td>
                                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{item.don_vi_tinh}</td>
                                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 text-right">{item.so_luong}</td>
                                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 text-right">
                                            {item.don_gia.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
                                        </td>
                                        <td className="px-4 py-3 whitespace-nowrap text-sm font-semibold text-gray-800 text-right">
                                           {item.thanh_tien.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                             <tfoot>
                                <tr className="bg-gray-50">
                                    <td colSpan={5} className="px-4 py-3 text-right text-sm font-bold text-gray-700 uppercase">
                                        Tổng Cộng
                                    </td>
                                    <td className="px-4 py-3 text-right text-base font-bold text-gray-900">
                                        {slipDetails.tong_tien.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
                                    </td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}