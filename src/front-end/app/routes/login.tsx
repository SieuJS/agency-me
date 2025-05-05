// --- Import các thư viện cần thiết ---
import React, { useState, useEffect, type FormEvent } from 'react';
import { useNavigate } from 'react-router';

// --- Import các UI Component ---
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Dialog } from '../components/ui/Dialog';

// --- Giả lập hàm gọi API (Giữ nguyên) ---
const fakeLoginApi = (username: string, password: string) => {
    // ... (code fakeLoginApi như cũ) ...
     return new Promise((resolve, reject) => {
       setTimeout(() => {
         if (username === 'admin' && password === 'password123') {
           resolve({ success: true, message: 'Đăng nhập thành công!' });
         } else {
           reject(new Error('Tài khoản hoặc mật khẩu không đúng.'));
         }
       }, 1500);
     });
};
// --- Kết thúc hàm giả lập ---

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isErrorDialogOpen, setIsErrorDialogOpen] = useState(false);
  const [apiErrorMessage, setApiErrorMessage] = useState('');
  const navigate = useNavigate();

  // --- Hàm Validation độ dài mật khẩu ---
  const validatePasswordLength = (pwd: string): string => {
      // Chỉ kiểm tra độ dài nếu password không rỗng
      if (pwd && pwd.length < 6) {
          return 'Mật khẩu phải có ít nhất 6 ký tự.';
      }
      return ''; // Không có lỗi độ dài
  };

  // --- useEffect để xử lý validation mật khẩu ---
  useEffect(() => {
    // Ưu tiên kiểm tra: Nếu chưa nhập username mà đã nhập password
    if (!username && password.length > 0) {
      setPasswordError('Vui lòng nhập tên đăng nhập trước.');
    } else {
      // Nếu đã nhập username (hoặc password rỗng), thì kiểm tra độ dài password
      const lengthError = validatePasswordLength(password);
      setPasswordError(lengthError); // Set lỗi độ dài (hoặc chuỗi rỗng nếu hợp lệ)
    }
  }, [username, password]); // Chạy lại mỗi khi username hoặc password thay đổi

  // --- Xác định trạng thái Disable cho Button  ---
  // Nút vẫn bị disable nếu có lỗi ở password (bất kể lỗi gì) hoặc thiếu input
  const isButtonDisabled = isLoading || passwordError !== '' || !username || !password;

  // --- Submit Handler ---
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
       event.preventDefault();

       // Kiểm tra validation lần cuối trước khi submit
       let finalPasswordError = '';
       if (!username && password.length > 0) {
           finalPasswordError = 'Vui lòng nhập tên đăng nhập trước.';
       } else if (username && password) { // Chỉ kiểm tra độ dài nếu cả hai đã nhập
           finalPasswordError = validatePasswordLength(password);
       }
       setPasswordError(finalPasswordError); // Cập nhật state lỗi

       // Dừng nếu có lỗi validation hoặc thiếu input cơ bản
       if (finalPasswordError || !username || !password) {
           return;
       }

  
       setIsLoading(true);
       setIsErrorDialogOpen(false);
       setApiErrorMessage('');
       try {
           await fakeLoginApi(username, password);
           navigate('/admin/agency-add'); // Chuyển hướng đến trang agency-lookup sau khi đăng nhập thành công
       } catch (error) {
           const message = error instanceof Error ? error.message : 'Đã có lỗi.';
           setApiErrorMessage(message);
           setIsErrorDialogOpen(true);
       } finally {
           setIsLoading(false);
       }
  };

  // --- JSX ---
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-600 p-4">
      <div className="bg-slate-300 p-8 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
          ĐĂNG NHẬP
        </h1>
        <form onSubmit={handleSubmit} noValidate>
          <Input
            label="Tài khoản"
            id="username"
            name="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            disabled={isLoading} // Chỉ disable khi loading
            required
            autoComplete="username"
          />

          <Input
            label="Mật khẩu"
            id="password"
            name="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={passwordError} // Hiển thị lỗi (bao gồm cả lỗi yêu cầu username)
            disabled={isLoading} // *** Chỉ disable khi loading ***
            required
            autoComplete="current-password"
          />

          <div className="mt-8">
            <Button type="submit" isLoading={isLoading} disabled={isButtonDisabled}>
              Đăng nhập
            </Button>
          </div>
        </form>
      </div>
      <Dialog
        isOpen={isErrorDialogOpen}
        onClose={() => setIsErrorDialogOpen(false)}
        title="Đăng nhập thất bại"
        message={apiErrorMessage}
      />
    </div>
  );
}