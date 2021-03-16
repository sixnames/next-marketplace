import { CityModel, ConfigModel } from 'db/dbModels';
import * as React from 'react';
import { noNaN } from 'lib/numbers';

interface ConfigContextInterface {
  configs: ConfigModel[];
  cities: CityModel[];
}

const ConfigContext = React.createContext<ConfigContextInterface>({
  configs: [],
  cities: [],
});

const ConfigContextProvider: React.FC<ConfigContextInterface> = ({
  configs = [],
  cities = [],
  children,
}) => {
  const initialValue = React.useMemo(() => {
    return {
      configs,
      cities,
    };
  }, [configs, cities]);

  return <ConfigContext.Provider value={initialValue}>{children}</ConfigContext.Provider>;
};

function useConfigContext() {
  const context = React.useContext(ConfigContext);

  if (!context) {
    throw new Error('useConfigContext must be used within a ConfigContextProvider');
  }

  const getSiteConfig = React.useCallback(
    (configSlug: string) => {
      return context.configs.find(({ slug }) => configSlug === slug);
    },
    [context.configs],
  );

  const getSiteConfigValue = React.useCallback(
    (configSlug: string) => {
      const config = getSiteConfig(configSlug);
      return config ? config.value : [''];
    },
    [getSiteConfig],
  );

  const getSiteConfigSingleValue = React.useCallback(
    (configSlug: string) => {
      const config = getSiteConfig(configSlug);
      if (!config) {
        return `${process.env.NEXT_AWS_IMAGE_FALLBACK}`;
      }

      return `${config?.singleValue}`;
    },
    [getSiteConfig],
  );

  const themeStyles = React.useMemo(() => {
    const themeColor = getSiteConfigSingleValue('siteThemeColor');
    const themeRGB = themeColor.split(',').map((num) => noNaN(num));
    const themeR = themeRGB[0] || '219';
    const themeG = themeRGB[1] || '83';
    const themeB = themeRGB[2] || '96';
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
