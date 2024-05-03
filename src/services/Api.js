import Axios from "axios";

// Local
const apiUrl = `https://508f08c827db004e8206023afeeca19e.serveo.net`;

// Staging backend
// const apiUrl = `https://www.stageapi-acharyainstitutes.in`;
// const apiUrl = `http://ec2-15-206-202-184.ap-south-1.compute.amazonaws.com:8081/Acharya_University`;
// const apiUrl = `https://www.stageapi-acharyainstitutes.in/Acharya_University`;

const token = JSON.parse(sessionStorage.getItem("AcharyaErpUser"))?.token;

const axios = Axios.create({
  baseURL: apiUrl,
});

axios.interceptors.request.use((config) => {
  config.headers.authorization = `Bearer ${token}`;
  config.headers["ngrok-skip-browser-warning"] = true;
  return config;
});

export default axios;
