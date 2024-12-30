import axios from "axios";

const api = axios.create({
  baseURL: "http://192.168.54.57:3000",
  timeout: 3000,
});
export default api;
