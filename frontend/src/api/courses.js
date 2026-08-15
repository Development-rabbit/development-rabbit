import api from "./axios";

export const getCourses = async (params = {}) => {
  const { data } = await api.get("/courses", { params });
  return data.data;
};

export const getCourseDetail = async (courseId) => {
  const { data } = await api.get(`/courses/${courseId}`);
  return data.data;
};

export const createCourse = async (formData) => {
  const { data } = await api.post("/courses", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data.data;
};

export const updateCourse = async (courseId, formData) => {
  const { data } = await api.patch(`/courses/${courseId}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data.data;
};

export const deleteCourse = async (courseId) => {
  const { data } = await api.delete(`/courses/${courseId}`);
  return data.data;
};

export const toggleCourseLike = async (courseId) => {
  const { data } = await api.post(`/courses/${courseId}/like`);
  return data.data;
};

export const getCourseReviews = async (courseId, params = {}) => {
  const { data } = await api.get(`/courses/${courseId}/reviews`, { params });
  return data.data;
};

export const addCourseReview = async (courseId, payload) => {
  const { data } = await api.post(`/courses/${courseId}/reviews`, payload);
  return data.data;
};

export const deleteCourseReview = async (courseId, reviewId) => {
  const { data } = await api.delete(`/courses/${courseId}/reviews/${reviewId}`);
  return data.data;
};

export const getModules = async (courseId) => {
  const { data } = await api.get(`/courses/${courseId}/modules`);
  return data.data;
};

export const createModule = async (courseId, payload) => {
  const { data } = await api.post(`/courses/${courseId}/modules`, payload);
  return data.data;
};

export const updateModule = async (courseId, moduleId, payload) => {
  const { data } = await api.patch(`/courses/${courseId}/modules/${moduleId}`, payload);
  return data.data;
};

export const deleteModule = async (courseId, moduleId) => {
  const { data } = await api.delete(`/courses/${courseId}/modules/${moduleId}`);
  return data.data;
};

export const reorderModules = async (courseId, items) => {
  const { data } = await api.patch(`/courses/${courseId}/modules/reorder`, { items });
  return data.data;
};

export const createContent = async (courseId, moduleId, formData) => {
  const { data } = await api.post(`/courses/${courseId}/modules/${moduleId}/content`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data.data;
};

export const updateContent = async (courseId, moduleId, contentId, formData) => {
  const { data } = await api.patch(
    `/courses/${courseId}/modules/${moduleId}/content/${contentId}`,
    formData,
    { headers: { "Content-Type": "multipart/form-data" } }
  );
  return data.data;
};

export const deleteContent = async (courseId, moduleId, contentId) => {
  const { data } = await api.delete(`/courses/${courseId}/modules/${moduleId}/content/${contentId}`);
  return data.data;
};

export const reorderContent = async (courseId, moduleId, items) => {
  const { data } = await api.patch(`/courses/${courseId}/modules/${moduleId}/content/reorder`, { items });
  return data.data;
};

export const retryContentUpload = async (courseId, moduleId, contentId) => {
  const { data } = await api.post(
    `/courses/${courseId}/modules/${moduleId}/content/${contentId}/retry-upload`
  );
  return data.data;
};

export const getContent = async (contentId) => {
  const { data } = await api.get(`/content/${contentId}`);
  return data.data;
};

export const getCoursePurchasers = async (courseId, params = {}) => {
  const { data } = await api.get(`/courses/${courseId}/purchases`, { params });
  return data.data;
};
