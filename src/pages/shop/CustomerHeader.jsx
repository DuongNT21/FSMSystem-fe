import React from "react";
import { Link, NavLink } from "react-router-dom";
import { ShoppingCart, Menu, Phone, MapPin, Flower2 } from "lucide-react";

export const CustomerHeader = () => {
  return (
    <header className="sticky top-0 z-50 w-full bg-white shadow-sm">
      {/* Top Bar */}
      <div className="bg-slate-50 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-10 flex items-center justify-between text-xs font-medium text-slate-600">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-1.5">
              <Phone size={14} className="text-rose-500" />
              <span>0123 456 789</span>
            </div>
            <div className="flex items-center gap-1.5">
              <MapPin size={14} className="text-rose-500" />
              <span>70 Tô Ký, Hóc Môn, TP. HCM</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <a className="hover:text-rose-500 transition-colors" href="#">Đăng nhập</a>
            <span className="text-slate-300">|</span>
            <a className="hover:text-rose-500 transition-colors" href="#">Đăng ký</a>
          </div>
        </div>
      </div>

      {/* Main Nav */}
      <div className="border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <Link to="/" className="flex items-center gap-2 text-rose-500">
              <Flower2 size={32} fill="currentColor" />
              <h1 className="text-slate-900 text-2xl font-extrabold tracking-tight">FlowerShop</h1>
            </Link>
            
            <nav className="hidden lg:flex items-center gap-10">
              <NavLink to="/" className={({isActive}) => `text-[14px] font-bold uppercase tracking-wide hover:text-rose-500 transition-colors ${isActive ? 'text-rose-500' : 'text-slate-700'}`}>TRANG CHỦ</NavLink>
              <NavLink to="/products" className={({isActive}) => `text-[14px] font-bold uppercase tracking-wide hover:text-rose-500 transition-colors ${isActive ? 'text-rose-500' : 'text-slate-700'}`}>SẢN PHẨM</NavLink>
              <NavLink to="/promotions" className={({isActive}) => `text-[14px] font-bold uppercase tracking-wide hover:text-rose-500 transition-colors ${isActive ? 'text-rose-500' : 'text-slate-700'}`}>KHUYẾN MÃI</NavLink>
              <NavLink to="/news" className={({isActive}) => `text-[14px] font-bold uppercase tracking-wide hover:text-rose-500 transition-colors ${isActive ? 'text-rose-500' : 'text-slate-700'}`}>TIN TỨC</NavLink>
              <NavLink to="/contact" className={({isActive}) => `text-[14px] font-bold uppercase tracking-wide hover:text-rose-500 transition-colors ${isActive ? 'text-rose-500' : 'text-slate-700'}`}>LIÊN HỆ</NavLink>
            </nav>

            <div className="flex items-center gap-4">
              <button className="p-2 rounded-full hover:bg-slate-50 transition-colors relative group">
                <ShoppingCart className="text-slate-700 group-hover:text-rose-500" size={24} />
                <span className="absolute top-0 right-0 w-4 h-4 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">2</span>
              </button>
              <button className="p-2 rounded-full hover:bg-slate-50 transition-colors group lg:hidden">
                <Menu className="text-slate-700 group-hover:text-rose-500" size={24} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
