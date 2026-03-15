import { reviewApi } from "../apis/reviewApi";

const createReview = async (id, { title, content, rating }) => {
  const reviewData = {
    title,
    content,
    rating,
  };
  return await reviewApi.createReview(id, reviewData);
};

const getListReviews = async (id, params) => {
  return await reviewApi.getListReviews(id, params);
};

export const reviewService = {
  createReview,
  getListReviews,
};
