import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { IS_BROWSER, THEME_DARK, THEME_KEY, THEME_LIGHT, THEME_NOT_ALL } from '../config';
import { Theme } from '../types';
import useLocalStorage from '../hooks/useLocalStorage';
import { IconType } from '../components/Icon/Icon';

interface ThemeContextInterface {
  theme: Theme;
  isDark: boolean;
  isLight: boolean;
  toggleTheme?: () => void;
  themeTooltip: string;
  themeIcon: IconType;
  logoSlug: string;
}

const ThemeContext = createContext<ThemeContextInterface>({
  theme: THEME_LIGHT,
  isDark: false,
  isLight: true,
  themeTooltip: '',
  themeIcon: 'Brightness4',
  logoSlug: 'siteLogo',
});

const ThemeContextProvider: React.FC = ({ children }) => {
  const [vh, setVh] = useState(() => (IS_BROWSER ? window.innerHeight * 0.01 : 0));
  const [logoSlug, setLogoSlug] = useState('siteLogo');
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
    function resizeHandler() {
      setVh(window.innerHeight * 0.01);
    }
    window.addEventListener('resize', resizeHandler);

    return () => {
      window.removeEventListener('resize', resizeHandler);
    };
  }, []);

  useEffect(() => {
    if (ref && ref.current) {
      ref.current.setAttribute('data-theme', theme);

      setLogoSlug(() => {
        const isDark = theme === THEME_DARK;
        return isDark ? 'siteLogo' : 'siteLogoDark';
      });
    }
  }, [ref, theme]);

  const value = useMemo(() => {
    const isDark = theme === THEME_DARK;
    const themeTooltip = isDark ? 'Светлая тема' : 'Тёмная тема';
    const themeIcon: IconType = isDark ? 'Brightness7' : 'Brightness4';

    return {
      theme,
      isDark,
      themeTooltip,
      themeIcon,
      logoSlug,
      isLight: theme === THEME_LIGHT,
      toggleTheme: () => {
        if (theme === THEME_DARK) {
          setTheme(THEME_LIGHT);
        } else {
          setTheme(THEME_DARK);
        }
      },
    };
  }, [theme, logoSlug, setTheme]);

  return (
    <ThemeContext.Provider value={value}>
      <div ref={ref}>{children}</div>
      <style jsx global>{`
        :root {
          --vh: ${vh}px;
          --fullHeight: calc(${vh}px * 100);
        }
      `}</style>
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
