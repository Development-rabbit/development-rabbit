import api from "./axios";
import { setTokens, clearTokens } from "./tokenStorage";

export const registerUser = async ({ name, email, password }) => {
  const { data } = await api.post("/users/register", { name, email, password });
  return data.data;
};

export const loginUser = async ({ email, password }) => {
  const { data } = await api.post("/users/login", { email, password });
  const { accessToken, refreshToken, user } = data.data;
  setTokens({ accessToken, refreshToken });
  return user;
};

export const googleLogin = async (idToken) => {
  const { data } = await api.post("/users/auth/google", { idToken });
  const { accessToken, refreshToken, user } = data.data;
  setTokens({ accessToken, refreshToken });
  return user;
};

export const githubLogin = async (code) => {
  const { data } = await api.post("/users/auth/github", { code });
  const { accessToken, refreshToken, user } = data.data;
  setTokens({ accessToken, refreshToken });
  return user;
};

export const logoutUser = async () => {
  try {
    await api.post("/users/logout");
  } finally {
    clearTokens();
  }
};

export const getCurrentUser = async () => {
  const { data } = await api.get("/users/current-user");
  return data.data;
};

export const searchUsers = async (q, params = {}) => {
  const { data } = await api.get("/users/search", { params: { q, ...params } });
  return data.data;
};
