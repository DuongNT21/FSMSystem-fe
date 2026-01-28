import axiosClient from "./axiosClient";
const DEFAULT_PARAMS = {
  page: 0,
  size: 10,
  sort: "createdAt,asc",
  status: 1,
  minPrice: 0,
  maxPrice: 999999999,
};
export const productApi = {
  async getBouquets(params) {
    const payload = await axiosClient.get("/bouquets/get", { params });

    console.log("payload:", payload);

    const bouquets = payload.data.map((item) => item.bouquet);

    return {
      bouquets,
      page: payload.page,
      totalPages: payload.totalPages,
      total: payload.total,
    };
  },
  async getById(id) {
    const res = await axiosClient.get(`bouquets/${id}`);
    return res.data;
  },

  create(data) {
    return axiosClient.post("bouquets/create", data);
  },

  update(data) {
    return axiosClient.put("bouquets/update", data);
  },

  delete(id) {
    return axiosClient.delete(`bouquets/${id}`);
  },
};
