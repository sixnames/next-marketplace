import * as React from 'react';
import Cookies from 'js-cookie';
import { debounce } from 'lodash';
import { useConfigContext } from './configContext';
import { THEME_COOKIE_KEY, THEME_DARK, THEME_LIGHT } from 'config/common';
import { Theme } from 'types/clientTypes';

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

const ThemeContext = React.createContext<ThemeContextInterface>({
  theme: THEME_LIGHT,
  isDark: false,
  isLight: true,
  logoSlug: 'siteLogo',
});

const ThemeContextProvider: React.FC<ThemeContextProviderInterface> = ({
  children,
  initialTheme,
}) => {
  const [vh, setVh] = React.useState(() =>
    typeof window !== 'undefined' ? window.innerHeight * 0.01 : 0,
  );
  const [theme, setTheme] = React.useState(() => initialTheme);
  const ref = React.useRef<HTMLDivElement>(null);
  const { themeStyles } = useConfigContext();

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
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)')
      ? THEME_DARK
      : THEME_LIGHT;
    const realTheme = theme === 'undefined' ? systemTheme : theme;
    if (theme !== realTheme) {
      setTheme(realTheme);
    }

    const themeStyle = `
      --vh: ${vh}px;
      --fullHeight: calc(${vh}px * 100);
      ${themeStyles}
      `;

    if (ref && ref.current) {
      ref.current.setAttribute('data-theme', realTheme);
      ref.current.setAttribute('style', themeStyle);
    }

    const pageHtml = document.querySelector('html');
    if (pageHtml) {
      pageHtml.setAttribute('data-theme', realTheme);
      pageHtml.setAttribute('style', themeStyle);
    }
  }, [vh, ref, theme, themeStyles]);

  React.useEffect(() => {
    // set theme to cookie
    const themeInCookies = Cookies.get(THEME_COOKIE_KEY);
    if (themeInCookies !== theme) {
      Cookies.set(THEME_COOKIE_KEY, theme);
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

  return (
    <ThemeContext.Provider value={value}>
      <div ref={ref}>{children}</div>
    </ThemeContext.Provider>
  );
};

const useThemeContext = (): ThemeContextInterface => {
  const context = React.useContext(ThemeContext);

  if (!context) {
    throw new Error('useThemeContext must be used within a ThemeContextProvider');
  }

  return context;
};

export { ThemeContextProvider, useThemeContext };
