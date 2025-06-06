// src/front-end/app/services/authService.ts
import axios from 'axios';
//import Agency from '../routes/agency/agency-lookup'; // Giả sử Agency được định nghĩa trong apiClient.ts

// *** ĐẢM BẢO URL NÀY ĐÚNG VỚI BACKEND CỦA BẠN ***
const API_BASE_URL = 'http://localhost:3000'; // Ví dụ: backend có /api prefix
// Hoặc: const API_BASE_URL = 'http://localhost:3000'; // Nếu backend không có /api prefix

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});



// 2. Định nghĩa Interface cho Request Payload 

export interface LoginPayload {
  email: string;
  password: string;
}

// 3. Định nghĩa Interface cho Response
export interface AuthResponse {
  access_token: string;
  user: {
  nhan_vien_id: string;
  ten: string;
  dien_thoai: string;
  email: string;
  loai_nhan_vien_id: string;
  dia_chi: string;
  mat_khau: string;
  ngay_them: string;
  };
}

// --- Hàm xử lý lỗi chung cho Auth ---
const handleAuthError = (error: any, defaultMessage: string): Error => {
    console.error(`AuthService Error: ${defaultMessage}`, error);
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



export const loginUser = async (payload: LoginPayload): Promise<AuthResponse> => {
  try {
    console.log('AuthService: Attempting login with payload:', payload);
    const response = await apiClient.post<AuthResponse>('/auth/login', payload); // Endpoint đăng nhập
    console.log('AuthService: Login successful, response data:', response.data);

    if (response.data && response.data.access_token) { // Sửa thành access_token nếu API trả về vậy
      localStorage.setItem('accessToken', response.data.access_token);
      if (response.data.user) {
        localStorage.setItem('userData', JSON.stringify(response.data.user));
      }
      console.log('AuthService: Token and user data stored.');
    } else {
      console.warn('AuthService: Login response successful but no access_token found.');
      // throw new Error('Phản hồi đăng nhập không hợp lệ từ server.'); // Cân nhắc ném lỗi
    }
    return response.data;
  } catch (error) {
    throw handleAuthError(error, 'Email hoặc mật khẩu không đúng.');
  }
};

// --- Hàm Logout ---
export const logoutUser = (): void => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('userData');
    console.log('AuthService: User logged out, token and user data removed.');
};

// --- Hàm kiểm tra Đăng nhập ---
export const isAuthenticated = (): boolean => {
    const token = localStorage.getItem('accessToken');
    // Trong tương lai, bạn có thể thêm logic kiểm tra token hết hạn ở đây
    // Ví dụ, giải mã token và kiểm tra trường 'exp'
    return !!token; // Trả về true nếu có token
};

// --- Các hàm tiện ích lấy thông tin ---
export const getAuthToken = (): string | null => {
    return localStorage.getItem('accessToken');
};

export const getUserData = (): AuthResponse['user'] | null => { // Sử dụng kiểu User từ AuthResponse
    const userDataString = localStorage.getItem('userData');
    try {
        return userDataString ? JSON.parse(userDataString) : null;
    } catch (e) {
        console.error("AuthService: Error parsing user data from localStorage", e);
        return null;
    }
};

export const getUserRole = (): 'admin' | 'staff' | string | null => { 
    const userData = getUserData();
    return userData ? userData.loai_nhan_vien_id : null;
};