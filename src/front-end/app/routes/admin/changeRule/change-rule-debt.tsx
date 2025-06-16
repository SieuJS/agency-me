import React, { useState, useEffect } from 'react';
import { Edit2 } from 'lucide-react';
import { toast, Toaster } from 'react-hot-toast';
import {
  fetchAgencyTypesAPI,
  type AgencyTypeFromAPI
} from '../../../services/agencyService';
import {
  updateRegulationDebt,
  type UpdateRegulationMaxDebtInput,
  type UpdateRegulationMaxDebtOutput
} from '../../../services/regulationService';

export default function RegulationDebtBatchPage() {
  const [types, setTypes] = useState<AgencyTypeFromAPI[]>([]);
  const [original, setOriginal] = useState<AgencyTypeFromAPI[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [newDebt, setNewDebt] = useState<number>(0);
  const [submitting, setSubmitting] = useState(false);

  // Load initial data
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

  // Open edit modal
  const onEdit = (index: number) => {
    setEditingIndex(index);
    setNewDebt(types[index].tien_no_toi_da);
  };

  // Handle debt change
  const onDebtChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewDebt(e.currentTarget.valueAsNumber);
  };

  // Save single edit locally
  const onModalSave = () => {
    if (editingIndex === null) return;
    const updatedRow = { ...types[editingIndex], tien_no_toi_da: newDebt };
    setTypes(list =>
      list.map((item, i) => (i === editingIndex ? updatedRow : item))
    );
    setEditingIndex(null);
  };

  // Batch update all changes
  const onBatchUpdate = async () => {
    const changed = types.filter((t, i) => t.tien_no_toi_da !== original[i].tien_no_toi_da);
    if (changed.length === 0) {
      toast('Không có thay đổi nào.', { icon: 'ℹ️' });
      return;
    }
    setSubmitting(true);
    try {
      await Promise.all(changed.map(t =>
        updateRegulationDebt({ loai_daily_id: t.loai_daily_id, value: t.tien_no_toi_da })
      ));
      toast.success('Cập nhật thành công!');
      setOriginal(types);
    } catch {
      toast.error('Đã xảy ra lỗi khi cập nhật.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-12 bg-[#f7f8fa]">
        <h2 className="text-2xl font-bold mb-6 text-center">
          Quy định về tiền nợ tối đa của từng loại đại lý
        </h2>
        <p>Đang tải dữ liệu…</p>
        <Toaster position="top-right" />
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center py-10 w-full max-w-[1000px] mx-auto bg-[#f7f8fa]">
      <h2 className="text-2xl font-bold mb-8 text-center">
        Quy định về tiền nợ tối đa của từng loại đại lý
      </h2>

      <div className="overflow-x-auto w-full max-w-4xl">
        <table className="min-w-full bg-white rounded-lg shadow">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-left">Tên loại đại lý</th>
              <th className="px-6 py-3 text-left">Tiền nợ tối đa</th>
              <th className="px-6 py-3 text-center">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {types.map((t, idx) => (
              <tr key={t.loai_daily_id} className="border-b last:border-none">
                <td className="px-6 py-4">{t.ten_loai}</td>
                <td className="px-6 py-4">{t.tien_no_toi_da.toLocaleString('vi-VN')} VND</td>
                <td className="px-6 py-4 text-center">
                  <button onClick={() => onEdit(idx)} className="p-1 hover:bg-gray-200 rounded">
                    <Edit2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <button
        onClick={onBatchUpdate}
        disabled={submitting}
        className="mt-6 px-10 py-3 bg-slate-600 hover:bg-slate-700 text-white text-lg rounded shadow disabled:opacity-50"
      >
        {submitting ? 'Đang cập nhật...' : 'Cập nhật'}
      </button>

      <Toaster position="top-right" />

      {editingIndex !== null && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Chỉnh sửa tiền nợ tối đa</h3>
            <label className="block mb-3">
              Tên loại đại lý
              <input
                type="text"
                value={types[editingIndex].ten_loai}
                disabled
                className="mt-1 w-full px-3 py-2 border rounded bg-gray-100"
              />
            </label>
            <label className="block mb-1">
              Tiền nợ tối đa
              <input
                type="number"
                value={newDebt}
                onChange={onDebtChange}
                disabled={submitting}
                className="mt-1 w-full px-3 py-2 border rounded border-gray-300"
              />
            </label>
            <div className="flex justify-end space-x-2 mt-4">
              <button onClick={() => setEditingIndex(null)} disabled={submitting} className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">
                Hủy
              </button>
              <button onClick={onModalSave} disabled={submitting} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50">
                Lưu
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
