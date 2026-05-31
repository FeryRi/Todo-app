import { getAuth } from "firebase/auth";
import { app } from "./firebase";

// getAuth crea la instancia de Auth de Firebase.
// La persistencia de sesión se maneja con AsyncStorage
// al guardar el JWT en AsyncStorage y se inyecta en cada llamada al backend.
export const auth = getAuth(app);
