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



/**
 * Creates a new export sheet.
 * @param data - The export sheet input data.
 * Assumes your NestJS service is at POST /export-sheets (adjust if different)
 */
export const createExportSheetAPI = async (
  data: ExportSheetInputPayload
): Promise<CreatedExportSheetResponse> => {
  try {
    const response = await apiClient.post<CreatedExportSheetResponse>('/export-sheets', data);

    if (!response.data) {
      throw new Error('Không có dữ liệu từ API.');
    }
    return response.data;
  } catch (error) {
    throw handleError(error, 'Không thể thêm phiếu xuất hàng.');
  }
};


export interface ExportSheet {
  phieu_id: string | number;
  daily_name: string;
  ngay_lap_phieu: string; // Format YYYY-MM-DD hoặc dd/MM/YYYY tùy API
  tong_tien: number
  nhan_vien_lap_phieu:string;
  stt?: number;
}

export interface GetExportSheetsResult {
  items: ExportSheet[];
  meta: PaginationMeta;
}

export interface PaginationMeta {
  curPage: number;
  perPage: number;
  totalPage: number;
  prevPage: number | null;
  nextPage: number | null;
  totalItems: number;
}

export interface ExportSheetSearchParams {
  daily_name?: string;        
  ngay_lap_phieu?: string;       
  tong_tien?: number;    
  page?: number;
  perPage?: number;    // Backend của bạn dùng 'limit', ta sẽ map 'perPage' vào đó
}

/**
 * Lấy danh sách phiếu xuất hàng đã phân trang và lọc từ API.
 * @param params - Các tham số tìm kiếm và phân trang.
 * @returns Một promise trả về danh sách phiếu xuất và thông tin phân trang.
 */
export const getExportSheets = async (params: ExportSheetSearchParams): Promise<GetExportSheetsResult> => {
  try {
    // Ánh xạ tên tham số phía frontend với tên tham số thực tế của API
    const apiParams = {
      page: params.page,
      limit: params.perPage,           // Frontend 'perPage' -> API 'limit'
      search: params.daily_name,       // Frontend 'daily_name' -> API 'search'
      ngay_tao: params.ngay_lap_phieu, // Frontend 'ngay_lap_phieu' -> API 'ngay_tao'
      tong_tien: params.tong_tien,
    };

    // Thực hiện gọi API
    const response = await apiClient.get('/export-sheets/list', {
      params: apiParams,
    });

    // API trả về có 'payload' chứa dữ liệu và 'meta' chứa thông tin phân trang.
    const { payload, meta: apiMeta } = response.data;

    if (!payload || !apiMeta) {
      throw new Error('Dữ liệu trả về từ API không hợp lệ.');
    }

    // Chuyển đổi dữ liệu trả về từ API để khớp với interface GetExportSheetsResult
    const result: GetExportSheetsResult = {
      items: payload,
      meta: {
        curPage: apiMeta.curPage,
        perPage: apiMeta.perPage,
        prevPage: apiMeta.prevPage,
        nextPage: apiMeta.nextPage,
        totalItems: apiMeta.totalItems,
        // Tính toán 'totalPage' vì API không trả về trường này
        totalPage: apiMeta.totalItems > 0 ? Math.ceil(apiMeta.totalItems / apiMeta.perPage) : 1,
      },
    };

    return result;
  } catch (error) {
    throw handleError(error, 'Không thể tải danh sách phiếu xuất hàng.');
  }
};


export interface ExportSlipItemDetail {
    mathang_id: string;
    ten: string;
    don_gia: number;
    don_vi_tinh: string;
    so_luong: number;
    thanh_tien: number;
}

export interface ExportSlipDetails {
    phieu_id: string;
    daily_name: string;
    ngay_lap_phieu: string; // ISO date string
    nhan_vien_lap_phieu: string;
    tong_tien: number;
    items: ExportSlipItemDetail[];
}

export async function getExportSlipDetailsAPI(id: string): Promise<ExportSlipDetails> {
    try {
    const response = await apiClient.get(`/export-sheets/${id}`);
    if (!response.data) {
      throw new Error('Không tìm thấy dữ liệu chi tiết phiếu xuất hàng.');
    }
    return response.data;
  } catch (error) {
    console.error('Error fetching export sheet detail by ID:', error);
    throw error;
  }
}