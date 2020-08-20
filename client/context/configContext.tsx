import { InitialQuery } from '../generated/apolloComponents';
import React, { createContext, useContext, useMemo } from 'react';

interface ConfigContextInterface {
  configs: InitialQuery['getAllConfigs'];
}

const ConfigContext = createContext<ConfigContextInterface>({
  configs: [],
});

const ConfigContextProvider: React.FC<ConfigContextInterface> = ({ configs, children }) => {
  const initialValue = useMemo(() => {
    return {
      configs,
    };
  }, [configs]);

  return <ConfigContext.Provider value={initialValue}>{children}</ConfigContext.Provider>;
};

function useConfigContext() {
  const context = useContext(ConfigContext) || {
    configs: [],
  };

  if (!context) {
    throw new Error('useConfigContext must be used within a ConfigContextProvider');
  }

  const { configs } = context;

  function getSiteConfig(configSlug: string) {
    return configs.find(({ slug }) => configSlug === slug);
  }

  function getSiteConfigValue(configSlug: string) {
    const config = getSiteConfig(configSlug);
    return config ? config.value : [''];
  }

  function getSiteConfigSingleValue(configSlug: string) {
    return getSiteConfigValue(configSlug)[0];
  }

  return {
    ...context,
    getSiteConfig,
    getSiteConfigValue,
    getSiteConfigSingleValue,
  };
}

export { ConfigContextProvider, useConfigContext };
