import http from "../utils/http";

const createOrder = async (data) => {
  const response = await http.post("/order", data);
  return {
    id: response.data.id,
    fullName: response.data.fullName,
    phoneNumber: response.data.phoneNumber,
    deliveryAddress: response.data.deliveryAddress,
    totalPrice: response.data.totalPrice,
  };
};

const getListOrders = async (param) => {
  const response = await http.get("/order", { params: param });

  let rawArray = [];
  let totalPages = 1;

  const resData = response?.data || response;

  if (resData?.data?.data && Array.isArray(resData.data.data)) {
    rawArray = resData.data.data;
    totalPages = resData.data.totalPages || 1;
  } else if (resData?.data && Array.isArray(resData.data)) {
    rawArray = resData.data;
    totalPages = resData.totalPages || 1;
  } else if (Array.isArray(resData)) {
    rawArray = resData;
  }
  const mappedList = rawArray.map((item) => ({
    id: item.id,
    fullName: item.fullName,
    status: item.orderStatus ?? item.status,
    phoneNumber: item.phoneNumber,
    deliveryAddress: item.deliveryAddress,
    totalPrice: item.totalPrice,
  }));

  return {
    content: mappedList,
    totalPages: totalPages,
  };
};

const getOrderById = async (id) => {
  const response = await http.get(`/order/${id}`);
  // http interceptor returns response.data already; some endpoints wrap in { data: {...} }
  const d = response?.data ?? response;
  return {
    id: d.id,
    status: d.orderStatus ?? d.status,
    fullName: d.fullName,
    phoneNumber: d.phoneNumber,
    deliveryAddress: d.deliveryAddress,
    totalPrice: d.totalPrice,
    orderItems: (d.orderItems ?? []).map((item) => ({
      id: item.id,
      bouquetName: item.bouquetName,
      bouquetDescription: item.bouquetDescription,
      quantity: item.quantity,
      price: item.price,
    })),
  };
};

const updateOrderStatus = async (id, status) => {
  const response = await http.patch(`/order/${id}/status`, { status });
  return response.data;
};

const payOrder = async (orderId, token) => {
  const response = await http.post(`/order/${orderId}/payment`, null, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const orderApi = {
  createOrder,
  getListOrders,
  getOrderById,
  updateOrderStatus,
  payOrder,
};
