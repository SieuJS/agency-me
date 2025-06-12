import apiClient from "./apiClient";

export interface Receipt {
  id: string | number;
  agencyName: string;
  amount: number;
  date: string;
  stt?: number;
}

export interface AddRecepitPayload {
  daily_id: string | number;
  ngay_thu: string;
  so_tien_thu: number;
}

interface ApiResponseMessage {
  message: string;
}

export interface ReceiptDebtReportInput{
  month: number;
  year: number;
}

export interface ReceiptDebtReportOutput {
  daily_id: string;
  ten: string;
  no_dau: number;
  phat_sinh: number;
  tien_thu: number;
  no_cuoi: number;
}

export const getReceipts = async (params: {
  agencyName?: string;
  ngay_thu?: string;
  minAmount?: number;
  page: number;
  perPage: number;
}): Promise<{ receipts: Receipt[]; totalPage: number }> => {
  try {
    const queryParams: any = {
      page: params.page,
      perPage: params.perPage,
    };

    if (params.agencyName) queryParams.daily_id = params.agencyName;
    if (params.ngay_thu) queryParams.ngay_thu = params.ngay_thu;
    if (params.minAmount !== undefined) queryParams.min_so_tien = params.minAmount;

    const response = await apiClient.get("/receipts", {
    params: queryParams,
    });
    
    // --- Phần xử lý cấu trúc API response giữ nguyên ---
    let rawData: any[] = [];
    let totalPage = 1;
    if (response.data && Array.isArray(response.data.data)) {
      rawData = response.data.data;
      totalPage = response.data.totalPage ?? 1;
    } 
    else if (Array.isArray(response.data)) {
      rawData = response.data;
    }
    // --- Kết thúc phần xử lý ---

    const receipts: Receipt[] = rawData.map((item: any, index: number) => ({
      id: item.phieu_thu_id,
      agencyName: item.daily_id,
      amount: item.so_tien_thu,
      date: item.ngay_thu,
      stt: (params.page - 1) * params.perPage + index + 1,
    }));

    return {
      receipts,
      totalPage,
    };
  } catch (error) {
    console.error("Error fetching receipts:", error);
    throw error;
  }
};



export const addReceipt = async (
  receipt: AddRecepitPayload
): Promise<string> => {
  try {
    console.log("API called (ReceiptAdd) with receipt:", receipt);
    // Kỳ vọng API trả về { message: string }
    const response = await apiClient.post<ApiResponseMessage>(
      '/receipts',
      receipt
    );
    if (!response.data || !response.data.message) {
      throw new Error(
        'Không có message được trả về từ API sau khi thêm phiếu thu.'
      );
    }
    console.log("API response message:", response.data.message);
    // Trả về đúng chuỗi message
    return response.data.message;
  } catch (error) {
    console.error("Error adding receipt:", error);
    throw error;
  }
}

export const getReceiptDebtReport = async (
  input: ReceiptDebtReportInput
): Promise<ReceiptDebtReportOutput[]> => {
  console.log("API called (ReceiptDebtReport) with input:", input);
 
  try {
    const response = await apiClient.post<ReceiptDebtReportOutput[]>(
      '/report/debt',
      input
    );
    if (!response.data || !Array.isArray(response.data)) {
      throw new Error('Không có dữ liệu báo cáo công nợ được trả về từ API.');
    }
    console.log("API response data:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error getting receipt debt report:", error);
    throw error;
  }
};

export interface ReceiptDetail {
  phieu_thu_id: string;
  daily_id: string;
  ngay_thu: string; // ISO date string
  so_tien_thu: number;

  agency: {
    name: string;
    address: string;
    phone: string;
    email?: string;
  };
}

export const getReceiptById = async (
  id: string | number
): Promise<ReceiptDetail> => {
  try {
    const response = await apiClient.get(`/receipts/${id}`);
    if (!response.data) {
      throw new Error('Không tìm thấy dữ liệu chi tiết phiếu thu.');
    }
    return response.data;
  } catch (error) {
    console.error('Error fetching receipt detail by ID:', error);
    throw error;
  }
};

