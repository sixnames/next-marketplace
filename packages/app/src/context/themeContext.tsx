import React, { createContext, useContext, useEffect, useMemo, useRef } from 'react';
import { THEME_DARK, THEME_KEY, THEME_LIGHT, THEME_NOT_ALL } from '@rg/config';
import { Theme } from '../types';
import useLocalStorage from '../hooks/useLocalStorage';

interface ThemeContextInterface {
  theme: Theme;
  isDark: boolean;
  isLight: boolean;
  toggleTheme?: () => void;
}

const ThemeContext = createContext<ThemeContextInterface>({
  theme: THEME_LIGHT,
  isDark: false,
  isLight: true,
});

const ThemeContextProvider: React.FC = ({ children }) => {
  const [theme, setTheme] = useLocalStorage(THEME_KEY, () => {
    const matchMedia = window.matchMedia('(prefers-color-scheme: dark)');

    // If `prefers-color-scheme` is not supported, fall back to light mode.
    if (matchMedia.media === THEME_NOT_ALL) {
      return THEME_LIGHT;
    }

    // If is user prefers dark theme
    if (matchMedia.matches) {
      return THEME_DARK;
    }

    return THEME_LIGHT;
  });
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref && ref.current) {
      ref.current.setAttribute('data-theme', theme);
    }
  }, [ref, theme]);

  const value = useMemo(() => {
    return {
      theme,
      isDark: theme === THEME_DARK,
      isLight: theme === THEME_LIGHT,
      toggleTheme: () => {
        if (theme === THEME_DARK) {
          setTheme(THEME_LIGHT);
        } else {
          setTheme(THEME_DARK);
        }
      },
    };
  }, [theme, setTheme]);

  return (
    <ThemeContext.Provider value={value}>
      <div ref={ref}>{children}</div>
    </ThemeContext.Provider>
  );
};

const useThemeContext = () => {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error('useThemeContext must be used within a ThemeContextProvider');
  }

  return context;
};

export { ThemeContextProvider, useThemeContext };
