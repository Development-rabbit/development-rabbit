// The backend also sets httpOnly cookies, but those are marked `secure`,
// which browsers refuse to store over plain http://localhost in dev. So the
// frontend relies on the access/refresh tokens the API also returns in the
// JSON body, sent back as an `Authorization: Bearer` header instead.
const ACCESS_TOKEN_KEY = "courseapp_access_token";
const REFRESH_TOKEN_KEY = "courseapp_refresh_token";

export const getAccessToken = () => localStorage.getItem(ACCESS_TOKEN_KEY);
export const getRefreshToken = () => localStorage.getItem(REFRESH_TOKEN_KEY);

export const setTokens = ({ accessToken, refreshToken }) => {
  if (accessToken) localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
  if (refreshToken) localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
};

export const clearTokens = () => {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
};
