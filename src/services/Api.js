import Axios from "axios";

// Local
// const apiUrl = `http://192.168.0.179:8080`;

// Staging backend
const apiUrl = `https://www.stageapi-acharyainstitutes.in`;

const token = JSON.parse(localStorage.getItem("AcharyaErpUser"))?.token;

const axios = Axios.create({
  baseURL: apiUrl,
});

axios.interceptors.request.use((config) => {
  config.headers.authorization = `Bearer ${token}`;
  return config;
});

export default axios;
