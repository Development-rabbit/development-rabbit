import api from "./axios";

export const initiatePurchase = async (courseId) => {
  const { data } = await api.post(`/courses/${courseId}/purchase/initiate`);
  return data.data;
};

export const verifyPurchase = async (courseId, payload) => {
  const { data } = await api.post(`/courses/${courseId}/purchase/verify`, payload);
  return data.data;
};

export const getMyPurchases = async (params = {}) => {
  const { data } = await api.get("/purchases/me", { params });
  return data.data;
};

export const initiateCartPurchase = async (courseIds) => {
  const { data } = await api.post("/purchases/cart/initiate", { courseIds });
  return data.data;
};

export const verifyCartPurchase = async (payload) => {
  const { data } = await api.post("/purchases/cart/verify", payload);
  return data.data;
};
