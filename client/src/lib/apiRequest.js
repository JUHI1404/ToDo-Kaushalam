import axios from "axios";

const apiRequest = axios.create({
  baseURL: "https://todo-kaushalam.onrender.com/api",
  withCredentials: true,
});

export default apiRequest;