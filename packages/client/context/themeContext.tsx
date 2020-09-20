import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { IS_BROWSER, THEME_DARK, THEME_KEY, THEME_LIGHT } from '../config';
import Cookies from 'js-cookie';
import { Theme } from '../types';
import { debounce } from 'lodash';

interface ThemeContextProviderInterface {
  initialTheme: Theme;
}

interface ThemeContextInterface {
  theme: Theme;
  isDark: boolean;
  isLight: boolean;
  toggleTheme?: () => void;
  logoSlug: string;
}

const ThemeContext = createContext<ThemeContextInterface>({
  theme: THEME_LIGHT,
  isDark: false,
  isLight: true,
  logoSlug: 'siteLogo',
});

const ThemeContextProvider: React.FC<ThemeContextProviderInterface> = ({
  children,
  initialTheme,
}) => {
  const [vh, setVh] = useState(() => (IS_BROWSER ? window.innerHeight * 0.01 : 0));
  const [theme, setTheme] = useState(() => initialTheme);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
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

  useEffect(() => {
    if (ref && ref.current) {
      ref.current.setAttribute('data-theme', theme);
      ref.current.setAttribute(
        'style',
        `
      --vh: ${vh}px;
      --fullHeight: calc(${vh}px * 100);
      `,
      );
    }
  }, [vh, ref, theme]);

  useEffect(() => {
    // set theme to cookie
    const themeInCookies = Cookies.get(THEME_KEY);
    if (themeInCookies !== theme) {
      Cookies.set(THEME_KEY, theme);
    }
  }, [theme]);

  const value = useMemo(() => {
    const isDark = theme === THEME_DARK;
    return {
      theme,
      isDark,
      isLight: theme === THEME_LIGHT,
      logoSlug: isDark ? 'siteLogo' : 'siteLogoDark',
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
