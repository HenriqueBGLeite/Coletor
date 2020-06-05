import axios from 'axios';

const api = axios.create({
  // Teste
  // baseURL: 'https://localhost:44318/api/',
  // Produção
  baseURL: 'http://192.168.0.118:81/api/',
});

api.interceptors.request.use(async (config) => {
  const token = localStorage.getItem('@EpocaColetor:token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`; // eslint-disable-line
  }
  return config;
});

api.interceptors.response.use(
  async (response) => {
    return response;
  },
  async (err) => {
    if (err.response.status === 401) {
      localStorage.removeItem('@EpocaColetor:token');
      window.location.href = '/';

      return Promise.reject(err);
    }
    return Promise.reject(err);
  },
);

export default api;
