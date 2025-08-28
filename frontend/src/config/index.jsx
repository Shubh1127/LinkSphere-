// config/clientServer.js
import axios from "axios";

export const BASE_URL = "https://linksphere-blxe.onrender.com";

export const clientServer = axios.create({
  baseURL: "/api",   // after rewrite fix
  withCredentials: true,
});
