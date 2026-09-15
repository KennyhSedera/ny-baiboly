import TabBar from '@/components/tab-bar';
import { Tabs } from 'expo-router';
import { BottomTabBarProps } from 'expo-router/build/react-navigation/bottom-tabs';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
      }}
      tabBar={(props: BottomTabBarProps) => <TabBar {...props} />}
    >
      <Tabs.Screen name="index" />
      <Tabs.Screen name="book" />
      <Tabs.Screen name="my-note" />
      <Tabs.Screen name="app-setting" />
    </Tabs>
  );
}
