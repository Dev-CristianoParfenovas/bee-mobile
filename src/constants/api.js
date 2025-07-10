import axios from "axios";

const api = axios.create({
  baseURL: "http://3.84.211.229:3000",
  timeout: 10000, // 10 segundos,
});
export default api;
