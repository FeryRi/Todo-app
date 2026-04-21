// services/authService.ts
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { auth } from "./auth";

// Tu función login existente...
export const login = async (email: string, password: string) => {
  const userCredential = await signInWithEmailAndPassword(
    auth,
    email,
    password,
  );
  const token = await userCredential.user.getIdToken();
  return token;
};

// Nueva función logout
export const logout = async () => {
  try {
    await signOut(auth);
    return { success: true };
  } catch (error) {
    console.error("Error en logout:", error);
    return { success: false, error: "No se pudo cerrar sesión" };
  }
};
