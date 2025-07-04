import React, { useState, useEffect } from 'react';
import { Edit2 } from 'lucide-react';
import { toast, Toaster } from 'react-hot-toast';
import {
  fetchAgencyTypesAPI,
  type AgencyTypeFromAPI
} from '../../../services/agencyService';
import {
  updateRegulationDebt
} from '../../../services/regulationService';

export default function RegulationDebtBatchPage() {
  const [types, setTypes] = useState<AgencyTypeFromAPI[]>([]);
  const [original, setOriginal] = useState<AgencyTypeFromAPI[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [newDebt, setNewDebt] = useState<number>(0);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const data = await fetchAgencyTypesAPI();
        setTypes(data);
        setOriginal(data);
      } catch (err) {
        toast.error((err as Error).message || 'Lỗi tải loại đại lý.');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const onEdit = (index: number) => {
    setEditingIndex(index);
    setNewDebt(types[index].tien_no_toi_da);
  };

  const onDebtChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewDebt(e.currentTarget.valueAsNumber);
  };

  const onModalSave = () => {
    if (editingIndex === null || isNaN(newDebt) || newDebt < 0) return;

    const updatedRow = { ...types[editingIndex], tien_no_toi_da: newDebt };
    setTypes(list =>
      list.map((item, i) => (i === editingIndex ? updatedRow : item))
    );
    setEditingIndex(null);
    toast.success("Đã lưu tạm thay đổi. Nhấn 'Cập nhật' để áp dụng.");
  };

  const onBatchUpdate = async () => {
    const changed = types.filter((t, i) => original[i] && t.tien_no_toi_da !== original[i].tien_no_toi_da);
    if (changed.length === 0) {
      toast('Không có thay đổi nào để cập nhật.', { icon: 'ℹ️' });
      return;
    }
    setSubmitting(true);
    try {
      await Promise.all(changed.map(t =>
        updateRegulationDebt({ loai_daily_id: t.loai_daily_id, value: t.tien_no_toi_da })
      ));
      toast.success('Cập nhật thành công!');
      // Cập nhật lại trạng thái gốc sau khi đã lưu thành công
      setOriginal(types);
    } catch {
      toast.error('Đã xảy ra lỗi khi cập nhật.');
    } finally {
      setSubmitting(false);
    }
  };
  
  // 1. TÍNH TOÁN XEM CÓ THAY ĐỔI KHÔNG
  const hasChanges = types.some((t, i) => 
    original[i] && t.tien_no_toi_da !== original[i].tien_no_toi_da
  );

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <h2 className="text-2xl font-bold mb-6 text-center">
          Quy định về tiền nợ tối đa của từng loại đại lý
        </h2>
        <p>Đang tải dữ liệu…</p>
        <Toaster position="top-right" />
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center p-6">
      <Toaster position="top-right" />
      <h2 className="text-2xl font-bold text-center mb-6">
        Quy định về tiền nợ tối đa của từng loại đại lý
      </h2>

      <div className="w-full max-w-4xl border rounded-md overflow-hidden">
        {/* ... table jsx ... */}
        <table className="w-full table-fixed text-sm text-center border-collapse">
          <thead className="bg-gray-100 font-medium">
            <tr>
              <th className="w-1/3 px-4 py-2 text-left border">Tên loại đại lý</th>
              <th className="w-1/2 px-4 py-2 text-left border">Tiền nợ tối đa</th>
              <th className="w-1/6 px-4 py-2 border">Chỉnh sửa</th>
            </tr>
          </thead>
          <tbody>
            {types.map((t, idx) => {
              const isChanged = original[idx] && t.tien_no_toi_da !== original[idx].tien_no_toi_da;
              return (
                <tr key={t.loai_daily_id} className={isChanged ? "bg-yellow-50" : ""}>
                  <td className="px-4 py-2 text-left border">{t.ten_loai}</td>
                  <td className="px-4 py-2 text-left border">{t.tien_no_toi_da.toLocaleString('vi-VN')} VND</td>
                  <td className="px-4 py-2 border">
                    <button
                      onClick={() => onEdit(idx)}
                      className="p-2 hover:bg-gray-100 rounded border"
                    >
                      <Edit2 size={16} />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* 2. CẬP NHẬT NÚT CẬP NHẬT */}
      <button
        onClick={onBatchUpdate}
        disabled={submitting || !hasChanges}
        className="mt-6 px-6 py-2 bg-[#2E3A59] text-white rounded hover:bg-[#1f2a43] disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {submitting ? 'Đang cập nhật...' : 'Cập nhật'}
      </button>

      {/* ... modal jsx ... */}
      {editingIndex !== null && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4 text-center">Chỉnh sửa tiền nợ tối đa</h3>
            
            <div className="mb-3">
              <label className="text-sm font-medium">Tên loại đại lý</label>
              <input
                type="text"
                value={types[editingIndex].ten_loai}
                disabled
                className="w-full mt-1 px-3 py-2 border rounded bg-gray-100"
              />
            </div>

            <div className="mb-4">
              <label className="text-sm font-medium">Tiền nợ tối đa</label>
              <input
                type="number"
                value={isNaN(newDebt) ? '' : newDebt}
                onChange={onDebtChange}
                disabled={submitting}
                className="w-full mt-1 px-3 py-2 border rounded border-gray-300"
                min="0"
              />
            </div>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setEditingIndex(null)}
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                disabled={submitting}
              >
                Hủy
              </button>
              <button
                onClick={onModalSave}
                className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={submitting || isNaN(newDebt) || newDebt < 0}
              >
                Lưu
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}