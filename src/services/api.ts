import axios from "axios";

// const API_URL = "https://task-backend-nqrb.onrender.com";
const API_URL = "http://localhost:5000";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

interface User {
  id: number;
  email: string;
}

interface Task {
  id: number;
  title: string;
  description: string;
  userId: number;
}

export const auth = {
  login: async (email: string, password: string) => {
    const response = await api.post("/api/login", { email, password });
    return response.data;
  },
  register: async (email: string, password: string) => {
    const response = await api.post("/api/register", { email, password });
    return response.data;
  },
};

export const tasks = {
  getAll: async () => {
    const response = await api.get("/api/tasks");
    return response.data;
  },
  create: async (title: string, description: string) => {
    const response = await api.post("/api/tasks", { title, description });
    return response.data;
  },
  update: async (
    id: number,
    title: string,
    description: string
  ): Promise<Task> => {
    const response = await api.put(`/api/tasks/${id}`, { title, description });
    return response.data;
  },
  delete: async (id: number) => {
    await api.delete(`/api/tasks/${id}`);
  },
};

export type { Task, User };
export default api;
