import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { toast } from "react-toastify";
import {
  Flower2,
  User,
  Mail,
  Lock,
  Phone,
  MapPin,
  Eye,
  EyeOff,
  Loader2,
  ArrowRight,
} from "lucide-react";

const RegisterPage = () => {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // State chứa dữ liệu form
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    confirmPassword: "", // Thêm trường này để validate
    fullname: "",
    email: "",
    phoneNumber: "",
    address: "",
    avatar: "", // Có thể để trống hoặc set default
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 1. Validate mật khẩu nhập lại
    if (formData.password !== formData.confirmPassword) {
      toast.error("Mật khẩu nhập lại không khớp!");
      return;
    }

    setIsLoading(true);

    try {
      // 2. Gọi hàm register từ AuthProvider
      // Loại bỏ confirmPassword trước khi gửi API
      const { confirmPassword, ...registerData } = formData;
      // Nếu user không nhập avatar, có thể gán ảnh mặc định ở đây hoặc để backend xử lý
      const payload = {
        ...registerData,
        avatar:
          registerData.avatar ||
          "https://ui-avatars.com/api/?name=" + registerData.fullname,
      };

      await register(payload);

      // 3. Thông báo và chuyển hướng
      toast.success("🌸 Đăng ký tài khoản thành công! Vui lòng đăng nhập.");
      navigate("/login");
    } catch (err) {
      console.error(err);
      // Lấy message lỗi từ server nếu có
      const errorMessage =
        err.response?.data?.message || "Đăng ký thất bại. Vui lòng thử lại!";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Helper để render input field nhanh gọn
  const renderInput = (
    id,
    label,
    icon,
    type = "text",
    placeholder,
    colSpan = "col-span-1",
  ) => (
    <div className={colSpan}>
      <label
        htmlFor={id}
        className="block text-sm font-medium text-gray-700 mb-1"
      >
        {label}
      </label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          {icon}
        </div>
        <input
          id={id}
          name={id}
          type={type}
          required={id !== "avatar"} // Avatar có thể không bắt buộc
          value={formData[id]}
          onChange={handleChange}
          className="appearance-none block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all sm:text-sm"
          placeholder={placeholder}
        />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-rose-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl w-full space-y-8 bg-white p-8 md:p-10 rounded-2xl shadow-xl border border-rose-100">
        {/* --- Header --- */}
        <div className="text-center">
          <Link
            to="/"
            className="inline-block bg-rose-100 p-3 rounded-full mb-4 hover:bg-rose-200 transition-colors"
          >
            <Flower2 className="h-10 w-10 text-rose-600" />
          </Link>
          <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">
            Tạo tài khoản mới
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Trở thành thành viên của{" "}
            <span className="text-rose-600 font-bold">FlowerShop</span> để nhận
            nhiều ưu đãi.
          </p>
        </div>

        {/* --- Form --- */}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {/* Grid Layout cho các trường thông tin */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Cột trái: Thông tin cá nhân */}
            {renderInput(
              "fullname",
              "Họ và tên",
              <User className="h-5 w-5 text-gray-400" />,
              "text",
              "Nguyễn Văn A",
            )}
            {renderInput(
              "username",
              "Tên đăng nhập",
              <User className="h-5 w-5 text-gray-400" />,
              "text",
              "user123",
            )}

            {renderInput(
              "email",
              "Email",
              <Mail className="h-5 w-5 text-gray-400" />,
              "email",
              "email@example.com",
            )}
            {renderInput(
              "phoneNumber",
              "Số điện thoại",
              <Phone className="h-5 w-5 text-gray-400" />,
              "tel",
              "0901234567",
            )}

            {/* Full width: Địa chỉ */}
            {renderInput(
              "address",
              "Địa chỉ giao hàng",
              <MapPin className="h-5 w-5 text-gray-400" />,
              "text",
              "Số 1, Đường Hoa, Quận 1",
              "md:col-span-2",
            )}

            {/* Mật khẩu */}
            <div className="col-span-1">
              <label
                htmlFor="password"
                class="block text-sm font-medium text-gray-700 mb-1"
              >
                Mật khẩu
              </label>
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
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Nhập lại Mật khẩu */}
            <div className="col-span-1">
              <label
                htmlFor="confirmPassword"
                class="block text-sm font-medium text-gray-700 mb-1"
              >
                Xác nhận mật khẩu
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showPassword ? "text" : "password"}
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="appearance-none block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all sm:text-sm"
                  placeholder="••••••••"
                />
              </div>
            </div>
          </div>

          {/* Điều khoản */}
          <div className="flex items-center">
            <input
              id="terms"
              name="terms"
              type="checkbox"
              required
              className="h-4 w-4 text-rose-600 focus:ring-rose-500 border-gray-300 rounded"
            />
            <label htmlFor="terms" className="ml-2 block text-sm text-gray-900">
              Tôi đồng ý với{" "}
              <a
                href="#"
                className="text-rose-600 hover:text-rose-500 hover:underline"
              >
                Điều khoản dịch vụ
              </a>{" "}
              và{" "}
              <a
                href="#"
                className="text-rose-600 hover:text-rose-500 hover:underline"
              >
                Chính sách bảo mật
              </a>
            </label>
          </div>

          {/* Buttons */}
          <div className="flex flex-col gap-4">
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-rose-600 hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500 disabled:opacity-70 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg"
            >
              {isLoading ? (
                <>
                  <Loader2 className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" />
                  Đang đăng ký...
                </>
              ) : (
                "Tạo tài khoản"
              )}
            </button>

            <div className="text-center">
              <p className="text-sm text-gray-600">
                Đã có tài khoản?{" "}
                <Link
                  to="/login"
                  className="font-medium text-rose-600 hover:text-rose-500 transition-colors inline-flex items-center"
                >
                  Đăng nhập ngay <ArrowRight className="w-4 h-4 ml-1" />
                </Link>
              </p>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;
