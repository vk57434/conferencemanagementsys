import axios from "axios";

const API = axios.create({
  baseURL: "https://conferencemanagementsys-backend.onrender.com/api",
  withCredentials: true
});

export default API;