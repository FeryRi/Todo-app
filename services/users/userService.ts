import axios from "axios";

// Usa axios directamente para no depender de que haya un usuario logueado.
const BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? "https://todoback-xkpn.onrender.com";
console.log("[userService] baseURL →", BASE_URL);

const publicClient = axios.create({
  baseURL: BASE_URL,
  timeout: 35000, 
  headers: { "Content-Type": "application/json" },
});

export type RegisterPayload = {
  displayName: string;
  email: string;
  password: string;
  passwordConfirm: string;
};

// Registra el usuario en Firebase Y en la BD del backend 
export async function registerUser(payload: RegisterPayload): Promise<void> {
  console.log("[registerUser] POST", BASE_URL + "/users");
  try {
    await publicClient.post("/users", payload);
  } catch (err: any) {
    console.error("[registerUser] FAILED", {
      status: err?.response?.status,
      data: err?.response?.data,
      message: err?.message,
      url: BASE_URL + "/users",
    });
    throw err;
  }
}
