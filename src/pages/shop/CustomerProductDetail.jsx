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
  Send,
  Gift,
} from "lucide-react";
import { bouquetApi } from "../../apis/flowerApi";
import { reviewService } from "../../services/reviewService";
import { toast } from "react-toastify";
import { usePromotion } from "../../contexts/PromotionContext";

export const CustomerProductDetail = () => {
  const { id } = useParams();
  const [bouquet, setBouquet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewForm, setReviewForm] = useState({
    title: "",
    content: "",
    rating: 5,
  });
  const [submittingReview, setSubmittingReview] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState("newest"); // newest, rating-high, rating-low
  const itemsPerPage = 6;
  const { activePromotion } = usePromotion() || {};

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

  useEffect(() => {
    const fetchReviews = async () => {
      setReviewsLoading(true);
      try {
        let sortParam = "desc";
        if (sortBy === "rating-high") {
          sortParam = "desc";
        } else if (sortBy === "rating-low") {
          sortParam = "asc";
        } else if (sortBy === "newest") {
          sortParam = "desc";
        }

        const data = await reviewService.getListReviews(id, {
          page: currentPage - 1,
          size: itemsPerPage,
          sort: sortParam,
        });
        setReviews(data || []);
      } catch (error) {
        console.error("Error fetching reviews:", error);
      } finally {
        setReviewsLoading(false);
      }
    };
    if (id) {
      fetchReviews();
    }
  }, [id, currentPage, sortBy]);

  const handleSubmitReview = async (e) => {
    e.preventDefault();

    if (!reviewForm.title.trim() || !reviewForm.content.trim()) {
      toast.error("Vui lòng nhập tiêu đề và nội dung đánh giá", {
        position: "bottom-right",
        autoClose: 2000,
      });
      return;
    }

    setSubmittingReview(true);
    try {
      await reviewService.createReview(id, {
        title: reviewForm.title,
        content: reviewForm.content,
        rating: reviewForm.rating,
      });

      toast.success("Cảm ơn bạn đã đánh giá sản phẩm!", {
        position: "bottom-right",
        autoClose: 2000,
      });

      setReviewForm({ title: "", content: "", rating: 5 });
      setShowReviewForm(false);
      setCurrentPage(1);
      setSortBy("newest");

      const data = await reviewService.getListReviews(id, {
        page: 0,
        size: itemsPerPage,
        sort: "desc",
      });
      setReviews(data || []);
    } catch (error) {
      console.error("Error creating review:", error);
      toast.error("Không thể tạo đánh giá. Vui lòng thử lại.", {
        position: "bottom-right",
        autoClose: 2000,
      });
    } finally {
      setSubmittingReview(false);
    }
  };

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
        <Link
          to="/shop"
          className="text-rose-500 hover:underline mt-4 inline-block"
        >
          Quay lại danh sách
        </Link>
      </div>
    );
  }

  const originalPrice = bouquet.price;
  const hasPromotion = activePromotion && activePromotion.discountValue > 0;
  const discountedPrice = hasPromotion
    ? originalPrice * (1 - activePromotion.discountValue / 100)
    : originalPrice;

  const images = bouquet.images || [];
  const mainImage =
    images[activeImage]?.image || "https://picsum.photos/800/1000?flower";

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <nav className="flex items-center gap-2 text-sm text-slate-500 mb-10">
        <Link className="hover:text-rose-500 transition-colors" to="/">
          Trang chủ
        </Link>
        <ChevronRight size={16} />
        <Link className="hover:text-rose-500 transition-colors" to="/shop">
          Hoa tươi
        </Link>
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
                className={`flex-shrink-0 w-24 h-24 rounded-xl overflow-hidden border-2 cursor-pointer transition-all ${activeImage === idx ? "border-rose-500 ring-4 ring-rose-500/10" : "border-transparent hover:border-rose-500/40"}`}
              >
                <img
                  alt={`Thumb ${idx}`}
                  className="w-full h-full object-cover"
                  src={img.image}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Info */}
        <div className="flex flex-col gap-8">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              {activePromotion &&
                activePromotion.discountValue >
                  0(
                    <span className="px-3 py-1 bg-rose-500 text-white text-[11px] font-bold rounded-full uppercase tracking-wider">
                      Tiết kiệm {activePromotion?.discountValue}%
                    </span>,
                  )}
              <span className="text-slate-400 text-sm font-medium">
                Mã: FL-RP-{bouquet.id}
              </span>
            </div>
            <h1 className="text-4xl font-extrabold text-slate-900 leading-tight">
              {bouquet.name}
            </h1>
            <div className="flex items-center gap-3">
              <div className="flex text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={20} className="fill-amber-400" />
                ))}
              </div>
              <span className="text-sm text-slate-500 font-semibold underline decoration-slate-300 underline-offset-4 cursor-pointer hover:text-rose-500 transition-colors">
                {reviews.length} đánh giá
              </span>
            </div>
            {hasPromotion ? (
              <div className="flex items-baseline gap-4 pt-2">
                <span className="text-4xl font-black text-rose-500">
                  {Math.round(discountedPrice).toLocaleString()}đ
                </span>
                <span className="text-xl text-slate-400 line-through font-medium">
                  {originalPrice.toLocaleString()}đ
                </span>
              </div>
            ) : (
              <div className="flex items-baseline gap-4 pt-2">
                <span className="text-4xl font-black text-slate-900">
                  {originalPrice.toLocaleString()}đ
                </span>
              </div>
            )}
          </div>

          {activePromotion && (
            <div className="mt-6 p-4 bg-emerald-50 border-l-4 border-emerald-400 rounded-r-lg">
              <div className="flex">
                <div className="flex-shrink-0">
                  <Gift
                    className="h-5 w-5 text-emerald-500"
                    aria-hidden="true"
                  />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-bold text-emerald-800">
                    Special Offer: A site-wide promotion is active!
                  </p>
                  <p className="text-sm text-emerald-700 mt-1">
                    {activePromotion.name}: Use code{" "}
                    <span className="font-bold">{activePromotion.code}</span> at
                    checkout.
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="border-t border-slate-100 pt-8">
            <h3 className="font-bold text-lg mb-4 text-slate-900">
              Mô tả sản phẩm
            </h3>
            <p className="text-slate-600 leading-relaxed text-[15px]">
              {bouquet.description}
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="font-bold text-lg text-slate-900">Vật Tư Đi Kèm</h3>
            <div className="space-y-2">
              {bouquet.bouquetsMaterials?.map((m, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-3 py-2 border-b border-slate-50"
                >
                  <CheckCircle2 className="text-rose-500" size={16} />
                  <span className="text-[14px] font-medium text-slate-700">
                    {m.rawMaterialName} (Số lượng: {m.quantity})
                  </span>
                </div>
              ))}
              {(!bouquet.bouquetsMaterials ||
                bouquet.bouquetsMaterials.length === 0) && (
                <p className="text-sm text-slate-400 italic">
                  Không có thông tin vật tư
                </p>
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
                <span className="px-4 font-bold text-lg min-w-[40px] text-center">
                  {quantity}
                </span>
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
              <BadgeCheck
                className="text-green-500 fill-green-500 text-white"
                size={20}
              />
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
          <button className="pb-5 text-[17px] font-extrabold border-b-2 border-rose-500 text-rose-500 whitespace-nowrap">
            Đánh giá thực tế ({reviews.length})
          </button>
          <button className="pb-5 text-[17px] font-bold text-slate-400 hover:text-slate-600 whitespace-nowrap transition-colors">
            Hướng dẫn bảo quản
          </button>
          <button className="pb-5 text-[17px] font-bold text-slate-400 hover:text-slate-600 whitespace-nowrap transition-colors">
            Chính sách giao hoa
          </button>
        </div>

        {!showReviewForm ? (
          <button
            onClick={() => setShowReviewForm(true)}
            className="w-full mb-8 py-4 border-2 border-rose-500 text-rose-500 font-bold rounded-2xl hover:bg-rose-50 transition-colors"
          >
            Viết đánh giá của bạn
          </button>
        ) : (
          <div className="p-8 bg-white rounded-2xl shadow-sm border border-slate-100 mb-8">
            <h3 className="text-xl font-bold text-slate-900 mb-6">
              Chia sẻ cảm nhận của bạn
            </h3>
            <form onSubmit={handleSubmitReview} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-3">
                  Xếp hạng
                </label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() =>
                        setReviewForm({ ...reviewForm, rating: star })
                      }
                      className="transition-transform hover:scale-110"
                    >
                      <Star
                        size={28}
                        className={`${
                          star <= reviewForm.rating
                            ? "fill-amber-400 text-amber-400"
                            : "text-slate-300"
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">
                  Tiêu đề đánh giá
                </label>
                <input
                  type="text"
                  placeholder="Vd: Sản phẩm tuyệt vời"
                  value={reviewForm.title}
                  onChange={(e) =>
                    setReviewForm({ ...reviewForm, title: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">
                  Nội dung đánh giá
                </label>
                <textarea
                  placeholder="Chia sẻ chi tiết cảm nhận của bạn về sản phẩm..."
                  value={reviewForm.content}
                  onChange={(e) =>
                    setReviewForm({ ...reviewForm, content: e.target.value })
                  }
                  rows="5"
                  className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
              </div>

              <div className="flex gap-3 justify-end">
                <button
                  type="button"
                  onClick={() => {
                    setShowReviewForm(false);
                    setReviewForm({ title: "", content: "", rating: 5 });
                  }}
                  className="px-6 py-3 border border-slate-200 text-slate-900 font-semibold rounded-lg hover:bg-slate-50 transition-colors"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={submittingReview}
                  className="px-6 py-3 bg-rose-500 text-white font-semibold rounded-lg hover:bg-rose-600 transition-colors disabled:opacity-50 flex items-center gap-2"
                >
                  <Send size={18} />
                  {submittingReview ? "Đang gửi..." : "Gửi đánh giá"}
                </button>
              </div>
            </form>
          </div>
        )}

        {reviewsLoading ? (
          <div className="flex justify-center py-10">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-rose-500"></div>
          </div>
        ) : reviews.length > 0 ? (
          <>
            <div className="mb-8 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <label className="text-sm font-semibold text-slate-900">
                  Sắp xếp:
                </label>
                <select
                  value={sortBy}
                  onChange={(e) => {
                    setSortBy(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                >
                  <option value="newest">Mới nhất</option>
                  <option value="rating-high">Sao cao nhất</option>
                  <option value="rating-low">Sao thấp nhất</option>
                </select>
              </div>
              <span className="text-sm text-slate-600">
                Trang {currentPage} / {Math.ceil(reviews.length / itemsPerPage)}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              {reviews
                .slice(
                  (currentPage - 1) * itemsPerPage,
                  currentPage * itemsPerPage,
                )
                .map((review) => (
                  <div
                    key={review.id}
                    className="p-8 bg-white rounded-2xl shadow-sm border border-slate-100"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h4 className="font-bold text-slate-900 mb-2">
                          {review.title}
                        </h4>
                        <div className="flex text-amber-400">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              size={14}
                              className={
                                i < review.rating ? "fill-amber-400" : ""
                              }
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                    <p className="text-slate-600 text-[15px] leading-relaxed">
                      {review.content}
                    </p>
                  </div>
                ))}
            </div>

            {Math.ceil(reviews.length / itemsPerPage) > 1 && (
              <div className="flex justify-center items-center gap-4">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 border border-slate-200 rounded-lg text-slate-900 font-semibold hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Trang trước
                </button>

                <div className="flex gap-2">
                  {[...Array(Math.ceil(reviews.length / itemsPerPage))].map(
                    (_, idx) => {
                      const pageNum = idx + 1;
                      return (
                        <button
                          key={pageNum}
                          onClick={() => setCurrentPage(pageNum)}
                          className={`px-3 py-2 rounded-lg font-semibold transition-colors ${
                            currentPage === pageNum
                              ? "bg-rose-500 text-white"
                              : "border border-slate-200 text-slate-900 hover:bg-slate-50"
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    },
                  )}
                </div>

                <button
                  onClick={() =>
                    setCurrentPage(
                      Math.min(
                        Math.ceil(reviews.length / itemsPerPage),
                        currentPage + 1,
                      ),
                    )
                  }
                  disabled={
                    currentPage === Math.ceil(reviews.length / itemsPerPage)
                  }
                  className="px-4 py-2 border border-slate-200 rounded-lg text-slate-900 font-semibold hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Trang sau
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-10">
            <p className="text-slate-500 text-lg">
              Chưa có đánh giá nào. Hãy là người đầu tiên đánh giá!
            </p>
          </div>
        )}
      </div>
    </main>
  );
};
