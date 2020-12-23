import { InitialQuery } from '../generated/apolloComponents';
import React, { createContext, useCallback, useContext, useMemo } from 'react';
import { noNaN } from '../utils/numbers';

interface ConfigContextInterface {
  configs: InitialQuery['getAllConfigs'];
  cities: InitialQuery['getAllCities'];
}

const ConfigContext = createContext<ConfigContextInterface>({
  configs: [],
  cities: [],
});

const ConfigContextProvider: React.FC<ConfigContextInterface> = ({
  configs = [],
  cities = [],
  children,
}) => {
  const initialValue = useMemo(() => {
    return {
      configs,
      cities,
    };
  }, [configs, cities]);

  return <ConfigContext.Provider value={initialValue}>{children}</ConfigContext.Provider>;
};

function useConfigContext() {
  const context = useContext(ConfigContext);

  if (!context) {
    throw new Error('useConfigContext must be used within a ConfigContextProvider');
  }

  const getSiteConfig = useCallback(
    (configSlug: string) => {
      return context.configs.find(({ slug }) => configSlug === slug);
    },
    [context.configs],
  );

  const getSiteConfigValue = useCallback(
    (configSlug: string) => {
      const config = getSiteConfig(configSlug);
      return config ? config.value : [''];
    },
    [getSiteConfig],
  );

  const getSiteConfigSingleValue = useCallback(
    (configSlug: string) => {
      return getSiteConfigValue(configSlug)[0];
    },
    [getSiteConfigValue],
  );

  const themeStyles = useMemo(() => {
    const themeColor = getSiteConfigSingleValue('siteThemeColor');
    const themeRGB = themeColor.split(',').map((num) => noNaN(num));
    const themeR = themeRGB[0];
    const themeG = themeRGB[1];
    const themeB = themeRGB[2];
    return `--theme: rgb(${themeColor}); --themeR: ${themeR}; --themeG: ${themeG}; --themeB: ${themeB};`;
  }, [getSiteConfigSingleValue]);

  return {
    ...context,
    getSiteConfig,
    getSiteConfigValue,
    getSiteConfigSingleValue,
    themeStyles,
  };
}

export { ConfigContextProvider, useConfigContext };
