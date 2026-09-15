import { getTranslation } from '@/constants/text';
import { useApp } from '@/contexts/app.context';
import { Ionicons } from '@expo/vector-icons';
import { BottomTabBarProps } from 'expo-router/build/react-navigation/bottom-tabs';
import { Pressable, StyleSheet, Text, View } from 'react-native';

type TabRoute = {
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  activeIcon: keyof typeof Ionicons.glyphMap;
  route: string;
};

export default function TabBar({
  state,
  navigation,
}: BottomTabBarProps) {
  const { color, langues } = useApp();

  // Se recalcule automatiquement quand langues.appLng change
  const language = getTranslation(langues?.appLng || 'mg');

  const routesMapRecord: TabRoute[] = [
    {
      label: language.homeText,
      icon: 'home-outline',
      activeIcon: 'home',
      route: 'index',
    },
    {
      label: language.bibleText,
      icon: 'book-outline',
      activeIcon: 'book',
      route: 'book',
    },
    {
      label: language.noteText,
      icon: 'clipboard-outline',
      activeIcon: 'clipboard',
      route: 'my-note',
    },
    {
      label: language.settingText,
      icon: 'cog-outline',
      activeIcon: 'cog',
      route: 'app-setting',
    },
  ];

  return (
    <View
      style={[
        styles.tabContainer,
        {
          backgroundColor: color?.bg,
          borderColor: color?.borderColor,
        },
      ]}
    >
      {state.routes.map((route, index) => {
        const tab = routesMapRecord.find(
          (item) => item.route === route.name
        );

        if (!tab) return null;

        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        return (
          <Pressable
            key={route.key}
            onPress={onPress}
            style={[
              styles.tab,
              isFocused && {
                backgroundColor: color?.text,
                paddingHorizontal: 30,
              },
            ]}
          >
            <Ionicons
              name={isFocused ? tab.activeIcon : tab.icon}
              size={24}
              color={isFocused ? color?.bg : color?.text}
            />

            {isFocused && (
              <Text
                style={[
                  styles.label,
                  {
                    color: color?.bg,
                  },
                ]}
              >
                {tab.label}
              </Text>
            )}
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  tabContainer: { position: 'absolute', bottom: 15, left: 5, right: 5, borderWidth: 1, borderRadius: 50, paddingVertical: 8, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', },
  tab: { alignItems: 'center', justifyContent: 'center', paddingVertical: 8, paddingHorizontal: 10, borderRadius: 50, flexDirection: 'row', gap: 6, },
  label: { fontSize: 12, },
});