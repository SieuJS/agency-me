// src/front-end/app/services/agencyService.ts
import apiClient from './apiClient'; // Import apiClient đã tạo
import axios from 'axios';

// --- Interfaces ---
interface AgencyFromApi {
  daily_id: string | number; ten: string; dien_thoai: string; email: string;
  tien_no: string | number; dia_chi: string; quan: string;
  loai_daily: string; ngay_tiep_nhan: string;
}

export interface Agency {
  id: string | number; name: string; phone: string; email: string;
  debt: number; address: string; district: string; type: string;
  createdDate: string; stt?: number;
}

export interface AgenciesApiResponse {
  payload: AgencyFromApi[];
  meta: { 
    curPage: number;
    perPage: number;
    totalPage: number;
    prevPage: number | null;
    nextPage: number | null;
    totalItems: number;
   };
}

export interface AgencySearchParams {
  ten?: string; quan?: string; loai_daily?: string; tien_no?: number; page?: number; limit?: number;
}

export interface AddAgencyPayload {
    ten: string;
    dien_thoai: string;
    email?: string;
    tien_no: number;
    dia_chi: string; 
    quan_id: string; 
    loai_daily_id: string; 
    ngay_tiep_nhan: string; 
    nhan_vien_tiep_nhan: string;
}

const mapToAgency = (apiAgency: AgencyFromApi): Agency => ({
  id: apiAgency.daily_id, name: apiAgency.ten, phone: apiAgency.dien_thoai,
  email: apiAgency.email, debt: Number(apiAgency.tien_no), address: apiAgency.dia_chi,
  district: apiAgency.quan, type: apiAgency.loai_daily, createdDate: apiAgency.ngay_tiep_nhan,
});

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


export const getAgencies = async (params?: AgencySearchParams): Promise<Agency[]> => {
  try {
    console.log('AgencyService: Fetching agencies with params:', params);
    const response = await apiClient.get<AgenciesApiResponse>('/agency/list', { params });
    if (response.data && Array.isArray(response.data.payload)) {
      return response.data.payload.map(mapToAgency);
    }
    return [];
  } catch (error) {
    throw handleError(error, 'Không thể tải danh sách đại lý.');
  }
};

export const addAgency = async (payload: AddAgencyPayload): Promise<Agency> => {
  try {
    console.log('AgencyService: Adding agency with payload:', payload);
    const response = await apiClient.post<AgencyFromApi>('/agency/create', payload); // Endpoint có thể là /agency/create
    if (!response.data) {
      throw new Error('Không có dữ liệu từ API.');
    }
    return mapToAgency(response.data);
  } catch (error) {
    throw handleError(error, 'Không thể thêm đại lý.');
  }
};

// Các service khác cho Loại đại lý, Quận (nếu bạn muốn tách ra)
interface AgencyTypeFromAPI { loai_daily_id: string; ten_loai: string; }
interface DistrictFromAPI { districtId: string; name: string; } // Giả sử API trả về districtId và name

export const fetchAgencyTypesAPI = async (): Promise<AgencyTypeFromAPI[]> => {
    try {
        const response = await apiClient.get<AgencyTypeFromAPI[]>('/agencyType/list'); // Điều chỉnh endpoint
        return response.data || [];
    } catch (error) {
        throw handleError(error, 'Lỗi tải loại đại lý.');
    }
};

export const fetchDistrictsAPI = async (): Promise<DistrictFromAPI[]> => {
    try {
        const response = await apiClient.get<DistrictFromAPI[]>('/districts'); // Điều chỉnh endpoint
        return response.data || [];
    } catch (error) {
        throw handleError(error, 'Lỗi tải danh sách quận.');
    }
};

export interface AgencyDetails extends Agency {
  daily_id : string;
  ten : string;
  dien_thoai :string;
  email :string;
  tien_no : number;
  dia_chi : string;
  quan : string;
  loai_daily : string;
  ngay_tiep_nhan : string;
}

export const fetchAgencyByIdAPI = async (agencyId: string): Promise<AgencyDetails> => {
  // ----- BẮT ĐẦU CODE GIẢ ĐỊNH -----
  // Đây là code giả định, bạn cần thay thế bằng logic gọi API thật
  // Ví dụ: 
  try {
  const response = await apiClient.get<AgencyDetails>(`/agency/detail/${agencyId}`);
  return response.data;
} catch (error) {
  throw handleError(error, 'Không thể tải chi tiết đại lý.');
}}



