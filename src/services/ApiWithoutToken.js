import Axios from "axios";

// Local
const apiUrl = `https://3b8d21d21a3a0ba554e794fa41b33331.serveo.net`;

// Staging backend
// const apiUrl = `https://www.stageapi-acharyainstitutes.in`;
// const apiUrl = `http://ec2-15-206-202-184.ap-south-1.compute.amazonaws.com:8081/Acharya_University`;
// const apiUrl = `https://www.stageapi-acharyainstitutes.in/Acharya_University`;

const axios = Axios.create({
  baseURL: apiUrl,
});

export default axios;
