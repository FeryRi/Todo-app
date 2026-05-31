import AsyncStorage from "@react-native-async-storage/async-storage";
import { router, Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";

import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import "@/global.css";
import { useColorScheme } from "@/hooks/use-color-scheme";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";

export const unstable_settings = {
  anchor: "(tabs)",
};

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    // Verifica el token UNA SOLA VEZ al iniciar.
    AsyncStorage.getItem("userToken").then((token) => {
      if (!token) {
        router.replace("/login");
      }
      // Si hay token, el Stack ya muestra (tabs) como ruta anchor 
      setAuthChecked(true);
    });
  }, []);

  return (
    <GluestackUIProvider mode="light">
      <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="login" />
          <Stack.Screen name="register" />
          <Stack.Screen name="lists/[id]" />
          <Stack.Screen
            name="modal"
            options={{ presentation: "modal", title: "Modal" }}
          />
          {__DEV__ && (
            <Stack.Screen name="storybook" options={{ headerShown: false }} />
          )}
        </Stack>

        <StatusBar style="auto" />

        {!authChecked && (
          <View
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "#f5f7fa",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <ActivityIndicator size="large" color="#3498db" />
          </View>
        )}
      </ThemeProvider>
    </GluestackUIProvider>
  );
}
