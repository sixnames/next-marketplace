import * as React from 'react';
import { debounce } from 'lodash';
import { THEME_DARK, THEME_LIGHT } from '../config/common';
import { Theme } from '../types/clientTypes';

interface ThemeContextInterface {
  theme: Theme;
  isDark: boolean;
  isLight: boolean;
  toggleTheme?: () => void;
  logoSlug: string;
}

const ThemeContext = React.createContext<ThemeContextInterface>({
  theme: THEME_LIGHT,
  isDark: false,
  isLight: true,
  logoSlug: 'siteLogo',
});

const ThemeContextProvider: React.FC = ({ children }) => {
  const [vh, setVh] = React.useState(() =>
    typeof window !== 'undefined' ? window.innerHeight * 0.01 : 0,
  );
  const [theme, setTheme] = React.useState<Theme | null>(null);

  React.useEffect(() => {
    const initialTheme = (document.documentElement.getAttribute('data-theme') ||
      THEME_LIGHT) as Theme;
    setTheme(initialTheme);
  }, []);

  React.useEffect(() => {
    function resizeHandler() {
      setVh(window.innerHeight * 0.01);
    }
    const debouncedResizeHandler = debounce(resizeHandler, 250);
    debouncedResizeHandler();

    window.addEventListener('resize', debouncedResizeHandler);

    return () => {
      window.removeEventListener('resize', debouncedResizeHandler);
    };
  }, []);

  React.useEffect(() => {
    const pageStyle = `
      --vh: ${vh}px;
      --fullHeight: calc(${vh}px * 100);
      `;

    const pageHtml = document.querySelector('html');
    if (pageHtml) {
      pageHtml.setAttribute('style', pageStyle);
    }
  }, [vh, theme]);

  const toggleThemeValues = React.useCallback((prevTheme: string | null, theme: string) => {
    if (theme !== 'undefined' && prevTheme !== theme) {
      window.localStorage.setItem('theme', theme);
      document.documentElement.setAttribute('data-theme', theme);
      document.documentElement.classList.remove(`${prevTheme}`);
      document.documentElement.classList.add(theme);
    }
  }, []);

  const toggleTheme = React.useCallback(() => {
    if (theme === THEME_DARK) {
      setTheme((prevTheme) => {
        toggleThemeValues(prevTheme, THEME_LIGHT);
        return THEME_LIGHT;
      });
    } else {
      setTheme((prevTheme) => {
        toggleThemeValues(prevTheme, THEME_DARK);
        return THEME_DARK;
      });
    }
  }, [toggleThemeValues, theme]);

  const value = React.useMemo(() => {
    const isDark = theme === THEME_DARK;
    return {
      theme: theme || THEME_LIGHT,
      isDark,
      isLight: theme === THEME_LIGHT,
      logoSlug: isDark ? 'siteLogo' : 'siteLogoDark',
      toggleTheme,
    };
  }, [theme, toggleTheme]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

const useThemeContext = (): ThemeContextInterface => {
  const context = React.useContext(ThemeContext);

  if (!context) {
    throw new Error('useThemeContext must be used within a ThemeContextProvider');
  }

  return context;
};

export { ThemeContextProvider, useThemeContext };
