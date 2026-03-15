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

export const orderService = {
  createOrder,
  getListOrders,
  getOrderById,
};
