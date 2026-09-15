import AsyncStorage from "@react-native-async-storage/async-storage";
import { useCallback, useEffect, useState } from "react";
import { useColorScheme } from "react-native";

export type Theme = "light" | "dark" | "system";
export type ResolvedTheme = "dark" | "light";

const THEME_KEY = "theme";

export const useTheme = () => {
  const systemColorScheme = useColorScheme();
  const [theme, setThemeState] = useState<Theme>("system");
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    (async () => {
      const stored = await AsyncStorage.getItem(THEME_KEY);
      setThemeState((stored as Theme) || "system");
      setIsLoaded(true);
    })();
  }, []);

  const resolvedTheme: ResolvedTheme =
    theme === "system"
      ? systemColorScheme === "dark" ? "dark" : "light"
      : theme;

  const setTheme = useCallback(async (newTheme: Theme) => {
    await AsyncStorage.setItem(THEME_KEY, newTheme);
    setThemeState(newTheme);
  }, []);

  return {
    theme,
    resolvedTheme,
    setTheme,
    isLoaded,
    isDark: resolvedTheme === "dark" ? true : false,
  };
};