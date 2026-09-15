import { Stack } from 'expo-router';
import 'react-native-reanimated';

import { ThemeProviderCustom, useTheme } from '@/contexts/theme.context';
import { StatusBar } from 'react-native';
import { AppProvider } from './../contexts/app.context';

export const unstable_settings = {
  anchor: '(tabs)',
};

function AppContent() {
  const { resolvedTheme: colorScheme } = useTheme();

  return (
    <AppProvider>
      <StatusBar
        translucent
        backgroundColor={'transparent'}
      />

      <Stack
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen
          name="(tabs)"
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="(baiboly)"
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="modal"
          options={{
            presentation: 'modal',
            title: 'Modal',
            headerShown: true,
          }}
        />
      </Stack>
    </AppProvider>
  );
}

export default function RootLayout() {
  return (
    <ThemeProviderCustom>
      <AppContent />
    </ThemeProviderCustom>
  );
}