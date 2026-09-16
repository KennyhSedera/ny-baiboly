import { Stack } from 'expo-router'

const BaibolyLayout = () => {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="app-search-global" options={{ headerShown: false }} />
      <Stack.Screen name="book-reading" options={{ headerShown: false }} />
      <Stack.Screen name="book-chapter" options={{ headerShown: false }} />
      <Stack.Screen name="book-chapter-verse" options={{ headerShown: false }} />
      <Stack.Screen name="note-input" options={{ headerShown: false }} />
      <Stack.Screen name="note-viewer" options={{ headerShown: false }} />
      <Stack.Screen name="verse-archived" options={{ headerShown: false }} />
      <Stack.Screen name="verse-favoris" options={{ headerShown: false }} />
    </Stack>
  )
}

export default BaibolyLayout