import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { ShoppingCart, Menu, X, Search, User, Flower2 } from 'lucide-react';

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  // Giả lập số lượng hàng trong giỏ
  const cartItemCount = 3;

  // Class hỗ trợ active link (tô đậm khi đang ở trang đó)
  const navLinkClass = ({ isActive }) => 
    `hover:text-rose-500 transition-colors duration-200 font-medium ${isActive ? 'text-rose-600' : 'text-gray-600'}`;

  // Class cho mobile link
  const mobileLinkClass = "block px-4 py-2 text-gray-700 hover:bg-rose-50 hover:text-rose-600 rounded-md transition-colors";

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm border-b border-rose-100">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          {/* --- LOGO --- */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="bg-rose-100 p-2 rounded-full group-hover:bg-rose-200 transition-colors">
              <Flower2 className="w-6 h-6 text-rose-600" />
            </div>
            <span className="text-2xl font-bold text-gray-800 tracking-tight">
              Flower<span className="text-rose-500">Shop</span>
            </span>
          </Link>

          {/* --- DESKTOP NAVIGATION --- */}
          <nav className="hidden md:flex space-x-8">
            <NavLink to="/" className={navLinkClass}>Trang chủ</NavLink>
            <NavLink to="/shop" className={navLinkClass}>Sản phẩm</NavLink>
            <NavLink to="/shop/create" className={navLinkClass}>Tạo sản phẩm</NavLink>
            <NavLink to="/occasions" className={navLinkClass}>Chủ đề</NavLink>
            <NavLink to="/about" className={navLinkClass}>Về chúng tôi</NavLink>
            <NavLink to="/contact" className={navLinkClass}>Liên hệ</NavLink>
          </nav>

          {/* --- ICONS & ACTIONS --- */}
          <div className="hidden md:flex items-center space-x-6">
            {/* Search Icon */}
            <button className="text-gray-500 hover:text-rose-500 transition-colors">
              <Search className="w-5 h-5" />
            </button>

            {/* User Account */}
            <Link to="/login" className="text-gray-500 hover:text-rose-500 transition-colors">
              <User className="w-5 h-5" />
            </Link>

            {/* Cart Icon with Badge */}
            <Link to="/cart" className="relative text-gray-500 hover:text-rose-500 transition-colors group">
              <ShoppingCart className="w-5 h-5" />
              {cartItemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-rose-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center group-hover:bg-rose-600">
                  {cartItemCount}
                </span>
              )}
            </Link>
          </div>

          {/* --- MOBILE MENU BUTTON --- */}
          <div className="md:hidden flex items-center">
            <Link to="/cart" className="relative mr-4 text-gray-600">
               <ShoppingCart className="w-6 h-6" />
               {cartItemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-rose-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
            </Link>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-600 hover:text-rose-500 focus:outline-none"
            >
              {isMenuOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
            </button>
          </div>
        </div>
      </div>

      {/* --- MOBILE DROPDOWN MENU --- */}
      {/* Hiển thị khi isMenuOpen = true */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 py-4 px-4 shadow-lg absolute w-full left-0 animate-in slide-in-from-top-5 duration-200">
          <div className="flex flex-col space-y-2">
            {/* Mobile Search Input */}
            <div className="relative mb-4">
                <input 
                    type="text" 
                    placeholder="Tìm kiếm hoa..." 
                    className="w-full pl-10 pr-4 py-2 border border-rose-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent bg-rose-50/50"
                />
                <Search className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" />
            </div>

            <Link to="/" className={mobileLinkClass} onClick={() => setIsMenuOpen(false)}>Trang chủ</Link>
            <Link to="/shop" className={mobileLinkClass} onClick={() => setIsMenuOpen(false)}>Sản phẩm</Link>
            <Link to="/occasions" className={mobileLinkClass} onClick={() => setIsMenuOpen(false)}>Chủ đề</Link>
            <Link to="/about" className={mobileLinkClass} onClick={() => setIsMenuOpen(false)}>Về chúng tôi</Link>
            <Link to="/contact" className={mobileLinkClass} onClick={() => setIsMenuOpen(false)}>Liên hệ</Link>
            
            <div className="border-t border-gray-100 my-2 pt-2">
                <Link to="/login" className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-rose-50 rounded-md">
                    <User className="w-5 h-5" />
                    <span>Đăng nhập / Đăng ký</span>
                </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};