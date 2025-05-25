import apiClient from './apiClient'; // Import apiClient đã tạo
import axios from 'axios';

export interface ExportSheetInputPayload {
  daily_id: string;
  ngay_lap_phieu: Date;
  nhan_vien_lap_phieu: string; // This should be the NhanVien ID
  items: Array<{
    mathang_id: string;
    so_luong: number;
  }>;
}

// Type for the response when an export slip is created (based on your backend service)
export interface CreatedExportSheetResponse {
  phieu_id: string;
  daily_id: string;
  nhan_vien_lap_phieu: string;
  ngay_lap_phieu: string; // Date might be stringified
  chiTietPhieuXuat: Array<{
    phieu_id: string;
    mathang_id: string;
    so_luong: number;
    don_gia: number;
    thanh_tien: number;
  }>;
}

const handleError = (error: any, defaultMessage: string): Error => {
    console.error(`AgencyService Error: ${defaultMessage}`, error);
    if (axios.isAxiosError(error) && error.response) {
        const backendError = error.response.data;
        let errorMessage = defaultMessage;
        if (backendError && backendError.message) {
            errorMessage = Array.isArray(backendError.message) ? backendError.message.join(', ') : backendError.message;
        } else if (typeof backendError === 'string') {
            errorMessage = backendError;
        }
        return new Error(errorMessage);
    }
    return new Error(`Lỗi kết nối hoặc không xác định: ${defaultMessage.toLowerCase()}`);
};


  // Mock data for now:
  // console.warn("fetchItemsAPI is using mock data.");
  // return [
  //   { mathang_id: 'mh001', ten_mat_hang: 'Quần jeans', don_vi_tinh: 'Cái', don_gia: 400000 },
  //   { mathang_id: 'mh002', ten_mat_hang: 'Áo thun', don_vi_tinh: 'Cái', don_gia: 200000 },
  //   { mathang_id: 'mh003', ten_mat_hang: 'Nước ngọt Coca', don_vi_tinh: 'Thùng', don_gia: 180000 },
  //   { mathang_id: 'mh004', ten_mat_hang: 'Bánh quy', don_vi_tinh: 'Hộp', don_gia: 50000 },
  // ];
//};

/**
 * Creates a new export sheet.
 * @param data - The export sheet input data.
 * Assumes your NestJS service is at POST /export-sheets (adjust if different)
 */
export const createExportSheetAPI = async (
  data: ExportSheetInputPayload
): Promise<CreatedExportSheetResponse> => {
  try {
    const response = await apiClient.post<CreatedExportSheetResponse>('/export-sheets', data); // <-- Sửa tại đây

    if (!response.data) {
      throw new Error('Không có dữ liệu từ API.');
    }
    return response.data;
  } catch (error) {
    throw handleError(error, 'Không thể thêm phiếu xuất hàng.');
  }
};
