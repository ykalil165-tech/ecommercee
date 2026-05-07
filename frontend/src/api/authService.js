import api from './axios';

export const login = (username) =>
  api.post(`/auth/login?username=${encodeURIComponent(username)}`);
