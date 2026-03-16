import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  ChevronRight,
  X,
  Plus,
  Minus,
  ShoppingCart,
  ChevronLeft,
} from "lucide-react";
import {
  getCartItems,
  removeFromCart,
  updateQuantity,
  clearCart,
  createOrderFromCart,
} from "../../utils/cartUtils";
import { toast } from "react-toastify";
import { orderService } from "../../services/orderService";
import { usePromotion } from "../../contexts/PromotionContext";


export const CartPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const { activePromotion, reloadPromotion } = usePromotion() || {};
  const [province, setProvince] = useState("");
  const [district, setDistrict] = useState("");
  const [ward, setWard] = useState("");
  const [street, setStreet] = useState("");
  const [fullName, setFullName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [addressError, setAddressError] = useState("");

  // Simple demo location data
  const provinces = ["Hà Nội", "Hồ Chí Minh", "Đà Nẵng"];
  const districts = {
    "Hà Nội": ["Ba Đình", "Cầu Giấy", "Đống Đa"],
    "Hồ Chí Minh": ["Quận 1", "Quận 3", "Quận 7"],
    "Đà Nẵng": ["Hải Châu", "Sơn Trà", "Ngũ Hành Sơn"],
  };

  const wards = {
    "Ba Đình": ["Phúc Xá", "Trúc Bạch"],
    "Cầu Giấy": ["Dịch Vọng", "Nghĩa Đô"],
    "Đống Đa": ["Láng Hạ", "Khâm Thiên"],
    "Quận 1": ["Bến Nghé", "Bến Thành"],
    "Quận 3": ["Phường 6", "Phường 7"],
    "Quận 7": ["Tân Phú", "Tân Phong"],
    "Hải Châu": ["Thạch Thang", "Hải Châu I"],
    "Sơn Trà": ["An Hải Bắc", "Phước Mỹ"],
    "Ngũ Hành Sơn": ["Mỹ An", "Khuê Mỹ"],
  };

  useEffect(() => {
    loadCart();
    if (reloadPromotion) {
      reloadPromotion();
    }
  }, []);

  const loadCart = () => {
    const items = getCartItems();
    setCartItems(items);
    setSelectedItems([]);
    setSelectAll(false);
  };

  const handleSelectItem = (productId) => {
    setSelectedItems((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId],
    );
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedItems([]);
    } else {
      setSelectedItems(cartItems.map((item) => item.id));
    }
    setSelectAll(!selectAll);
  };

  const handleUpdateQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      handleRemoveItem(productId);
      return;
    }
    updateQuantity(productId, newQuantity);
    loadCart();
  };

  const handleRemoveItem = (productId) => {
    removeFromCart(productId);
    setSelectedItems((prev) => prev.filter((id) => id !== productId));
    toast.success("Sản phẩm đã được xóa khỏi giỏ hàng!", {
      position: "bottom-right",
      autoClose: 2000,
    });
    loadCart();
  };

  const handleRemoveSelected = () => {
    if (selectedItems.length === 0) {
      toast.warning("Vui lòng chọn sản phẩm để xóa!", {
        position: "bottom-right",
        autoClose: 2000,
      });
      return;
    }

    selectedItems.forEach((id) => removeFromCart(id));
    toast.success(`Đã xóa ${selectedItems.length} sản phẩm khỏi giỏ hàng!`, {
      position: "bottom-right",
      autoClose: 2000,
    });
    loadCart();
  };

  const handlePlaceOrder = async () => {
    if (!fullName.trim() || !phoneNumber.trim()) {
      toast.error("Vui lòng nhập đầy đủ thông tin người nhận", {
        position: "bottom-right",
        autoClose: 2000,
      });
      return;
    }

    if (!province || !district || !ward || !street.trim()) {
      setAddressError("Vui lòng nhập đầy đủ địa chỉ giao hàng!");
      toast.error("Thiếu thông tin địa chỉ giao hàng", {
        position: "bottom-right",
        autoClose: 2000,
      });
      return;
    }

    setAddressError("");

    const itemsToOrder = cartItems.filter((item) =>
      selectedItems.includes(item.id),
    );
    const orderData = {
      fullName,
      phoneNumber,
      deliveryAddress: `${street}, ${ward}, ${district}, ${province}`,
      orderItems: itemsToOrder.map((item) => ({
        bouquetId: item.id,
        quantity: item.quantity,
      })),
    };

    if (calculateDiscount() > 0 && activePromotion?.code) {
      orderData.promotionCode = activePromotion.code;
    }

    try {
      const response = await orderService.createOrder(orderData);
      console.log("Order created successfully:", response);
      toast.success(`Đặt hàng thành công! ${selectedItems.length} sản phẩm.`, {
        position: "bottom-right",
        autoClose: 3000,
      });

      // Remove ordered items from cart
      selectedItems.forEach((id) => removeFromCart(id));
      loadCart();
    } catch (error) {
      console.error("Failed to place order:", error);
      toast.error("Đặt hàng thất bại. Vui lòng thử lại.", {
        position: "bottom-right",
        autoClose: 3000,
      });
    }
  };

  const calculateSubtotal = () => {
    return selectedItems.reduce((total, id) => {
      const item = cartItems.find((item) => item.id === id);
      return total + (item ? item.price * item.quantity : 0);
    }, 0);
  };

  const calculateTax = () => {
    const subtotal = calculateSubtotal();
    return Math.round(subtotal * 0.1); // 10% VAT
  };

  const calculateDiscount = () => {
    const subtotal = calculateSubtotal();
    if (
      activePromotion &&
      activePromotion.discountValue > 0 &&
      subtotal >= (activePromotion.minOrderValue || 0)
    ) {
      let discount = subtotal * (activePromotion.discountValue / 100);
      if (
        activePromotion.maxDiscountValue &&
        activePromotion.maxDiscountValue > 0 &&
        discount > activePromotion.maxDiscountValue
      ) {
        discount = activePromotion.maxDiscountValue;
      }
      return Math.round(discount);
    }
    return 0;
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateTax() - calculateDiscount();
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-linear-to-br from-slate-50 to-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Breadcrumb */}
          <nav className="flex text-sm font-medium text-slate-500 mb-8">
            <ol className="flex items-center space-x-2">
              <li>
                <Link className="hover:text-rose-500 transition-colors" to="/">
                  Trang chủ
                </Link>
              </li>
              <li className="flex items-center space-x-2">
                <ChevronRight size={14} />
                <span className="text-rose-500">Giỏ hàng</span>
              </li>
            </ol>
          </nav>

          {/* Empty Cart */}
          <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-16">
            <div className="flex flex-col items-center justify-center text-center">
              <div className="relative mb-8">
                <div className="absolute inset-0 bg-rose-500/10 rounded-full blur-2xl"></div>
                <ShoppingCart size={80} className="text-rose-500 relative" />
              </div>
              <h2 className="text-3xl font-bold text-slate-900 mb-4">
                Giỏ hàng của bạn trống
              </h2>
              <p className="text-lg text-slate-600 mb-8 max-w-md">
                Khám phá những bó hoa tươi đẹp của chúng tôi và thêm vào giỏ
                hàng của bạn.
              </p>
              <Link
                to="/shop"
                className="inline-flex items-center gap-2 px-8 py-3 bg-rose-500 text-white font-bold rounded-xl hover:bg-rose-600 transition-all shadow-lg shadow-rose-500/30"
              >
                <ShoppingCart size={20} />
                Tiếp tục mua sắm
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 to-slate-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="flex text-sm font-medium text-slate-500 mb-8">
          <ol className="flex items-center space-x-2">
            <li>
              <Link className="hover:text-rose-500 transition-colors" to="/">
                Trang chủ
              </Link>
            </li>
            <li className="flex items-center space-x-2">
              <ChevronRight size={14} />
              <span className="text-rose-500">Giỏ hàng</span>
            </li>
          </ol>
        </nav>

        <h1 className="text-4xl font-extrabold text-slate-900 mb-2">
          Giỏ Hàng Của Bạn
        </h1>
        <p className="text-slate-600 mb-8">
          Kiểm tra và quản lý các sản phẩm trong giỏ hàng của bạn
        </p>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
              {/* Header with Select All */}
              <div className="bg-linear-to-r from-slate-50 to-slate-100 p-6 border-b border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <input
                    type="checkbox"
                    checked={selectAll}
                    onChange={handleSelectAll}
                    className="w-5 h-5 rounded text-rose-500 cursor-pointer accent-rose-500"
                  />
                  <span className="font-bold text-slate-900">
                    Chọn tất cả ({cartItems.length})
                  </span>
                </div>
                {selectedItems.length > 0 && (
                  <button
                    onClick={handleRemoveSelected}
                    className="flex items-center gap-2 px-4 py-2 text-red-600 font-semibold hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <X size={18} />
                    Xóa ({selectedItems.length})
                  </button>
                )}
              </div>

              {/* Cart Items List */}
              <div className="divide-y divide-slate-200">
                {cartItems.map((item) => (
                  <div
                    key={item.id}
                    className={`p-6 hover:bg-slate-50 transition-colors transform ${selectAll || selectedItems.includes(item.id) ? "bg-rose-50" : ""}`}
                  >
                    <div className="flex gap-6">
                      {/* Checkbox */}
                      <input
                        type="checkbox"
                        checked={selectedItems.includes(item.id)}
                        onChange={() => handleSelectItem(item.id)}
                        className="w-5 h-5 rounded text-rose-500 cursor-pointer accent-rose-500 mt-1 shrink-0"
                      />

                      {/* Product Image */}
                      <div className="w-24 h-24 bg-slate-100 rounded-xl overflow-hidden shrink-0">
                        <img
                          src={
                            item.images?.[0]?.image ||
                            "https://picsum.photos/100/100?flower"
                          }
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* Product Info */}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-slate-900 text-lg mb-1 line-clamp-1">
                          {item.name}
                        </h3>
                        <p className="text-sm text-slate-600 mb-4 line-clamp-2">
                          {item.description}
                        </p>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-rose-500 font-semibold">
                            {item.price.toLocaleString()}₫
                          </span>
                          <span className="text-sm text-slate-400">/cái</span>
                        </div>
                      </div>

                      {/* Quantity & Actions */}
                      <div className="flex flex-col items-end justify-between">
                        <button
                          onClick={() => handleRemoveItem(item.id)}
                          className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                        >
                          <X size={20} />
                        </button>

                        {/* Quantity Controls */}
                        <div className="flex items-center gap-3 bg-slate-100 rounded-lg p-1">
                          <button
                            onClick={() =>
                              handleUpdateQuantity(item.id, item.quantity - 1)
                            }
                            className="p-1 hover:bg-white rounded transition-colors text-slate-600"
                          >
                            <Minus size={16} />
                          </button>
                          <span className="font-bold text-slate-900 w-8 text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              handleUpdateQuantity(item.id, item.quantity + 1)
                            }
                            className="p-1 hover:bg-white rounded transition-colors text-slate-600"
                          >
                            <Plus size={16} />
                          </button>
                        </div>

                        {/* Subtotal */}
                        <div className="text-right">
                          <p className="text-slate-500 text-xs mb-1">Tổng:</p>
                          <p className="font-black text-lg text-slate-900">
                            {(item.price * item.quantity).toLocaleString()}₫
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Summary Panel */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6 sticky top-24">
              <h2 className="text-xl font-bold text-slate-900 mb-6">
                Tóm Tắt Đơn Hàng
              </h2>

              {/* Summary Details */}
              <div className="space-y-4 mb-6 pb-6 border-b border-slate-200">
                <div className="flex justify-between text-slate-600">
                  <span>Sản phẩm chọn:</span>
                  <span className="font-semibold text-slate-900">
                    {selectedItems.length}
                  </span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Số lượng:</span>
                  <span className="font-semibold text-slate-900">
                    {selectedItems.reduce((total, id) => {
                      const item = cartItems.find((item) => item.id === id);
                      return total + (item ? item.quantity : 0);
                    }, 0)}
                  </span>
                </div>
              </div>

              {/* Price Calculation */}
              <div className="space-y-3 mb-6 pb-6 border-b border-slate-200">
                <div className="flex justify-between">
                  <span className="text-slate-600">Tạm tính:</span>
                  <span className="font-semibold text-slate-900">
                    {calculateSubtotal().toLocaleString()}₫
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">VAT (10%):</span>
                  <span className="font-semibold text-slate-900">
                    {calculateTax().toLocaleString()}₫
                  </span>
                </div>
                {calculateDiscount() > 0 && (
                  <div className="flex justify-between text-rose-500">
                    <span>Giảm giá ({activePromotion.code}):</span>
                    <span className="font-semibold">
                      - {calculateDiscount().toLocaleString()}₫
                    </span>
                  </div>
                )}
              </div>

              {/* Total */}
              <div className="flex justify-between items-center mb-6">
                <span className="text-lg font-bold text-slate-900">
                  Tổng cộng
                </span>
                <div className="text-right">
                  <span className="text-2xl font-black text-rose-500">
                    {calculateTotal().toLocaleString()}₫
                  </span>
                  {calculateDiscount() > 0 && (
                    <p className="text-base text-slate-400 line-through font-medium">
                      {(calculateSubtotal() + calculateTax()).toLocaleString()}₫
                    </p>
                  )}
                </div>
              </div>

              {/* Shipping Address */}
              <div className="mb-6 space-y-3">
                <h3 className="font-bold text-slate-900">
                  Thông Tin Người Nhận
                </h3>

                <input
                  type="text"
                  placeholder="Họ và tên"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full p-3 border rounded-lg"
                />

                <input
                  type="text"
                  placeholder="Số điện thoại"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="w-full p-3 border rounded-lg"
                />

                <h3 className="font-bold text-slate-900">Địa Chỉ Giao Hàng</h3>

                <select
                  value={province}
                  onChange={(e) => {
                    setProvince(e.target.value);
                    setDistrict("");
                    setWard("");
                  }}
                  className="w-full p-3 border rounded-lg"
                >
                  <option value="">Chọn Tỉnh / Thành phố</option>
                  {provinces.map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>

                <select
                  value={district}
                  onChange={(e) => {
                    setDistrict(e.target.value);
                    setWard("");
                  }}
                  disabled={!province}
                  className="w-full p-3 border rounded-lg"
                >
                  <option value="">Chọn Quận / Huyện</option>
                  {(districts[province] || []).map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>

                <select
                  value={ward}
                  onChange={(e) => setWard(e.target.value)}
                  disabled={!district}
                  className="w-full p-3 border rounded-lg"
                >
                  <option value="">Chọn Phường / Xã</option>
                  {(wards[district] || []).map((w) => (
                    <option key={w} value={w}>
                      {w}
                    </option>
                  ))}
                </select>

                <input
                  type="text"
                  placeholder="Số nhà, tên đường..."
                  value={street}
                  onChange={(e) => setStreet(e.target.value)}
                  className="w-full p-3 border rounded-lg"
                />

                {addressError && (
                  <p className="text-red-500 text-sm">{addressError}</p>
                )}
              </div>

              {/* Buttons */}
              <div className="space-y-3">
                <button
                  onClick={handlePlaceOrder}
                  disabled={selectedItems.length === 0}
                  className="w-full py-4 bg-linear-to-r from-rose-500 to-pink-500 text-white font-bold rounded-xl hover:shadow-lg hover:shadow-rose-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Đặt Hàng ({selectedItems.length})
                </button>
                <Link
                  to="/shop"
                  className="block w-full py-3 bg-slate-100 text-slate-900 font-bold rounded-xl hover:bg-slate-200 transition-colors text-center"
                >
                  Tiếp tục mua sắm
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
