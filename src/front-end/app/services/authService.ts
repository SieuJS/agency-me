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

// 4. Hàm gọi API Đăng nhập
export const loginUser = async (payload: LoginPayload): Promise<AuthResponse> => {
  try {
    console.log('AuthService: Attempting login with payload:', payload);
    // Endpoint là '/auth/login' so với API_BASE_URL
    const response = await apiClient.post<AuthResponse>('/auth/login', payload);
    console.log('AuthService: Login successful, response data:', response.data);

    // 5. Xử lý sau khi đăng nhập thành công (ví dụ: lưu token)
    if (response.data && response.data.access_token) {
      localStorage.setItem('accessToken', response.data.access_token);
      if (response.data.user) {
        localStorage.setItem('userData', JSON.stringify(response.data.user));
      }
      console.log('AuthService: Token and user data stored in localStorage.');
    } else {
      // Trường hợp API thành công (status 2xx) nhưng không có accessToken như mong đợi
      console.warn('AuthService: Login response successful but no accessToken found.');
      // Có thể ném lỗi ở đây nếu accessToken là bắt buộc
      // throw new Error('Phản hồi đăng nhập không hợp lệ từ server.');
    }

    return response.data;
  } catch (error) {
    console.error("AuthService: Login API error:", error);
    if (axios.isAxiosError(error) && error.response) {
      // Ném lỗi với message từ backend để component hiển thị
      const backendError = error.response.data;
      let errorMessage = 'Email hoặc mật khẩu không đúng.'; // Mặc định
      if (backendError && backendError.message) {
          errorMessage = Array.isArray(backendError.message) ? backendError.message.join(', ') : backendError.message;
      } else if (typeof backendError === 'string') {
          errorMessage = backendError;
      }
      throw new Error(errorMessage);
    }
    // Lỗi không phải từ Axios (ví dụ: lỗi mạng)
    throw new Error('Lỗi kết nối hoặc lỗi không xác định khi đăng nhập.');
  }
};

// --- Các hàm tiện ích khác (tùy chọn) ---
export const logoutUser = (): void => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('userData');
    // Gọi API logout của backend nếu có
    console.log('AuthService: User logged out.');
};

export const getAuthToken = (): string | null => {
    return localStorage.getItem('accessToken');
};

export const getUserData = (): any | null => { // Nên tạo kiểu User cụ thể
    const userDataString = localStorage.getItem('userData');
    try {
        return userDataString ? JSON.parse(userDataString) : null;
    } catch (e) {
        console.error("AuthService: Error parsing user data from localStorage", e);
        return null;
    }
};

export const isAuthenticated = (): boolean => {
    return !!getAuthToken(); // True nếu có token
};