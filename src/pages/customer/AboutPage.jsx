import React from "react";
import { Heart, ShieldCheck, Sparkles } from "lucide-react";

export const AboutPage = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 py-16">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-20">
        <div>
          <h1 className="text-5xl font-black text-slate-900 mb-6 leading-tight">
            Lan Tỏa <span className="text-rose-500">Yêu Thương</span> Qua Từng Cánh Hoa
          </h1>
          <p className="text-xl text-slate-600 leading-relaxed mb-8">
            Chúng tôi không chỉ bán hoa, chúng tôi giúp bạn truyền tải những thông điệp chân thành
            nhất đến những người quan trọng.
          </p>
          <div className="flex gap-4">
            <div className="px-6 py-3 bg-slate-900 text-white rounded-2xl font-bold">Thành lập 2024</div>
            <div className="px-6 py-3 bg-rose-50 text-rose-600 rounded-2xl font-bold border border-rose-100">Hoa tươi 100%</div>
          </div>
        </div>
        <div className="relative">
          <div className="aspect-square bg-rose-100 rounded-[40px] rotate-3 absolute inset-0 -z-10"></div>
          <img
            src="https://images.unsplash.com/photo-1526047932273-341f2a7631f9?auto=format&fit=crop&q=80"
            alt="Florist working"
            className="rounded-[40px] shadow-2xl shadow-rose-500/20 object-cover aspect-square"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="p-8 bg-white rounded-3xl border border-slate-100 shadow-sm text-center">
          <Heart className="mx-auto text-rose-500 mb-4" size={32} />
          <h3 className="font-bold text-xl text-slate-800 mb-2">Tận tâm</h3>
          <p className="text-slate-600 text-sm">Mỗi bó hoa được chăm chút tỉ mỉ bởi các nghệ nhân tay nghề cao.</p>
        </div>
        <div className="p-8 bg-white rounded-3xl border border-slate-100 shadow-sm text-center">
          <ShieldCheck className="mx-auto text-rose-500 mb-4" size={32} />
          <h3 className="font-bold text-xl text-slate-800 mb-2">Chất lượng</h3>
          <p className="text-slate-600 text-sm">Hoa được nhập mới mỗi ngày từ các nông trại uy tín nhất.</p>
        </div>
        <div className="p-8 bg-white rounded-3xl border border-slate-100 shadow-sm text-center">
          <Sparkles className="mx-auto text-rose-500 mb-4" size={32} />
          <h3 className="font-bold text-xl text-slate-800 mb-2">Sáng tạo</h3>
          <p className="text-slate-600 text-sm">Luôn cập nhật các xu hướng thiết kế hoa mới nhất và độc đáo nhất.</p>
        </div>
      </div>
    </div>
  );
};