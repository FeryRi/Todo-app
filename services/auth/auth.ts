import { getAuth } from "firebase/auth";
import { app } from "./firebase";

// La instancia se crea una sola vez y se reutiliza
export const auth = getAuth(app);
