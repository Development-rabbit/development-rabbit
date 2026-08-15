import api from "./axios";

export const reportVideoProgress = async (contentId, positionSeconds) => {
  const { data } = await api.patch(`/progress/${contentId}/heartbeat`, { positionSeconds });
  return data.data;
};

export const getContinueLearning = async () => {
  const { data } = await api.get("/progress/dashboard");
  return data.data;
};
