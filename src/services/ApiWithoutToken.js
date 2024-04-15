import Axios from "axios";

// Local
const apiUrl = `https://1b5e9d0ec35faba3edf13cd08eaf7874.serveo.net`;

// Staging backend
// const apiUrl = `https://www.stageapi-acharyainstitutes.in`;
// const apiUrl = `http://ec2-15-206-202-184.ap-south-1.compute.amazonaws.com:8081/Acharya_University`;
// const apiUrl = `https://www.stageapi-acharyainstitutes.in/Acharya_University`;

const axios = Axios.create({
  baseURL: apiUrl,
});

export default axios;
