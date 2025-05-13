// src/front-end/app/services/authService.ts
import axios from 'axios';

// 1. Đặt API_BASE_URL chính xác
const API_BASE_URL = 'http://localhost:3000'; // Dựa trên Swagger UI của bạn

// Tạo một instance axios với cấu hình chung
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 2. Định nghĩa Interface cho Request Payload (đã khớp Swagger)
export interface LoginPayload {
  email: string;
  password: string;
}

// 3. Định nghĩa Interface cho Response (RẤT QUAN TRỌNG: Cần khớp với API của bạn)
//    Ví dụ này giả định API trả về user và accessToken. HÃY SỬA CHO ĐÚNG!
export interface AuthResponse {
  user: {
    id: string | number;
    email: string;
    name?: string;
    // Thêm các trường khác của user nếu API trả về
  };
  accessToken: string; // Hoặc tên token mà API của bạn trả về (ví dụ: token, jwt)
  // refreshToken?: string; // Nếu có
  message?: string; // Thêm message nếu API trả về thông báo thành công
}

// 4. Hàm gọi API Đăng nhập
export const loginUser = async (payload: LoginPayload): Promise<AuthResponse> => {
  try {
    console.log('AuthService: Attempting login with payload:', payload);
    // Endpoint là '/auth/login' so với API_BASE_URL
    const response = await apiClient.post<AuthResponse>('/auth/login', payload);
    console.log('AuthService: Login successful, response data:', response.data);

    // 5. Xử lý sau khi đăng nhập thành công (ví dụ: lưu token)
    if (response.data && response.data.accessToken) {
      localStorage.setItem('accessToken', response.data.accessToken);
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