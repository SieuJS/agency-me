// src/front-end/app/routes/login.tsx
import React, { useState, useEffect, type FormEvent } from 'react';
import { useNavigate } from 'react-router';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Dialog } from '../components/ui/Dialog';
import { loginUser, type LoginPayload, isAuthenticated } from '../services/authService'; // Import isAuthenticated
import toast, { Toaster } from 'react-hot-toast';


export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  // Có thể bỏ Dialog nếu bạn chỉ muốn dùng toast cho tất cả thông báo
  const [isErrorDialogOpen, setIsErrorDialogOpen] = useState(false);
  const [apiErrorMessage, setApiErrorMessage] = useState('');
  const navigate = useNavigate();

  // --- KIỂM TRA NẾU ĐÃ ĐĂNG NHẬP ---
  useEffect(() => {
    if (isAuthenticated()) {
      console.log('LoginPage: User already authenticated, redirecting to admin.');
      navigate('/agency/lookup', { replace: true }); // Chuyển hướng đến trang admin mặc định
    }
  }, [navigate]); // Chỉ chạy 1 lần khi component mount

  // --- Validation ---
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

  useEffect(() => {
    // Chỉ validate khi người dùng đã tương tác (gõ rồi xóa, hoặc blur)
    // Hoặc validate khi submit. Tạm thời để validate ngay khi thay đổi.
    if (email || emailError) { // Validate nếu email có giá trị hoặc đã có lỗi trước đó
        setEmailError(validateEmail(email));
    }
  }, [email]);

  useEffect(() => {
    if (password || passwordError) { // Validate nếu password có giá trị hoặc đã có lỗi trước đó
        if (!email.trim() && password.length > 0) {
            setPasswordError('Vui lòng nhập email trước.');
        } else if (email.trim() && !validateEmail(email)) {
            // Email không hợp lệ, không nên validate password vội
            setPasswordError(''); // Xóa lỗi password
        } else if (email.trim()) {
            setPasswordError(validatePasswordLength(password));
        } else {
            setPasswordError(''); // Email rỗng, password cũng nên xóa lỗi (trừ khi password có giá trị)
        }
    } else if (!password && !emailError) { // Nếu xóa password và email hợp lệ
        setPasswordError('');
    }
  }, [email, password, emailError]); // Thêm emailError vào dependencies


  

  const isButtonDisabled = isLoading || !!emailError || !!passwordError || !email.trim() || !password;

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
       event.preventDefault();

       const currentEmailError = validateEmail(email);
       setEmailError(currentEmailError);

       let currentPasswordError = '';
       if (!email.trim() && password.length > 0) {
           currentPasswordError = 'Vui lòng nhập email trước.';
       } else if (email.trim() && !currentEmailError) {
           currentPasswordError = validatePasswordLength(password);
       }
       setPasswordError(currentPasswordError);

       if (currentEmailError || currentPasswordError || !email.trim() || !password) {
           if (currentEmailError || !email.trim()) toast.error(currentEmailError || 'Email không được để trống.');
           if (currentPasswordError || !password) toast.error(currentPasswordError || 'Mật khẩu không được để trống.');
           return;
       }

       setIsLoading(true);
       // setIsErrorDialogOpen(false); // Không cần nếu dùng toast
       // setApiErrorMessage('');

       const payload: LoginPayload = { email: email.trim(), password };

       try {

           const authResponse = await loginUser(payload);
           toast.success('Đăng nhập thành công!');

           // Đợi một chút để người dùng đọc toast rồi mới chuyển hướng
           setTimeout(() => {
               navigate('agency/lookup'); // Điều hướng đến trang admin
           }, 1000);



       } catch (error) {
           const message = error instanceof Error ? error.message : 'Lỗi không xác định.';
           toast.error(message); // Hiển thị lỗi bằng Toast
           // setApiErrorMessage(message); // Nếu vẫn muốn dùng Dialog song song
           // setIsErrorDialogOpen(true);
       } finally {
           setIsLoading(false);
       }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-600 p-4">
      <Toaster position="top-right" toastOptions={{ duration: 3000 }} /> {/* Cấu hình Toaster */}
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
            onChange={(e) => setPassword(e.target.value)} error={passwordError}
            disabled={isLoading} required autoComplete="current-password"
          />
          <div className="mt-8">
            <Button type="submit" isLoading={isLoading} disabled={isButtonDisabled}>
              Đăng nhập
            </Button>
          </div>
        </form>
      </div>
      {/* Bạn có thể giữ Dialog nếu muốn dùng cho một số lỗi cụ thể, hoặc xóa đi nếu dùng toast cho tất cả */}
      {/* <Dialog isOpen={isErrorDialogOpen} onClose={() => setIsErrorDialogOpen(false)}
        title="Đăng nhập thất bại" message={apiErrorMessage}
      /> */}
    </div>
  );
}