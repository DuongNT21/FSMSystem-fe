import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Flower2 } from "lucide-react";
import { bouquetApi } from "../apis/flowerApi";

export const HomePage = () => {
  const [trending, setTrending] = useState(null);
  const [topRated, setTopRated] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const trendingRes = await bouquetApi.getTrending();
        if (trendingRes.data && trendingRes.data.length > 0) {
          setTrending(trendingRes.data[0]);
        }
        const topRatedRes = await bouquetApi.getTopRated();
        if (topRatedRes.data) {
          setTopRated(topRatedRes.data);
        }
      } catch (error) {
        console.error("Error fetching homepage data:", error);
      }
    };
    fetchData();
  }, []);

  return (
    <main className="min-h-screen">
      {/* Hero */}
      <section className="bg-rose-50 py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row items-center gap-12">
          <div className="lg:w-1/2">
            <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 mb-4">
              Trao gửi yêu thương qua từng cánh hoa
            </h1>
            <p className="text-gray-600 mb-6">
              FlowerShop — hoa tươi nghệ thuật cho mọi dịp. Giao nhanh trong ngày,
              thiết kế riêng theo yêu cầu.
            </p>
            <div className="flex gap-4">
              <Link
                to="/shop"
                className="bg-rose-600 hover:bg-rose-700 text-white px-5 py-3 rounded-md shadow"
              >
                Mua ngay
              </Link>
              <Link
                to="/occasions"
                className="border border-rose-200 text-rose-600 px-5 py-3 rounded-md hover:bg-rose-50"
              >
                Khám phá chủ đề
              </Link>
            </div>
          </div>

          <div className="lg:w-1/2 w-full">
            <div className="bg-white rounded-xl shadow-lg p-6 relative min-h-[320px]">
              {trending ? (
                <>
                  <div className="absolute top-4 right-4 bg-rose-500 text-white text-xs font-bold px-3 py-1 rounded-full z-10 shadow-sm">
                    Trending Today
                  </div>
                  <div className="flex flex-col md:flex-row gap-6 items-center">
                    <div className="w-full md:w-1/2 aspect-square rounded-lg overflow-hidden bg-gray-100">
                      <img 
                        src={trending.images?.[0]?.image || "https://picsum.photos/400/400"} 
                        alt={trending.name}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <div className="w-full md:w-1/2 text-left">
                      <h3 className="text-2xl font-bold text-gray-800 mb-2">{trending.name}</h3>
                      <p className="text-sm text-gray-500 line-clamp-2 mb-3">{trending.description}</p>
                      <p className="text-rose-600 font-bold text-xl mb-4">
                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(trending.price)}
                      </p>
                      <Link 
                        to={`/shop/${trending.id}`} 
                        className="inline-block w-full text-center bg-rose-100 hover:bg-rose-200 text-rose-700 py-2.5 rounded-lg font-bold transition-colors"
                      >
                        Xem chi tiết
                      </Link>
                    </div>
                  </div>
                </>
              ) : (
                <div className="h-56 rounded-md bg-gradient-to-r from-rose-100 to-rose-200 flex items-center justify-center">
                  <div className="text-center">
                    <div className="bg-rose-100 inline-flex p-3 rounded-full mb-3">
                      <Flower2 className="w-7 h-7 text-rose-600" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-800">Sản phẩm nổi bật</h3>
                    <p className="text-gray-500 mt-2">Bouquet of the day — được tuyển chọn bởi florist của chúng tôi.</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Featured products */}
      <section className="py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Sản phẩm nổi bật</h2>
            <Link to="/shop" className="text-rose-600 hover:underline">
              Xem tất cả
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {topRated.length > 0 ? topRated.map((p) => (
              <article key={p.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="h-48 bg-gray-100 overflow-hidden relative group">
                  <img 
                    src={p.images?.[0]?.image || "https://picsum.photos/300/300"} 
                    alt={p.name}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-medium text-gray-800 line-clamp-1" title={p.name}>{p.name}</h3>
                  <p className="text-rose-600 font-bold mt-2">
                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(p.price)}
                  </p>
                  <div className="mt-4 flex items-center gap-3">
                    <Link to={`/shop/${p.id}`} className="flex-1 text-center text-sm bg-rose-600 hover:bg-rose-700 text-white px-3 py-2 rounded-md transition-colors">
                      Xem chi tiết
                    </Link>
                  </div>
                </div>
              </article>
            )) : (
               <p className="col-span-full text-center text-gray-500 py-8">Đang tải sản phẩm nổi bật...</p>
            )}
          </div>
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="bg-rose-50 py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-xl font-semibold mb-4">Nhận ưu đãi khi đăng ký</h3>
          <p className="text-gray-600 mb-6">Đăng ký nhận tin để nhận mã giảm giá và cập nhật sản phẩm mới.</p>
          <form className="max-w-md mx-auto flex">
            <input
              type="email"
              placeholder="Email của bạn"
              className="w-full px-4 py-3 rounded-l-md border border-rose-200 focus:outline-none"
            />
            <button className="bg-rose-600 text-white px-4 py-3 rounded-r-md">Đăng ký</button>
          </form>
        </div>
      </section>
    </main>
  );
};
