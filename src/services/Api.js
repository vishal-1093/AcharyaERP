import Axios from "axios";

// Local
const apiUrl = `https://9948a61fcbabbd2e8198e3fa93f7238a.serveo.net`;

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
