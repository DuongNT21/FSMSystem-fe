import React from "react";
import { PartyPopper, Heart, Gift, GraduationCap, MessageCircle, HelpCircle } from "lucide-react";

export const OccasionsPage = () => {
  const occasions = [
    {
      title: "Sinh nhật",
      icon: PartyPopper,
      desc: "Làm ngày sinh nhật thêm rạng rỡ với những đóa hoa tươi thắm nhất.",
    },
    {
      title: "Kỷ niệm",
      icon: Heart,
      desc: "Hâm nóng tình yêu bằng những bó hoa lãng mạn, tinh tế và đầy cảm xúc.",
    },
    {
      title: "Chúc mừng",
      icon: Gift,
      desc: "Chia sẻ niềm vui trong các dịp thăng chức, khai trương hay mừng tân gia.",
    },
    {
      title: "Tốt nghiệp",
      icon: GraduationCap,
      desc: "Đánh dấu cột mốc quan trọng bằng món quà ý nghĩa từ thiên nhiên.",
    },
    {
      title: "Xin lỗi",
      icon: MessageCircle,
      desc: "Gửi gắm lời xin lỗi chân thành qua ngôn ngữ nhẹ nhàng của loài hoa.",
    },
    {
      title: "Cảm ơn",
      icon: HelpCircle,
      desc: "Bày tỏ lòng biết ơn sâu sắc đến những người đã luôn bên cạnh bạn.",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-16">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-black text-slate-900 mb-4 uppercase tracking-tight">
          Dịp Đặc Biệt
        </h1>
        <div className="w-24 h-1.5 bg-rose-500 mx-auto rounded-full mb-6"></div>
        <p className="text-slate-600 max-w-2xl mx-auto text-lg leading-relaxed">
          Mọi khoảnh khắc trong cuộc sống đều xứng đáng được trân trọng. Hãy để chúng tôi giúp bạn
          chọn lựa những bông hoa hoàn hảo nhất cho từng kỷ niệm.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {occasions.map((occ, index) => (
          <div
            key={index}
            className="group bg-white p-8 rounded-3xl shadow-sm border border-slate-100 hover:border-rose-200 hover:shadow-xl hover:shadow-rose-500/5 transition-all duration-300"
          >
            <div className="w-14 h-14 bg-rose-50 rounded-2xl flex items-center justify-center text-rose-500 mb-6 group-hover:bg-rose-500 group-hover:text-white transition-colors duration-300">
              <occ.icon size={28} />
            </div>
            <h3 className="text-2xl font-bold text-slate-800 mb-3">{occ.title}</h3>
            <p className="text-slate-600 leading-relaxed">{occ.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
};