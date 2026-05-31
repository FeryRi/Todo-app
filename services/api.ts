import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { router } from "expo-router";

// Toda la app usa este objeto en lugar de axios directamente.
// Centraliza la URL base y los headers comunes; si el backend cambia de URL,
// solo se cambia aquí.
const BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? "https://todoback-xkpn.onrender.com";
console.log("[api] baseURL →", BASE_URL); // Confirmar qué URL usa la app en runtime

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 35000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Se ejecuta ANTES de enviar cada petición.
// se inyecta el JWT de Firebase en el header Authorization.
api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem("userToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      await AsyncStorage.removeItem("userToken");
      router.replace("/login");
    }
    return Promise.reject(error);
  },
);

export default api;
