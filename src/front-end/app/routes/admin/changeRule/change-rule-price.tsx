import React, { useEffect, useState } from "react";
import { fetchItemsAPI, type Item } from "../../../services/itemService";
import { updateItemPrice } from "../../../services/regulationService";
import { toast, Toaster } from "react-hot-toast";
import { Pencil, ChevronLeft, ChevronRight } from "lucide-react";

const PAGE_SIZE = 5;

export default function DonGiaMatHang() {
  const [items, setItems] = useState<Item[]>([]);
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [giaBanMoi, setGiaBanMoi] = useState("");
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [pendingChanges, setPendingChanges] = useState<Record<string, number>>({});

  const totalPages = Math.ceil(items.length / PAGE_SIZE);
  const paginatedItems = items.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  // Icon helpers
  const renderEditIcon = () => <Pencil size={16} />;
  const renderPrevIcon = () => <ChevronLeft size={16} />;
  const renderNextIcon = () => <ChevronRight size={16} />;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchItemsAPI();
        setItems(data);
      } catch (error: any) {
        toast.error(error.message || "Không thể tải danh sách mặt hàng.");
      }
    };
    fetchData();
  }, []);

  const handleEdit = (item: Item) => {
    setSelectedItem(item);
    setGiaBanMoi(item.don_gia.toLocaleString("vi-VN"));
  };

  const handleClose = () => {
    setSelectedItem(null);
    setGiaBanMoi("");
    setLoading(false);
  };

  const handleSave = () => {
    const newPrice = parseInt(giaBanMoi.replace(/\D/g, ""), 10);
    if (isNaN(newPrice)) {
      toast.error("Vui lòng nhập giá hợp lệ.");
      return;
    }

    setPendingChanges((prev) => ({
      ...prev,
      [selectedItem!.mathang_id]: newPrice,
    }));

    setItems((prev) =>
      prev.map((item) =>
        item.mathang_id === selectedItem!.mathang_id
          ? { ...item, don_gia: newPrice }
          : item
      )
    );

    handleClose();
    toast.success("✅ Giá đã được lưu tạm. Nhấn 'Cập nhật' để áp dụng.");
  };

  const handleBulkUpdate = async () => {
    const updates = Object.entries(pendingChanges);
    if (updates.length === 0) {
      toast("Không có thay đổi nào để cập nhật.");
      return;
    }

    setLoading(true);
    try {
      await Promise.all(
        updates.map(([id, don_gia]) =>
          updateItemPrice({ id, don_gia })
        )
      );
      toast.success("🎉 Tất cả giá bán đã được cập nhật thành công!");
      setPendingChanges({});
    } catch (err) {
      toast.error("❌ Có lỗi xảy ra khi cập nhật hàng loạt.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center p-6">
      <Toaster position="top-right" />
      <h2 className="text-2xl font-bold text-center mb-6">
        Quy định về đơn giá bán của từng loại mặt hàng
      </h2>

      <div className="w-full max-w-4xl border rounded-md overflow-hidden">
        <table className="w-full border-collapse text-sm text-center">
          <thead className="bg-gray-100 font-medium">
            <tr>
              <th className="border px-4 py-2 w-1/3 text-left">Tên mặt hàng</th>
              <th className="border px-4 py-2 w-1/2 text-left">Giá bán</th>
              <th className="border px-4 py-2 w-1/6">Chỉnh sửa</th>
            </tr>
          </thead>
          <tbody className="bg-white">
            {paginatedItems.map((item) => {
              const isModified = pendingChanges[item.mathang_id] !== undefined;
              return (
                <tr
                  key={item.mathang_id}
                  className={isModified ? "bg-yellow-50" : ""}
                >
                  <td className="border px-4 py-2 text-left">{item.ten}</td>
                  <td className="border px-4 py-2 text-left">
                    {item.don_gia.toLocaleString("vi-VN")} VND
                  </td>
                  <td className="border px-4 py-2">
                    <button
                      onClick={() => handleEdit(item)}
                      className="p-2 hover:bg-gray-100 rounded border"
                    >
                      {renderEditIcon()}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="flex justify-between items-center p-4 bg-gray-50 border-t">
          <button
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
            className="px-3 py-1 border rounded disabled:opacity-50 flex items-center gap-1"
          >
            {renderPrevIcon()} Trang trước
          </button>
          <span>
            Trang {page} / {totalPages}
          </span>
          <button
            disabled={page === totalPages}
            onClick={() => setPage(page + 1)}
            className="px-3 py-1 border rounded disabled:opacity-50 flex items-center gap-1"
          >
            Trang sau {renderNextIcon()}
          </button>
        </div>
      </div>

      {/* Popup chỉnh sửa */}
      {selectedItem && (
        <div className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 bg-white p-6 border shadow-lg rounded-md z-50 w-96">
          <h3 className="text-lg font-semibold mb-4 text-center">
            Chỉnh sửa giá bán của mặt hàng
          </h3>

          <div className="mb-3">
            <label className="text-sm font-medium">Tên mặt hàng</label>
            <input
              value={selectedItem.ten}
              disabled
              className="w-full mt-1 border px-3 py-2 rounded bg-gray-100"
            />
          </div>

          <div className="mb-4">
            <label className="text-sm font-medium">Giá bán</label>
            <input
              value={giaBanMoi}
              onChange={(e) => setGiaBanMoi(e.target.value)}
              className="w-full mt-1 border px-3 py-2 rounded"
              placeholder="Nhập giá mới"
            />
          </div>

          <div className="flex justify-end gap-2">
            <button
              onClick={handleClose}
              className="px-4 py-2 border rounded hover:bg-gray-100"
              disabled={loading}
            >
              Hủy
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800"
              disabled={loading}
            >
              Lưu
            </button>
          </div>
        </div>
      )}

      {/* Nút Cập nhật toàn bộ */}
      <button
        onClick={handleBulkUpdate}
        className="mt-6 px-6 py-2 bg-[#2E3A59] text-white rounded hover:bg-[#1f2a43]"
        disabled={loading || Object.keys(pendingChanges).length === 0}
      >
        Cập nhật
      </button>
    </div>
  );
}
