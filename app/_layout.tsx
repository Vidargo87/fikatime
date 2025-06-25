import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import Colors from "@/constants/colors";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { trpc, trpcClient } from "@/lib/trpc";

export const unstable_settings = {
  initialRouteName: "(tabs)",
};

// Create a client for React Query
const queryClient = new QueryClient();

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    ...FontAwesome.font,
  });

  useEffect(() => {
    if (error) {
      console.error("Font loading error:", error);
    }
  }, [error]);

  useEffect(() => {
    if (loaded) {
      // Add a small delay to ensure smooth transition
      const hideSplash = async () => {
        try {
          await SplashScreen.hideAsync();
        } catch (e) {
          console.warn("Error hiding splash screen:", e);
        }
      };
      
      hideSplash();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  return (
    <>
      <StatusBar style="dark" />
      <trpc.Provider client={trpcClient} queryClient={queryClient}>
        <QueryClientProvider client={queryClient}>
          <Stack
            screenOptions={{
              headerStyle: {
                backgroundColor: Colors.background,
              },
              headerTintColor: Colors.text,
              headerTitleStyle: {
                fontWeight: '600',
              },
              contentStyle: {
                backgroundColor: Colors.background,
              },
            }}
          >
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen 
              name="timer" 
              options={{ 
                title: "Fika Time",
                headerShown: false,
                presentation: "fullScreenModal"
              }} 
            />
            <Stack.Screen 
              name="reflection" 
              options={{ 
                title: "Fika Reflection",
                presentation: "modal"
              }} 
            />
            <Stack.Screen 
              name="onboarding" 
              options={{ 
                headerShown: false,
                presentation: "modal"
              }} 
            />
            <Stack.Screen 
              name="login" 
              options={{ 
                headerShown: false,
                presentation: "modal"
              }} 
            />
            <Stack.Screen 
              name="register" 
              options={{ 
                headerShown: false,
                presentation: "modal"
              }} 
            />
          </Stack>
        </QueryClientProvider>
      </trpc.Provider>
    </>
  );
}