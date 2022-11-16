import axios from "axios";

const demo1 = localStorage.getItem("authenticate");
let x = JSON.parse(demo1);

// Local

const ApiUrl = `http://192.168.0.179:8080/api`;

// Staging backend
// const ApiUrl = `https://www.stageapi-acharyainstitutes.in/api`;

if (demo1) {
  axios.interceptors.request.use(
    (config) => {
      config.headers.authorization = `Bearer  ${x.token}`;
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );
}

export default ApiUrl;
