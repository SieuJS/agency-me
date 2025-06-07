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
  fromDate?: string;
  minAmount?: number;
  page: number;
  perPage: number;
}): Promise<{ receipts: Receipt[]; totalPage: number; }> => {
  // Mock implementation
  console.log("API called (ReceiptSearch) with params:", params);
  return new Promise(resolve => setTimeout(() => {
    const P_PAGE = params.perPage || 10;
    const P_TOTAL_ITEMS = params.agencyName === "Không tồn tại" ? 0 : 35;
    const P_TOTAL_PAGES = Math.ceil(P_TOTAL_ITEMS / P_PAGE);
    const P_CURRENT_PAGE = Math.min(params.page, P_TOTAL_PAGES) || 1;

    const itemsOnPage = (P_CURRENT_PAGE === P_TOTAL_PAGES && P_TOTAL_ITEMS % P_PAGE !== 0) ? P_TOTAL_ITEMS % P_PAGE : P_PAGE;

    resolve({
      receipts: P_TOTAL_ITEMS === 0 ? [] : Array.from({length: itemsOnPage }, (_, i) => ({
        id: `receipt_id_${P_CURRENT_PAGE}_${i}`,
        agencyName: params.agencyName || `Phiếu Thu Đại Lý ${(P_CURRENT_PAGE - 1) * P_PAGE + i + 1}`,
        amount: (Math.random() * 4500000) + (params.minAmount || 500000) + (Math.random() * 100000),
        date: params.fromDate || new Date(Date.now() - Math.random() * 1e10).toISOString(),
      })),
      totalPage: P_TOTAL_PAGES,
    });
  }, 300));
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

