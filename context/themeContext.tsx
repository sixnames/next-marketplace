import * as React from 'react';
import { debounce } from 'lodash';
import { THEME_COOKIE_KEY, THEME_DARK, THEME_LIGHT } from 'config/common';
import { Theme } from 'types/clientTypes';
import { setCookie } from 'nookies';

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

export interface ThemeContextProviderInterface {
  initialTheme: Theme;
}

const ThemeContextProvider: React.FC<ThemeContextProviderInterface> = ({
  children,
  initialTheme,
}) => {
  const [vh, setVh] = React.useState(() =>
    typeof window !== 'undefined' ? window.innerHeight * 0.01 : 0,
  );
  const [theme, setTheme] = React.useState<Theme>(initialTheme);

  React.useEffect(() => {
    const themeProvider = document.querySelector('#theme-provider');
    if (themeProvider) {
      if (initialTheme === THEME_DARK) {
        themeProvider.setAttribute('data-theme', initialTheme);
        themeProvider.classList.remove(THEME_LIGHT);
        themeProvider.classList.add(initialTheme);
      } else {
        themeProvider.setAttribute('data-theme', initialTheme);
        themeProvider.classList.remove(THEME_DARK);
        themeProvider.classList.add(initialTheme);
      }
    }
  }, [initialTheme]);

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
      `;

    const pageHtml = document.querySelector('html');
    if (pageHtml) {
      pageHtml.setAttribute('style', themeStyle);
    }
  }, [vh, theme]);

  const toggleThemeValues = React.useCallback((prevTheme: string, theme: string) => {
    if (theme !== 'undefined' && prevTheme !== theme) {
      setCookie(null, THEME_COOKIE_KEY, theme);
      const themeProvider = document.querySelector('#theme-provider');
      if (themeProvider) {
        themeProvider.setAttribute('data-theme', theme);
        themeProvider.classList.remove(`${prevTheme}`);
        themeProvider.classList.add(theme);
      }
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
