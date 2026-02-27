import React from "react";
import { Link } from "react-router-dom";
import { Flower2 } from "lucide-react";

export const HomePage = () => {
  const featured = [
    { id: 1, name: "Bouquet Classic", price: "450.000₫" },
    { id: 2, name: "Rose Surprise", price: "520.000₫" },
    { id: 3, name: "Sunny Mix", price: "380.000₫" },
    { id: 4, name: "Elegance Box", price: "610.000₫" },
  ];

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
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="h-56 rounded-md bg-gradient-to-r from-rose-100 to-rose-200 flex items-center justify-center">
                <div className="text-center">
                  <div className="bg-rose-100 inline-flex p-3 rounded-full mb-3">
                    <Flower2 className="w-7 h-7 text-rose-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800">Sản phẩm nổi bật</h3>
                  <p className="text-gray-500 mt-2">Bouquet of the day — được tuyển chọn bởi florist của chúng tôi.</p>
                </div>
              </div>
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
            {featured.map((p) => (
              <article key={p.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="h-40 bg-gray-100 flex items-center justify-center text-gray-400">Ảnh sản phẩm</div>
                <div className="p-4">
                  <h3 className="font-medium text-gray-800">{p.name}</h3>
                  <p className="text-rose-600 font-semibold mt-2">{p.price}</p>
                  <div className="mt-4 flex items-center gap-3">
                    <Link to="/shop" className="text-sm bg-rose-600 text-white px-3 py-2 rounded-md">
                      Mua
                    </Link>
                    <button className="text-sm border border-rose-200 text-rose-600 px-3 py-2 rounded-md">
                      Thêm vào giỏ
                    </button>
                  </div>
                </div>
              </article>
            ))}
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
