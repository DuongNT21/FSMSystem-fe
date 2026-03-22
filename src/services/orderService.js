import { orderApi } from "../apis/orderApi";

const createOrder = async ({
  fullName,
  phoneNumber,
  deliveryAddress,
  orderItems,
}) => {
  const orderData = {
    fullName,
    phoneNumber,
    deliveryAddress,
    orderItems,
  };
  return await orderApi.createOrder(orderData);
};

const getListOrders = async (params) => {
  return await orderApi.getListOrders(params);
};

const getOrderById = async (id) => {
  return await orderApi.getOrderById(id);
};

const updateOrderStatus = async (id, status) => {
  return await orderApi.updateOrderStatus(id, status);
};

const payOrder = async (orderId) => {
  const token = localStorage.getItem("token");
  return await orderApi.payOrder(orderId, token);
};

export const orderService = {
  createOrder,
  getListOrders,
  getOrderById,
  updateOrderStatus,
  payOrder,
};
