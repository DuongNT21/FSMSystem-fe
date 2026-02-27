import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { 
  Star, 
  ShoppingCart, 
  Heart, 
  ChevronRight, 
  CheckCircle2, 
  Truck, 
  BadgeCheck,
  Plus,
  Minus,
  Share2,
  Camera,
  AtSign
} from "lucide-react";
import { bouquetApi } from "../../apis/flowerApi";

export const CustomerProductDetail = () => {
  const { id } = useParams();
  const [bouquet, setBouquet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    const fetchBouquet = async () => {
      setLoading(true);
      try {
        const response = await bouquetApi.getById(id);
        if (response) {
          setBouquet(response.bouquet ?? response);
        }
      } catch (error) {
        console.error("Error fetching bouquet detail:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBouquet();
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 flex justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-500"></div>
      </div>
    );
  }

  if (!bouquet) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold">Không tìm thấy sản phẩm</h2>
        <Link to="/shop" className="text-rose-500 hover:underline mt-4 inline-block">Quay lại danh sách</Link>
      </div>
    );
  }

  const images = bouquet.images || [];
  const mainImage = images[activeImage]?.image || "https://picsum.photos/800/1000?flower";

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <nav className="flex items-center gap-2 text-sm text-slate-400 mb-10">
        <Link className="hover:text-rose-500 transition-colors" to="/">Trang chủ</Link>
        <ChevronRight size={16} />
        <Link className="hover:text-rose-500 transition-colors" to="/shop">Hoa tươi</Link>
        <ChevronRight size={16} />
        <span className="text-slate-900 font-bold">{bouquet.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
        {/* Gallery */}
        <div className="flex flex-col gap-6">
          <div className="relative aspect-[4/5] w-full rounded-2xl overflow-hidden bg-slate-100 group shadow-sm">
            <img 
              alt={bouquet.name} 
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
              src={mainImage} 
            />
            <button className="absolute top-6 right-6 p-3 bg-white/90 rounded-full shadow-xl hover:text-rose-500 transition-all hover:scale-110">
              <Heart size={24} className="fill-rose-500 text-rose-500" />
            </button>
          </div>
          <div className="flex gap-4 overflow-x-auto no-scrollbar py-2">
            {images.map((img, idx) => (
              <div 
                key={idx} 
                onClick={() => setActiveImage(idx)}
                className={`flex-shrink-0 w-24 h-24 rounded-xl overflow-hidden border-2 cursor-pointer transition-all ${activeImage === idx ? 'border-rose-500 ring-4 ring-rose-500/10' : 'border-transparent hover:border-rose-500/40'}`}
              >
                <img alt={`Thumb ${idx}`} className="w-full h-full object-cover" src={img.image} />
              </div>
            ))}
          </div>
        </div>

        {/* Info */}
        <div className="flex flex-col gap-8">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="px-3 py-1 bg-rose-500 text-white text-[11px] font-bold rounded-full uppercase tracking-wider">Tiết kiệm 20%</span>
              <span className="text-slate-400 text-sm font-medium">Mã: FL-RP-{bouquet.id}</span>
            </div>
            <h1 className="text-4xl font-extrabold text-slate-900 leading-tight">{bouquet.name}</h1>
            <div className="flex items-center gap-3">
              <div className="flex text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={20} className="fill-amber-400" />
                ))}
              </div>
              <span className="text-sm text-slate-500 font-semibold underline decoration-slate-300 underline-offset-4 cursor-pointer hover:text-rose-500 transition-colors">48 đánh giá</span>
            </div>
            <div className="flex items-baseline gap-4 pt-2">
              <span className="text-4xl font-black text-rose-500">{bouquet.price.toLocaleString()}đ</span>
              <span className="text-xl text-slate-400 line-through font-medium">{(bouquet.price * 1.2).toLocaleString()}đ</span>
            </div>
          </div>

          <div className="border-t border-slate-100 pt-8">
            <h3 className="font-bold text-lg mb-4 text-slate-900">Mô tả sản phẩm</h3>
            <p className="text-slate-600 leading-relaxed text-[15px]">
              {bouquet.description}
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="font-bold text-lg text-slate-900">Vật Tư Đi Kèm</h3>
            <div className="space-y-2">
              {bouquet.bouquetsMaterials?.map((m, idx) => (
                <div key={idx} className="flex items-center gap-3 py-2 border-b border-slate-50">
                  <CheckCircle2 className="text-rose-500" size={16} />
                  <span className="text-[14px] font-medium text-slate-700">Vật tư #{m.materialId} (Số lượng: {m.quantity})</span>
                </div>
              ))}
              {(!bouquet.bouquetsMaterials || bouquet.bouquetsMaterials.length === 0) && (
                <p className="text-sm text-slate-400 italic">Không có thông tin vật tư</p>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-4 mt-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center h-[56px] border border-slate-200 rounded-xl bg-white overflow-hidden">
                <button 
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-5 py-2 hover:bg-slate-50 transition-colors text-slate-500"
                >
                  <Minus size={20} />
                </button>
                <span className="px-4 font-bold text-lg min-w-[40px] text-center">{quantity}</span>
                <button 
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-5 py-2 hover:bg-slate-50 transition-colors text-slate-500"
                >
                  <Plus size={20} />
                </button>
              </div>
              <button className="flex-1 h-[56px] bg-rose-500 hover:bg-rose-600 text-white font-bold rounded-xl flex items-center justify-center gap-3 shadow-lg shadow-rose-500/20 transition-all active:scale-95">
                <ShoppingCart size={24} />
                Thêm vào giỏ
              </button>
            </div>
            <button className="w-full h-[56px] border border-rose-500 text-rose-500 hover:bg-rose-50 font-bold rounded-xl transition-all active:scale-95">
              Mua ngay
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-8 pt-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-slate-600">
              <BadgeCheck className="text-green-500 fill-green-500 text-white" size={20} />
              <span>Sẵn sàng giao ngay</span>
            </div>
            <div className="flex items-center gap-2 text-sm font-semibold text-slate-600">
              <Truck className="text-rose-500" size={20} />
              <span>Giao nội thành 60p</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mt-24">
        <div className="flex border-b border-slate-100 gap-10 mb-10 overflow-x-auto no-scrollbar">
          <button className="pb-5 text-[17px] font-extrabold border-b-2 border-rose-500 text-rose-500 whitespace-nowrap">Đánh giá thực tế (48)</button>
          <button className="pb-5 text-[17px] font-bold text-slate-400 hover:text-slate-600 whitespace-nowrap transition-colors">Hướng dẫn bảo quản</button>
          <button className="pb-5 text-[17px] font-bold text-slate-400 hover:text-slate-600 whitespace-nowrap transition-colors">Chính sách giao hoa</button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="p-8 bg-white rounded-2xl shadow-sm border border-slate-100">
            <div className="flex justify-between items-start mb-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-rose-50 flex items-center justify-center text-rose-500 font-bold text-lg">NH</div>
                <div>
                  <h4 className="font-bold text-slate-900">Nguyễn Huy</h4>
                  <div className="flex text-amber-400">
                    {[...Array(5)].map((_, i) => <Star key={i} size={14} className="fill-amber-400" />)}
                  </div>
                </div>
              </div>
              <span className="text-xs text-slate-400 font-medium">2 ngày trước</span>
            </div>
            <p className="text-slate-600 text-[15px] leading-relaxed">"Hoa tươi rất đẹp, đóng gói cẩn thận. Shop giao hàng rất đúng giờ để kịp tặng sinh nhật vợ. Sẽ ủng hộ tiếp!"</p>
          </div>
          <div className="p-8 bg-white rounded-2xl shadow-sm border border-slate-100">
            <div className="flex justify-between items-start mb-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-rose-50 flex items-center justify-center text-rose-500 font-bold text-lg">TT</div>
                <div>
                  <h4 className="font-bold text-slate-900">Thùy Trang</h4>
                  <div className="flex text-amber-400">
                    {[...Array(4)].map((_, i) => <Star key={i} size={14} className="fill-amber-400" />)}
                    <Star size={14} />
                  </div>
                </div>
              </div>
              <span className="text-xs text-slate-400 font-medium">1 tuần trước</span>
            </div>
            <p className="text-slate-600 text-[15px] leading-relaxed">"Màu đỏ của hoa rất sang, đúng như hình chụp. Nhân viên tư vấn nhiệt tình. Cảm ơn shop rất nhiều."</p>
          </div>
        </div>
      </div>
    </main>
  );
};
