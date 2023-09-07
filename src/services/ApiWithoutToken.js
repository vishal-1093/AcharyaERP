import Axios from "axios";

// Local
// const apiUrl = `http://192.168.0.179:8080`;

// Staging backend
const apiUrl = `https://www.stageapi-acharyainstitutes.in/Acharya_University`;

const axios = Axios.create({
  baseURL: apiUrl,
});

export default axios;
