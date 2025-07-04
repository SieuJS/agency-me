// src/front-end/app/routes/login.tsx
import React, { useState, useEffect, type FormEvent } from 'react';
import { useNavigate } from 'react-router';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { loginUser, type LoginPayload, isAuthenticated, getUserRole, logoutUser } from '../services/authService';
import toast, { Toaster } from 'react-hot-toast';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // --- KIỂM TRA NẾU ĐÃ ĐĂNG NHẬP ---
  useEffect(() => {
    if (isAuthenticated()) {
      const role = getUserRole();
      if (role === 'admin') {
        navigate('/admin/agency/lookup', { replace: true });
      } else if (role === 'staff') {
        navigate('/staff/agency/lookup', { replace: true });
      } else {
        logoutUser();
        navigate('/login', { replace: true });
      }
    }
  }, [navigate]);

  // --- CÁC HÀM VALIDATION (Không đổi) ---
  const validateEmail = (emailValue: string): string => {
    if (!emailValue.trim()) return 'Email không được để trống.';
    if (!/\S+@\S+\.\S+/.test(emailValue)) return 'Định dạng email không hợp lệ.';
    return '';
  };

  const validatePasswordLength = (pwd: string): string => {
    if (!pwd) return 'Mật khẩu không được để trống.';
    if (pwd.length < 6) return 'Mật khẩu phải có ít nhất 6 ký tự.';
    return '';
  };

  // --- VALIDATE EMAIL KHI THAY ĐỔI ---
  useEffect(() => {
    if (email) {
      setEmailError(validateEmail(email));
    } else {
      setEmailError('');
    }
  }, [email]);

  // --- LOGIC MỚI: VALIDATE MẬT KHẨU NGAY LẬP TỨC KHI GÕ ---
  useEffect(() => {
    // Nếu người dùng đã bắt đầu gõ vào ô mật khẩu (password không rỗng)
    if (password) {
      // Kiểm tra ngay lập tức xem có đủ 6 ký tự không
      if (password.length < 6) {
        setPasswordError('Mật khẩu phải có ít nhất 6 ký tự.');
      } else {
        // Nếu đã đủ 6 ký tự trở lên, xóa lỗi ngay lập tức
        setPasswordError('');
      }
    } else {
      // Nếu người dùng xóa hết ký tự, cũng xóa thông báo lỗi
      setPasswordError('');
    }
  }, [password]); // Chỉ cần theo dõi sự thay đổi của `password`


  const isButtonDisabled = isLoading || !!emailError || !!passwordError || !email.trim() || !password;

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // Vẫn cần kiểm tra lần cuối trước khi submit để đảm bảo các trường không bị bỏ trống
    const currentEmailError = validateEmail(email);
    const currentPasswordError = validatePasswordLength(password);
    
    setEmailError(currentEmailError);
    setPasswordError(currentPasswordError);

    if (currentEmailError || currentPasswordError) {
      if (currentEmailError) toast.error(currentEmailError);
      if (currentPasswordError) toast.error(currentPasswordError);
      return;
    }

    setIsLoading(true);
    const payload: LoginPayload = { email: email.trim(), password };

    try {
      const authData = await loginUser(payload);
      toast.success('Đăng nhập thành công!');

      const userRole = authData.user?.loai_nhan_vien_id;

      setTimeout(() => {
        if (userRole === 'admin') {
          navigate('/admin/agency/lookup');
        } else if (userRole === 'staff') {
          navigate('/staff/agency/lookup');
        } else {
          toast.error("Không thể xác định vai trò người dùng. Vui lòng liên hệ quản trị viên.");
          logoutUser();
          navigate('/login');
        }
      }, 1000);

    } catch (error) {
      const message = error instanceof Error ? error.message : 'Lỗi không xác định.';
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-600 p-4">
      <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
      <div className="bg-slate-300 p-8 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">ĐĂNG NHẬP</h1>
        <form onSubmit={handleSubmit} noValidate>
          <Input
            label="Email" id="email" name="email" type="email" value={email}
            onChange={(e) => setEmail(e.target.value)} error={emailError}
            disabled={isLoading} required autoComplete="email"
          />
          <Input
            label="Mật khẩu" id="password" name="password" type="password" value={password}
            onChange={(e) => setPassword(e.target.value)}
            // Không cần onBlur nữa
            error={passwordError}
            disabled={isLoading} required autoComplete="current-password"
          />
          <div className="mt-8">
            <Button type="submit" isLoading={isLoading} disabled={isButtonDisabled}>
              Đăng nhập
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}