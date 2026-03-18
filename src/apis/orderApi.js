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
  const response = await http.get("/order", {
    params: param,
  });
  const payload = response.data;
  const list = Array.isArray(payload)
    ? payload
    : Array.isArray(payload?.data?.items)
      ? payload.data.items
      : Array.isArray(payload?.data)
        ? payload.data
        : [];

  return list.map((item) => ({
    id: item.id,
    fullName: item.fullName,
    status: item.status,
    phoneNumber: item.phoneNumber,
    deliveryAddress: item.deliveryAddress,
    totalPrice: item.totalPrice,
  }));
};

const getOrderById = async (id) => {
  const response = await http.get(`/order/${id}`);
  return {
    id: response.data.id,
    status: response.data.status,
    fullName: response.data.fullName,
    phoneNumber: response.data.phoneNumber,
    deliveryAddress: response.data.deliveryAddress,
    totalPrice: response.data.totalPrice,
    orderItems: response.data.orderItems.map((item) => ({
      id: item.id,
      bouquetName: item.bouquetName,
      bouquetDescription: item.bouquetDescription,
      quantity: item.quantity,
      price: item.price,
    })),
  };
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
  payOrder,
};
