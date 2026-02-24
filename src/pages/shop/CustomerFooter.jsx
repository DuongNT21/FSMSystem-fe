import React from "react";
import { Flower2 } from "lucide-react";

export const CustomerFooter = () => {
  return (
    <footer className="bg-slate-50 border-t border-slate-100 mt-24 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 lg:gap-20">
          <div className="col-span-1">
            <div className="flex items-center gap-2 text-rose-500 mb-8">
              <Flower2 size={32} fill="currentColor" />
              <h2 className="text-slate-900 text-2xl font-extrabold tracking-tight">FlowerShop</h2>
            </div>
            <p className="text-slate-500 text-[15px] leading-relaxed">
              Nâng tầm trải nghiệm tặng hoa với những thiết kế bouquet độc bản, sang trọng và đầy cảm xúc. Tỉ mỉ trong từng cánh hoa.
            </p>
          </div>
          <div>
            <h4 className="font-extrabold text-slate-900 mb-8 text-lg">Khám phá</h4>
            <ul className="space-y-4 text-[15px] text-slate-500">
              <li><a className="hover:text-rose-500 transition-colors font-medium" href="#">Bộ sưu tập hoa cưới</a></li>
              <li><a className="hover:text-rose-500 transition-colors font-medium" href="#">Hoa sinh nhật ý nghĩa</a></li>
              <li><a className="hover:text-rose-500 transition-colors font-medium" href="#">Hoa khai trương hồng phát</a></li>
              <li><a className="hover:text-rose-500 transition-colors font-medium" href="#">Vật tư cắm hoa cao cấp</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-extrabold text-slate-900 mb-8 text-lg">Chăm sóc</h4>
            <ul className="space-y-4 text-[15px] text-slate-500">
              <li><a className="hover:text-rose-500 transition-colors font-medium" href="#">Vận chuyển & Thanh toán</a></li>
              <li><a className="hover:text-rose-500 transition-colors font-medium" href="#">Chính sách đổi trả 24h</a></li>
              <li><a className="hover:text-rose-500 transition-colors font-medium" href="#">Gửi lời nhắn yêu thương</a></li>
              <li><a className="hover:text-rose-500 transition-colors font-medium" href="#">Câu hỏi thường gặp</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-extrabold text-slate-900 mb-8 text-lg">Đăng ký nhận tin</h4>
            <p className="text-[15px] text-slate-500 mb-6 font-medium">Nhận ngay voucher giảm giá 10%.</p>
            <div className="flex flex-col gap-3">
              <input className="w-full bg-white border-slate-200 rounded-xl text-sm py-3 px-4 focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all" placeholder="Email của bạn..." type="email"/>
              <button className="w-full bg-rose-500 hover:bg-rose-600 text-white py-3 rounded-xl font-extrabold text-sm transition-all shadow-lg shadow-rose-500/10">Đăng ký ngay</button>
            </div>
          </div>
        </div>
        <div className="border-t border-slate-200 mt-16 pt-10 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-sm text-slate-500 font-medium">© 2026 FlowerShop Boutique. Thiết kế bởi sự tận tâm.</p>
          <div className="flex gap-4">
            {/* Social icons could go here */}
          </div>
        </div>
      </div>
    </footer>
  );
};
