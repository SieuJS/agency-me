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
  perPage?: number;    // Backend của bạn dùng 'perPage'
}

// export const getExportSheets = async (params?: ExportSheetSearchParams): Promise<GetExportSheetsResult> => {
//   try {
//     // Không cần map params nữa nếu AgencySearchParams đã dùng tên trường của backend
//     const response = await apiClient.get<GetExportSheetsResult>('/export-sheets/list', { params });

//     if (response.data && Array.isArray(response.data.items) && response.data.meta) {
//       return response.data;
//     } else {
//       console.error("ExportSheetService: API response for export sheets is not in the expected format (missing payload or meta, or payload is not an array). Response:", response.data);
//       // Trả về cấu trúc mặc định để component không bị lỗi khi truy cập meta
//       return {
//         items: [],
//         meta: { curPage: 1, perPage: params?.perPage || 10, totalPage: 0, prevPage: null, nextPage: null, totalItems: 0 },
//       };
//     }
//   } catch (error) {
//     throw handleError(error, 'Không thể tải danh sách phiếu xuất hàng.');
//   }
// };

export const mockExportSheets = [
  {
    phieu_id: "ph1",
    daily_name: "Đại lý 3",
    ngay_lap_phieu: "2025-06-01",
    nhan_vien_lap_phieu: "nv1",
    tong_tien: 10000000,
  },
  {
    phieu_id: "ph2",
    daily_name: "Đại lý 2",
    ngay_lap_phieu: "2025-02-05",
    nhan_vien_lap_phieu: "nv2",
    tong_tien: 10000000,
  },
  {
    phieu_id: "ph3",
    daily_name: "Đại lý 1",
    ngay_lap_phieu: "2025-03-11",
    nhan_vien_lap_phieu: "nv1",
    tong_tien: 10000000,
  },
  {
    phieu_id: "ph4",
    daily_name: "Đại lý 5",
    ngay_lap_phieu: "2025-01-01",
    nhan_vien_lap_phieu: "nv2",
    tong_tien: 10000000,
  },
  {
    phieu_id: "ph5",
    daily_name: "Đại lý 6",
    ngay_lap_phieu: "2025-06-01",
    nhan_vien_lap_phieu: "nv1",
    tong_tien: 10000000,
  },
];

export const getExportSheets = async (params: any) => {
  const page = params.page || 1;
  const perPage = params.perPage || 10;

  let filtered = [...mockExportSheets];

  if (params.daily_name) {
    filtered = filtered.filter((item) => item.daily_name === params.daily_name);
  }

  if (params.ngay_lap_phieu) {
    filtered = filtered.filter((item) => item.ngay_lap_phieu === params.ngay_lap_phieu);
  }

  if (params.tong_tien) {
    filtered = filtered.filter((item) => item.tong_tien >= Number(params.tong_tien));
  }

  const start = (page - 1) * perPage;
  const end = start + perPage;

  return {
    items: filtered.slice(start, end),
    meta: {
      curPage: page,
      perPage: perPage,
      totalPage: Math.ceil(filtered.length / perPage),
    },
  };
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
    
  // return new Promise((resolve) => {
  //       setTimeout(() => {
  //           resolve({
  //               phieu_id: id,
  //               daily_name: "Đại Lý Beta",
  //               ngay_lap_phieu: "2025-06-11T09:14:41.966Z",
  //               nhan_vien_lap_phieu: "Nguyễn Văn A",
  //               tong_tien: 900000,
  //               items: [
  //                   {
  //                       mathang_id: "mh016",
  //                       ten: "Bột giặt OMO",
  //                       don_gia: 30000,
  //                       don_vi_tinh: "kg",
  //                       so_luong: 3,
  //                       thanh_tien: 90000,
  //                   },
  //                   {
  //                       mathang_id: "mh021",
  //                       ten: "Nước rửa chén Sunlight",
  //                       don_gia: 25000,
  //                       don_vi_tinh: "chai",
  //                       so_luong: 10,
  //                       thanh_tien: 250000,
  //                   },
  //                    {
  //                       mathang_id: "mh005",
  //                       ten: "Dầu ăn Tường An 1L",
  //                       don_gia: 56000,
  //                       don_vi_tinh: "chai",
  //                       so_luong: 10,
  //                       thanh_tien: 560000,
  //                   }
  //               ]
  //           });
  //       }, 1000); // Giả lập độ trễ mạng
  //   });
}

