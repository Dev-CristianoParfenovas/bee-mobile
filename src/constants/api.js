import axios from "axios";

const api = axios.create({
  baseURL: "http://192.168.0.7:3000",
  timeout: 10000, // 10 segundos,
});
export default api;
