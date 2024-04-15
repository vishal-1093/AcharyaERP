import Axios from "axios";

// Local
const apiUrl = `https://30ba4f75516ffb674614a1d15309f9a1.serveo.net`;

// Staging backend
// const apiUrl = `https://www.stageapi-acharyainstitutes.in`;
// const apiUrl = `http://ec2-15-206-202-184.ap-south-1.compute.amazonaws.com:8081/Acharya_University`;
// const apiUrl = `https://www.stageapi-acharyainstitutes.in/Acharya_University`;

const axios = Axios.create({
  baseURL: apiUrl,
});

export default axios;
