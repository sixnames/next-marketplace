import * as React from 'react';
import { debounce } from 'lodash';
import { useConfigContext } from './configContext';
import { THEME_COOKIE_KEY, THEME_DARK, THEME_LIGHT } from 'config/common';
import { Theme } from 'types/clientTypes';

interface ThemeContextInterface {
  theme: Theme;
  isDark: boolean;
  isLight: boolean;
  toggleTheme?: () => void;
  logoSlug: string;
}

const ThemeContext = React.createContext<ThemeContextInterface>({
  theme: 'undefined',
  isDark: false,
  isLight: true,
  logoSlug: 'siteLogo',
});

const ThemeContextProvider: React.FC = ({ children }) => {
  const [vh, setVh] = React.useState(() =>
    typeof window !== 'undefined' ? window.innerHeight * 0.01 : 0,
  );
  const [theme, setTheme] = React.useState<Theme>('undefined');
  const { themeStyles } = useConfigContext();

  React.useEffect(() => {
    const localStorageTheme = window.localStorage.getItem(THEME_COOKIE_KEY) as Theme;
    if (localStorageTheme && localStorageTheme !== 'undefined') {
      setTheme(localStorageTheme);
    }
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
    const themeStyle = `
      --vh: ${vh}px;
      --fullHeight: calc(${vh}px * 100);
      ${themeStyles}
      `;

    const pageHtml = document.querySelector('html');
    if (pageHtml) {
      pageHtml.setAttribute('style', themeStyle);
    }
  }, [vh, theme, themeStyles]);

  React.useEffect(() => {
    const localStorageTheme = window.localStorage.getItem(THEME_COOKIE_KEY);
    if (theme !== 'undefined' && localStorageTheme !== theme) {
      window.localStorage.setItem(THEME_COOKIE_KEY, theme);
      document.documentElement.setAttribute('data-theme', theme);
      document.documentElement.classList.remove(`${localStorageTheme}`);
      document.documentElement.classList.add(theme);
    }
  }, [theme]);

  const toggleTheme = React.useCallback(() => {
    if (theme === THEME_DARK) {
      setTheme(THEME_LIGHT);
    } else {
      setTheme(THEME_DARK);
    }
  }, [theme]);

  const value = React.useMemo(() => {
    const isDark = theme === THEME_DARK;
    return {
      theme,
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
