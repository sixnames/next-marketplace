import * as React from 'react';
import Router from 'next/router';
import { debounce } from 'lodash';
import { ADULT_FALSE, ADULT_KEY, DEFAULT_CITY, DEFAULT_COMPANY_SLUG } from '../config/common';
import { ADULT_MODAL } from '../config/modalVariants';
import { IpInfoInterface } from '../types/clientTypes';
import { useConfigContext } from './configContext';

interface ContextState {
  isModal: {
    show: boolean;
    props: any;
    variant: string;
  };
  isMobile: boolean;
  isLoading: boolean;
  sessionCity: string;
  companySlug: string;
  ipInfo?: IpInfoInterface | null;
}

type AppContextType = {
  state: ContextState;
  setState?: any;
};

type ModalProps<T> = {
  variant: string;
  props?: T;
};

const defaultModalState = {
  show: false,
  props: {},
  variant: '',
};

const AppContext = React.createContext<AppContextType>({
  state: {
    isModal: defaultModalState,
    isMobile: false,
    isLoading: false,
    sessionCity: DEFAULT_CITY,
    companySlug: DEFAULT_COMPANY_SLUG,
  },
});

interface AppContextProviderInterface {
  isMobileDevice: boolean;
  sessionCity: string;
  companySlug: string;
}

const AppContextProvider: React.FC<AppContextProviderInterface> = ({
  children,
  isMobileDevice,
  sessionCity,
  companySlug,
}) => {
  const { configs } = useConfigContext();
  const [state, setState] = React.useState<ContextState>(() => ({
    isMobile: isMobileDevice,
    isModal: defaultModalState,
    isLoading: false,
    sessionCity: sessionCity || DEFAULT_CITY,
    companySlug: companySlug || DEFAULT_COMPANY_SLUG,
  }));

  React.useEffect(() => {
    const ipRegistryApiKey =
      process.env.NODE_ENV === 'development' ? process.env.IP_REGISTRY : configs.ipRegistryApiKey;
    if (!state.ipInfo && ipRegistryApiKey) {
      fetch(`https://api.ipregistry.co/?key=${ipRegistryApiKey}`)
        .then<IpInfoInterface>((response) => response.json())
        .then((ipInfo) => {
          setState((prevState) => {
            return {
              ...prevState,
              ipInfo,
            };
          });
        });
    }
  }, [state.ipInfo]);

  React.useEffect(() => {
    const inStorage = window.localStorage.getItem(ADULT_KEY);
    if ((!inStorage || inStorage === ADULT_FALSE) && configs.showAdultModal) {
      setState((prevState: ContextState) => ({
        ...prevState,
        isModal: {
          show: true,
          props: {},
          variant: ADULT_MODAL,
        },
      }));
    }
  }, [configs]);

  React.useEffect(() => {
    Router.events.on('routeChangeStart', () => {
      setState((prevState) => ({
        ...prevState,
        isModal: { ...defaultModalState },
      }));
    });
  }, []);

  React.useEffect(() => {
    function resizeHandler() {
      setState((prevState) => {
        return {
          ...prevState,
          isMobile: window.matchMedia(`(max-width: ${1023}px)`).matches,
        };
      });
    }

    const debouncedResizeHandler = debounce(resizeHandler, 250);
    resizeHandler();

    window.addEventListener('resize', debouncedResizeHandler);

    return () => {
      window.removeEventListener('resize', debouncedResizeHandler);
    };
  }, []);

  const value = React.useMemo(() => {
    return {
      state,
      setState,
    };
  }, [state]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

type ShowModalCallbackType = <T>(modalProps: ModalProps<T>) => void;

function useAppContext() {
  const context = React.useContext<AppContextType>(AppContext);

  if (!context) {
    throw new Error('useAppContext must be used within a AppContextProvider');
  }

  const hideModal = React.useCallback(() => {
    context.setState((prevState: ContextState) => ({
      ...prevState,
      isModal: {
        show: false,
        props: {},
        type: '',
      },
    }));
  }, [context]);

  const showModal = React.useCallback<ShowModalCallbackType>(
    ({ variant, props }) => {
      hideModal();
      context.setState((prevState: ContextState) => ({
        ...prevState,
        isModal: {
          show: true,
          props,
          variant: variant,
        },
      }));
    },
    [context, hideModal],
  );

  const showLoading = React.useCallback(() => {
    context.setState((prevState: ContextState) => ({
      ...prevState,
      isLoading: true,
    }));
  }, [context]);

  const hideLoading = React.useCallback(() => {
    context.setState((prevState: ContextState) => ({
      ...prevState,
      isLoading: false,
    }));
  }, [context]);

  return {
    ...context.state,
    showModal,
    hideModal,
    showLoading,
    hideLoading,
  };
}

export { AppContextProvider, useAppContext };
