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
        return `${process.env.OBJECT_STORAGE_IMAGE_FALLBACK}`;
      }

      return `${config?.singleValue}`;
    },
    [getSiteConfig],
  );

  const themeStyles = React.useMemo(() => {
    const themeColor = getSiteConfigSingleValue('siteThemeColor');
    const themeRGB = themeColor.split(',').map((num) => noNaN(num));
    const toShort = themeRGB.length < 3;
    const finalThemeColor = toShort ? `219, 83, 96` : themeColor;

    const themeR = toShort ? '219' : themeRGB[0];
    const themeG = toShort ? '83' : themeRGB[1];
    const themeB = toShort ? '96' : themeRGB[2];

    return `--theme: rgb(${finalThemeColor}); --themeR: ${themeR}; --themeG: ${themeG}; --themeB: ${themeB};`;
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
