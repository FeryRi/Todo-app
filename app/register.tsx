import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import { Ionicons } from '@expo/vector-icons'; 
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { login } from "../services/auth/authServices";
import { registerUser } from "../services/users/userService";

export default function RegisterScreen() {
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail]             = useState("");
  const [password, setPassword]       = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword]             = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);

 
  const [fieldErrors, setFieldErrors] = useState({
    displayName: "",
    email: "",
    password: "",
    passwordConfirm: "",
  });
  const [apiError, setApiError] = useState("");
  const [apiSuccess, setApiSuccess] = useState("");

  const clearErrors = () => {
    setFieldErrors({ displayName: "", email: "", password: "", passwordConfirm: "" });
    setApiError("");
    setApiSuccess("");
  };

  const validate = (): boolean => {
    const errs = { displayName: "", email: "", password: "", passwordConfirm: "" };
    let ok = true;

    if (!displayName.trim() || displayName.trim().length < 2) {
      errs.displayName = "Mínimo 2 caracteres";
      ok = false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errs.email = "Formato de correo inválido";
      ok = false;
    }
    if (password.length < 8) {
      errs.password = "Mínimo 8 caracteres";
      ok = false;
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
      errs.password = "Necesita mayúscula, minúscula y número (ej. Password1)";
      ok = false;
    }
    if (password !== passwordConfirm) {
      errs.passwordConfirm = "Las contraseñas no coinciden";
      ok = false;
    }

    setFieldErrors(errs);
    return ok;
  };

  const handleRegister = async () => {
    clearErrors();
    if (!validate()) return;

    setLoading(true);
    try {
      setApiSuccess("Creando cuenta…");

      // 1. Crea el usuario en Firebase Admin + BD del backend (POST /users)
      await registerUser({ displayName: displayName.trim(), email, password, passwordConfirm });

      setApiSuccess("Usuario creado. Iniciando sesión…");

      // 2. Login con Firebase client SDK
      const token = await login(email, password);
      await AsyncStorage.setItem("userToken", token);

      setApiSuccess("¡Listo! Redirigiendo…");
      router.replace("/(tabs)");
    } catch (err: any) {
      const status = err?.response?.status;
      const body =
        err?.response?.data?.message ??
        err?.response?.data ??
        err?.message ??
        "Sin respuesta del servidor";
      setApiError(status ? `Error ${status}: ${body}` : String(body));
      setApiSuccess("");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}
      >
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <View style={styles.header}>
            <Text style={styles.title}>Crear cuenta</Text>
            <Text style={styles.subtitle}>Regístrate para comenzar</Text>
          </View>

          {/* Error global de API */}
          {apiError !== "" && (
            <View style={styles.apiBanner}>
              <Text style={styles.apiBannerText}>{apiError}</Text>
            </View>
          )}

          {/* Mensaje de progreso */}
          {apiSuccess !== "" && (
            <View style={styles.successBanner}>
              <Text style={styles.successBannerText}>{apiSuccess}</Text>
            </View>
          )}

          <View style={styles.form}>
            <Field label="Nombre completo" error={fieldErrors.displayName}>
              <TextInput
                style={[styles.input, fieldErrors.displayName ? styles.inputError : null]}
                placeholder="Tu nombre"
                placeholderTextColor="#999"
                value={displayName}
                onChangeText={(t) => { setDisplayName(t); setFieldErrors(p => ({ ...p, displayName: "" })); }}
                autoCapitalize="words"
              />
            </Field>

            <Field label="Correo electrónico" error={fieldErrors.email}>
              <TextInput
                style={[styles.input, fieldErrors.email ? styles.inputError : null]}
                placeholder="ejemplo@correo.com"
                placeholderTextColor="#999"
                value={email}
                onChangeText={(t) => { setEmail(t); setFieldErrors(p => ({ ...p, email: "" })); }}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
            </Field>

<Field label="Contraseña (ej. Password1)" error={fieldErrors.password}>
  <View style={styles.passwordRow}>
    <TextInput
      style={[styles.input, styles.passwordInput, fieldErrors.password ? styles.inputError : null]}
      placeholder="Mayúscula + minúscula + número"
      placeholderTextColor="#999"
      value={password}
      onChangeText={(t) => { setPassword(t); setFieldErrors(p => ({ ...p, password: "" })); }}
      secureTextEntry={!showPassword}
    />
    <TouchableOpacity style={styles.eyeBtn} onPress={() => setShowPassword(v => !v)}>
      <Ionicons 
        name={showPassword ? "eye-off-outline" : "eye-outline"} 
        size={22} 
        color="#666" 
      />
    </TouchableOpacity>
  </View>
</Field>


            <Field label="Confirmar contraseña" error={fieldErrors.passwordConfirm}>
              <View style={styles.passwordRow}>
                <TextInput
                  style={[styles.input, styles.passwordInput, fieldErrors.passwordConfirm ? styles.inputError : null]}
                  placeholder="Repite la contraseña"
                  placeholderTextColor="#999"
                  value={passwordConfirm}
                  onChangeText={(t) => { setPasswordConfirm(t); setFieldErrors(p => ({ ...p, passwordConfirm: "" })); }}
                  secureTextEntry={!showPasswordConfirm}
                />
                <TouchableOpacity style={styles.eyeBtn} onPress={() => setShowPasswordConfirm(v => !v)}>
                  <Text style={styles.eyeText}>{showPasswordConfirm ? "👁️" : "🙈"}</Text>
                </TouchableOpacity>
              </View>
            </Field>

            <TouchableOpacity
              style={[styles.button, loading && styles.buttonDisabled]}
              onPress={handleRegister}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Crear cuenta</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity style={styles.loginLink} onPress={() => router.back()}>
              <Text style={styles.loginLinkText}>
                ¿Ya tienes cuenta? <Text style={styles.loginLinkBold}>Inicia sesión</Text>
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error: string;
  children: React.ReactNode;
}) {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      {children}
      {error !== "" && <Text style={styles.fieldError}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container:     { flex: 1, backgroundColor: "#f5f7fa" },
  keyboardView:  { flex: 1 },
  content:       { flexGrow: 1, justifyContent: "center", paddingHorizontal: 24, paddingVertical: 32 },
  header:        { marginBottom: 20, alignItems: "center" },
  title:         { fontSize: 30, fontWeight: "bold", color: "#2c3e50" },
  subtitle:      { fontSize: 15, color: "#7f8c8d", marginTop: 6 },
  apiBanner: {
    backgroundColor: "#fdecea",
    borderRadius: 10,
    padding: 12,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: "#e74c3c",
  },
  apiBannerText: { color: "#c0392b", fontSize: 14, lineHeight: 20 },
  successBanner: {
    backgroundColor: "#eafaf1",
    borderRadius: 10,
    padding: 12,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: "#27ae60",
  },
  successBannerText: { color: "#1e8449", fontSize: 14 },
  form:          { width: "100%" },
  field:         { marginBottom: 16 },
  label:         { fontSize: 13, fontWeight: "600", color: "#2c3e50", marginBottom: 6 },
  input: {
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 13,
    fontSize: 15,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    color: "#2c3e50",
  },
  inputError:    { borderColor: "#e74c3c" },
  passwordRow:   { flexDirection: "row", alignItems: "center" },
  passwordInput: { flex: 1 },
  eyeBtn:        { paddingHorizontal: 12, paddingVertical: 13 },
  eyeText:       { fontSize: 18 },
  fieldError:    { color: "#e74c3c", fontSize: 12, marginTop: 4 },
  button: {
    backgroundColor: "#3498db",
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 8,
    elevation: 4,
  },
  buttonDisabled: { backgroundColor: "#95a5a6" },
  buttonText:     { color: "#fff", fontSize: 17, fontWeight: "600" },
  loginLink:      { marginTop: 20, alignItems: "center" },
  loginLinkText:  { color: "#7f8c8d", fontSize: 14 },
  loginLinkBold:  { color: "#3498db", fontWeight: "700" },
});
