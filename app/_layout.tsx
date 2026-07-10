import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import {
  useFonts,
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
} from '@expo-google-fonts/inter';
import {
  Epilogue_500Medium,
  Epilogue_600SemiBold,
  Epilogue_700Bold,
} from '@expo-google-fonts/epilogue';
import { CivicNoirTheme } from '../constants/theme';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
    Epilogue_500Medium,
    Epilogue_600SemiBold,
    Epilogue_700Bold,
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerShown: false,
          animation: 'slide_from_right',
          animationDuration: CivicNoirTheme.motion.base,
          contentStyle: { backgroundColor: CivicNoirTheme.colors.surfaceBright },
        }}
      >
        <Stack.Screen name="index" options={{ animation: 'fade' }} />
        <Stack.Screen name="citizen-auth" />
        <Stack.Screen name="admin-auth" />
        <Stack.Screen name="citizen-dashboard" options={{ animation: 'fade', gestureEnabled: false }} />
        <Stack.Screen name="admin-dashboard" options={{ animation: 'fade', gestureEnabled: false }} />
        <Stack.Screen name="new-report" options={{ animation: 'slide_from_bottom' }} />
      </Stack>
    </>
  );
}
