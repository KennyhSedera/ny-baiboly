import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { useColorScheme } from "react-native";

export type Theme = "light" | "dark" | "system";
export type ResolvedTheme = "dark" | "light";

const THEME_KEY = "theme";

interface ThemeContextValue {
  theme: Theme;
  resolvedTheme: ResolvedTheme;
  isDark: boolean;
  isLoaded: boolean;
  setTheme: (theme: Theme) => Promise<void>;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export function ThemeProviderCustom({ children }: { children: ReactNode }) {
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

  const setTheme = useCallback(async (newTheme: Theme) => {
    await AsyncStorage.setItem(THEME_KEY, newTheme);
    setThemeState(newTheme);
  }, []);

  const resolvedTheme: ResolvedTheme =
    theme === "system"
      ? systemColorScheme === "dark" ? "dark" : "light"
      : theme;

  const value: ThemeContextValue = {
    theme,
    resolvedTheme,
    isDark: resolvedTheme === "dark",
    isLoaded,
    setTheme,
  };

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error("useTheme() doit être utilisé à l'intérieur de <ThemeProviderCustom>.");
  }
  return ctx;
}