import axios from "axios";

const APIAuth = axios.create({
  baseURL: "https://conferencemanagementsys-backend.onrender.com/api"
});

APIAuth.interceptors.request.use(config => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default APIAuth;