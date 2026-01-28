import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Flower2, 
  Facebook, 
  Instagram, 
  Twitter, 
  MapPin, 
  Phone, 
  Mail, 
  Send 
} from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 pt-16 pb-8 border-t-4 border-rose-500">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          
          {/* --- Cột 1: Thông tin thương hiệu --- */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2 group mb-4">
              <div className="bg-rose-500 p-1.5 rounded-full">
                <Flower2 className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-white tracking-tight">
                Flower<span className="text-rose-500">Shop</span>
              </span>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed">
              Trao gửi yêu thương qua từng cánh hoa. Chúng tôi cung cấp các mẫu hoa tươi nghệ thuật cho mọi dịp đặc biệt trong cuộc sống của bạn.
            </p>
            <div className="flex space-x-4 pt-2">
              <a href="#" className="hover:text-rose-500 transition-colors bg-gray-800 p-2 rounded-full hover:bg-gray-700">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="hover:text-rose-500 transition-colors bg-gray-800 p-2 rounded-full hover:bg-gray-700">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="hover:text-rose-500 transition-colors bg-gray-800 p-2 rounded-full hover:bg-gray-700">
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* --- Cột 2: Liên kết nhanh --- */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-6 relative inline-block">
              Cửa Hàng
              <span className="absolute bottom-0 left-0 w-1/2 h-0.5 bg-rose-500 rounded-full"></span>
            </h3>
            <ul className="space-y-3">
              <li><Link to="/shop" className="hover:text-rose-500 transition-colors hover:pl-2 duration-200 block">Tất cả sản phẩm</Link></li>
              <li><Link to="/occasions" className="hover:text-rose-500 transition-colors hover:pl-2 duration-200 block">Hoa chúc mừng</Link></li>
              <li><Link to="/birthday" className="hover:text-rose-500 transition-colors hover:pl-2 duration-200 block">Hoa sinh nhật</Link></li>
              <li><Link to="/wedding" className="hover:text-rose-500 transition-colors hover:pl-2 duration-200 block">Hoa cưới</Link></li>
              <li><Link to="/sale" className="text-rose-400 hover:text-rose-300 transition-colors hover:pl-2 duration-200 block font-medium">Khuyến mãi</Link></li>
            </ul>
          </div>

          {/* --- Cột 3: Hỗ trợ khách hàng --- */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-6 relative inline-block">
              Hỗ Trợ
              <span className="absolute bottom-0 left-0 w-1/2 h-0.5 bg-rose-500 rounded-full"></span>
            </h3>
            <ul className="space-y-3">
              <li><Link to="/about" className="hover:text-rose-500 transition-colors hover:pl-2 duration-200 block">Về chúng tôi</Link></li>
              <li><Link to="/contact" className="hover:text-rose-500 transition-colors hover:pl-2 duration-200 block">Liên hệ</Link></li>
              <li><Link to="/policy" className="hover:text-rose-500 transition-colors hover:pl-2 duration-200 block">Chính sách giao hàng</Link></li>
              <li><Link to="/faq" className="hover:text-rose-500 transition-colors hover:pl-2 duration-200 block">Câu hỏi thường gặp</Link></li>
              <li><Link to="/terms" className="hover:text-rose-500 transition-colors hover:pl-2 duration-200 block">Điều khoản sử dụng</Link></li>
            </ul>
          </div>

          {/* --- Cột 4: Liên hệ & Newsletter --- */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-6 relative inline-block">
              Liên Hệ
              <span className="absolute bottom-0 left-0 w-1/2 h-0.5 bg-rose-500 rounded-full"></span>
            </h3>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
                <span>123 Đường Hoa Lan, Quận 1, TP. Hồ Chí Minh</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-rose-500 shrink-0" />
                <span>1900 123 456</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-rose-500 shrink-0" />
                <span>contact@flowershop.vn</span>
              </li>
            </ul>

            <div className="mt-6">
              <h4 className="text-white text-sm font-medium mb-3">Đăng ký nhận tin</h4>
              <form className="flex">
                <input 
                  type="email" 
                  placeholder="Email của bạn..." 
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-l-md focus:outline-none focus:border-rose-500 text-sm text-white"
                />
                <button className="bg-rose-600 hover:bg-rose-700 text-white px-4 py-2 rounded-r-md transition-colors flex items-center justify-center">
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* --- Bottom Footer --- */}
        <div className="border-t border-gray-800 pt-8 mt-8 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
          <p>&copy; {new Date().getFullYear()} FlowerShop. All rights reserved.</p>
          <div className="flex gap-4 mt-4 md:mt-0">
             <span className="hover:text-gray-300 cursor-pointer">Privacy Policy</span>
             <span className="hover:text-gray-300 cursor-pointer">Terms of Service</span>
          </div>
        </div>
      </div>
    </footer>
  );
};