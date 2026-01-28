import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { Flower2, Lock, Eye, EyeOff, Loader2, User } from "lucide-react";
// 1. Import toast
import { toast } from "react-toastify";
import { useAuth } from "../../contexts/AuthContext";

export const LoginPage = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await login({
        username: formData.username,
        password: formData.password,
      });

      // 2. Thông báo thành công
      toast.success("Chào mừng bạn quay trở lại!");

      navigate("/");
    } catch (err) {
      console.error(err);

      // 3. Thông báo lỗi
      // Bạn có thể lấy message từ API nếu có: err.response?.data?.message
      toast.error("Đăng nhập thất bại! Vui lòng kiểm tra lại tài khoản.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-rose-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-2xl shadow-xl border border-rose-100">
        <div className="text-center">
          <div className="mx-auto bg-rose-100 w-16 h-16 rounded-full flex items-center justify-center mb-4">
            <Flower2 className="h-8 w-8 text-rose-600" />
          </div>
          <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">
            Chào mừng trở lại
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Đăng nhập để tiếp tục mua sắm tại{" "}
            <span className="text-rose-600 font-semibold">FlowerShop</span>
          </p>
        </div>

        {/* Đã xóa phần hiển thị lỗi bằng div màu đỏ, thay thế bằng toast */}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            {/* Username Input */}
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Tên đăng nhập
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  value={formData.username}
                  onChange={handleChange}
                  className="appearance-none block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all sm:text-sm"
                  placeholder="Nhập tên đăng nhập"
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700"
                >
                  Mật khẩu
                </label>
                <div className="text-sm">
                  <Link
                    to="/forgot-password"
                    className="font-medium text-rose-600 hover:text-rose-500 transition-colors"
                  >
                    Quên mật khẩu?
                  </Link>
                </div>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="appearance-none block w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all sm:text-sm"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 focus:outline-none"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>
          </div>

          <div className="flex items-center">
            <input
              id="remember-me"
              name="remember-me"
              type="checkbox"
              className="h-4 w-4 text-rose-600 focus:ring-rose-500 border-gray-300 rounded"
            />
            <label
              htmlFor="remember-me"
              className="ml-2 block text-sm text-gray-900"
            >
              Ghi nhớ đăng nhập
            </label>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="group relative w-full flex justify-center py-2.5 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-rose-600 hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500 disabled:opacity-70 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg"
          >
            {isLoading ? (
              <>
                <Loader2 className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" />
                Đang xử lý...
              </>
            ) : (
              "Đăng nhập"
            )}
          </button>

          <div className="text-center mt-4">
            <p className="text-sm text-gray-600">
              Bạn chưa có tài khoản?{" "}
              <Link
                to="/register"
                className="font-medium text-rose-600 hover:text-rose-500 transition-colors"
              >
                Đăng ký ngay
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};
