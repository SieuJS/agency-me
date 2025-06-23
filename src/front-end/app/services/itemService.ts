import apiClient from './apiClient'; // Import apiClient đã tạo
import axios from 'axios';

export interface Item {
  mathang_id: string;
  ten: string;
  don_gia: number;
  don_vi_tinh: string;
  ky_hieu: string;
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
 * Fetches the list of items (products).
 * TODO: Replace with actual API endpoint and error handling.
 */
export const fetchItemsAPI = async (): Promise<Item[]> => {
  // const response = await fetch(`${API_BASE_URL}/items`); // Replace with your actual endpoint
  // if (!response.ok) {
  //   throw new Error('Failed to fetch items');
  // }
  // return response.json();

  try {
  const response = await apiClient.get<Item[]>(`/item`);
  console.log('Response from fetchItemsAPI:', response.data);
  return response.data || [];
} catch (error) {
  throw handleError(error, 'Không thể hiển thị mặt hàng.');
}}