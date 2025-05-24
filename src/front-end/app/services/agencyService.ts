// src/front-end/app/services/agencyService.ts
import axios from 'axios';
import apiClient from './apiClient'; // Giả sử apiClient.ts đã được tạo và cấu hình đúng

// --- INTERFACES ---

// 1. Interface cho đối tượng Đại lý THÔ từ API (tên trường tiếng Việt)
interface AgencyFromApi {
  daily_id: string | number;
  ten: string;
  dien_thoai: string;
  email: string;
  tien_no: string | number; // API có thể trả về string, sẽ chuyển thành number
  dia_chi: string;
  quan: string;
  loai_daily: string;
  ngay_tiep_nhan: string; // Format YYYY-MM-DD hoặc dd/MM/YYYY tùy API
 
}

// 2. Interface cho đối tượng Đại lý mà Frontend sẽ sử dụng (tên trường tiếng Anh)
export interface Agency {
  id: string | number;    // Từ daily_id
  name: string;         // Từ ten
  phone: string;        // Từ dien_thoai
  email: string;
  debt: number;         // Từ tien_no (đã chuyển thành number)
  address: string;      // Từ dia_chi
  district: string;     // Từ quan
  type: string;         // Từ loai_daily
  createdDate: string;  // Từ ngay_tiep_nhan
  stt?: number;         // Frontend sẽ tự thêm nếu cần cho hiển thị
}

// 3. Interface cho thông tin phân trang (meta object từ API)
export interface PaginationMeta {
  curPage: number;
  perPage: number;
  totalPage: number;
  prevPage: number | null;
  nextPage: number | null;
  totalItems: number;
}

// 4. Interface cho toàn bộ response THÔ từ API GET /agencies
// Đây là kiểu mà `apiClient.get` sẽ nhận được
interface RawAgenciesApiResponse {
  payload: AgencyFromApi[]; // Mảng các đối tượng đại lý thô từ API
  meta: PaginationMeta;     // Thông tin phân trang
}

// 5. Interface cho kết quả mà hàm getAgencies sẽ trả về cho component
// Bao gồm danh sách đại lý đã được map sang kiểu `Agency` và thông tin meta
export interface GetAgenciesResult {
  agencies: Agency[];
  meta: PaginationMeta;
}

// 6. Interface cho các tham số tìm kiếm và phân trang gửi lên API
// Tên các params này NÊN khớp với những gì backend mong đợi để tránh cần map phức tạp
export interface AgencySearchParams {
  ten?: string;        // Gửi dưới tên 'ten' nếu backend mong đợi vậy
  quan?: string;       // Gửi dưới tên 'quan'
  loai_daily?: string; // Gửi dưới tên 'loai_daily'
  tien_no?: number;    // Filter nợ <= giá trị này (backend có thể dùng tên khác như maxTienNo)
  page?: number;
  perPage?: number;    // Backend của bạn dùng 'perPage'
}

// 7. Interface cho dữ liệu thêm đại lý (gửi lên API)
// Tên trường phải khớp DTO của backend
export interface AddAgencyPayload {
    ten: string;
    dien_thoai: string;
    email?: string;
    tien_no: number;
    dia_chi: string;
    quan_id: string;        // Backend thường nhận ID cho quan hệ
    loai_daily_id: string;  // Backend thường nhận ID cho quan hệ
    ngay_tiep_nhan: string; // Format YYYY-MM-DD
    nhan_vien_tiep_nhan: string; // ID của nhân viên, backend cần trường này
}

//8. Interface cho cập nhật đại lý
export interface UpdateAgencyPayload {
  ten: string;
  dien_thoai: string;
  email?: string;
  tien_no: number;
  dia_chi: string;
  quan: string;
  loai_daily: string;
  ngay_tiep_nhan: string;
  loai_daily_id?: string;
  quan_id?: string;
}

// --- HELPER FUNCTIONS ---

// Hàm chuyển đổi từ AgencyFromApi (API) sang Agency (Frontend)
const mapToAgency = (apiAgency: AgencyFromApi): Agency => ({
  id: apiAgency.daily_id,
  name: apiAgency.ten,
  phone: apiAgency.dien_thoai,
  email: apiAgency.email,
  debt: Number(apiAgency.tien_no), // Quan trọng: Chuyển đổi sang number
  address: apiAgency.dia_chi,
  district: apiAgency.quan,
  type: apiAgency.loai_daily,
  createdDate: apiAgency.ngay_tiep_nhan,
});

// Hàm xử lý lỗi chung
const handleError = (error: any, defaultMessage: string): Error => {
    console.error(`AgencyService Error - ${defaultMessage}:`, error);
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

// --- API FUNCTIONS ---

/**
 * Lấy danh sách đại lý từ API với filter và phân trang.
 * @param params Các tham số tìm kiếm và phân trang (đã có tên trường khớp backend).
 * @returns Promise chứa đối tượng GetAgenciesResult.
 */
export const getAgencies = async (params?: AgencySearchParams): Promise<GetAgenciesResult> => {
  try {
    // Không cần map params nữa nếu AgencySearchParams đã dùng tên trường của backend
    console.log('AgencyService: Fetching agencies with params:', params);
    const response = await apiClient.get<RawAgenciesApiResponse>('/agency/list', { params });
    console.log('AgencyService: Raw API response received:', response.data);

    if (response.data && Array.isArray(response.data.payload) && response.data.meta) {
      const mappedAgencies = response.data.payload.map(mapToAgency);
      console.log('AgencyService: Mapped agencies:', mappedAgencies);
      return {
        agencies: mappedAgencies,
        meta: response.data.meta,
      };
    } else {
      console.error("AgencyService: API response for agencies is not in the expected format (missing payload or meta, or payload is not an array). Response:", response.data);
      // Trả về cấu trúc mặc định để component không bị lỗi khi truy cập meta
      return {
        agencies: [],
        meta: { curPage: 1, perPage: params?.perPage || 10, totalPage: 0, prevPage: null, nextPage: null, totalItems: 0 },
      };
    }
  } catch (error) {
    throw handleError(error, 'Không thể tải danh sách đại lý.');
  }
};

/**
 * Thêm một đại lý mới.
 * @param payload Dữ liệu đại lý (theo AddAgencyPayload, tên trường khớp backend DTO).
 * @returns Promise chứa đối tượng Agency của đại lý vừa tạo (đã được map cho Frontend).
 */
export const addAgency = async (payload: AddAgencyPayload): Promise<Agency> => {
  try {
    console.log('AgencyService: Adding agency with payload:', payload);
    // API có thể trả về đối tượng AgencyFromApi
    const response = await apiClient.post<AgencyFromApi>('/agency/create', payload); // Đảm bảo endpoint đúng
    if (!response.data) {
      throw new Error('Không có dữ liệu được trả về từ API sau khi thêm đại lý.');
    }
    console.log('AgencyService: Agency added successfully (raw API response):', response.data);
    return mapToAgency(response.data); // Map lại về kiểu Agency của frontend
  } catch (error) {
    throw handleError(error, 'Không thể thêm đại lý.');
  }
};

// --- Các service khác cho Loại đại lý, Quận ---
// Đảm bảo tên trường trong interface khớp với API response
export interface AgencyTypeFromAPI { loai_daily_id: string; ten_loai: string; /* các trường khác */ }
export interface DistrictFromAPI { districtId: string; name: string; /* các trường khác */ }

export const fetchAgencyTypesAPI = async (): Promise<AgencyTypeFromAPI[]> => {
    try {
        const response = await apiClient.get<AgencyTypeFromAPI[]>('/agencyType/list'); // Endpoint của bạn
        return response.data || [];
    } catch (error) {
        throw handleError(error, 'Lỗi tải loại đại lý.');
    }
};

export const fetchDistrictsAPI = async (): Promise<DistrictFromAPI[]> => {
    try {
        const response = await apiClient.get<DistrictFromAPI[]>('/districts'); // Endpoint của bạn
        return response.data || [];
    } catch (error) {
        throw handleError(error, 'Lỗi tải danh sách quận.');
    }
};

// --- Hàm lấy chi tiết đại lý theo ID ---
export const fetchAgencyByIdAPI = async (agencyId: string | number): Promise<Agency> => {
  try {
    const response = await apiClient.get<AgencyFromApi>(`/agency/detail/${agencyId}`); // Endpoint của bạn
    if (!response.data) {
        throw new Error('Không tìm thấy dữ liệu chi tiết cho đại lý.');
    }
    return mapToAgency(response.data);
  } catch (error) {
    throw handleError(error, 'Không thể tải chi tiết đại lý.');
  }
};



export const deleteAgencyById = async (id: string | number): Promise<void> => {
  try {
    await apiClient.delete(`/agency/delete/${id}`);
  } catch (error) {
    throw handleError(error, `Không thể xóa đại lý với ID ${id}`);
  }
};

export const updateAgencyByIdAPI = async (id: string | number, payload: UpdateAgencyPayload): Promise<void> => {
  try {
    await apiClient.put(`/agency/update/${id}`, payload);
  } catch (error) {
    throw handleError(error, `Không thể cập nhật đại lý với ID ${id}`);
  }
};

export const getAllAgencies = async (): Promise<Agency[]> => {
  const allAgencies: Agency[] = [];
  let currentPage = 1;
  const perPage = 100;
  let totalPages = 1;

  try {
    do {
      const { agencies, meta } = await getAgencies({ page: currentPage, perPage });
      allAgencies.push(...agencies);
      totalPages = meta.totalPage;
      currentPage++;
    } while (currentPage <= totalPages);

    return allAgencies;
  } catch (error) {
    throw handleError(error, 'Không thể tải toàn bộ danh sách đại lý.');
  }
};


