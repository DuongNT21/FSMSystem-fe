import http from "../utils/http";

const createReview = async (id, data) => {
  const response = await http.post(`/bouquets/${id}/review`, data);
  return {
    title: response.data.title,
    content: response.data.content,
    rating: response.data.rating,
  };
};

const getListReviews = async (id, param) => {
  const response = await http.get(`/bouquets/${id}/review`, {
    id: id,
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
    bouquetId: item.bouquetId,
    title: item.title,
    content: item.content,
    rating: item.rating,
  }));
};

export const reviewApi = {
  createReview,
  getListReviews,
};
