import { ADULT_FALSE, ADULT_KEY, DEFAULT_CITY } from 'config/common';
import { ADULT_MODAL } from 'config/modals';
import * as React from 'react';
import Router from 'next/router';
import { debounce } from 'lodash';

interface ContextState {
  isModal: {
    show: boolean;
    props: any;
    variant: string;
  };
  isMobile: boolean;
  isLoading: boolean;
  sessionCity: string;
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
  },
});

interface AppContextProviderInterface {
  isMobileDevice: boolean;
  sessionCity: string;
}

const AppContextProvider: React.FC<AppContextProviderInterface> = ({
  children,
  isMobileDevice,
  sessionCity,
}) => {
  const [state, setState] = React.useState<ContextState>(() => ({
    isMobile: isMobileDevice,
    isModal: defaultModalState,
    isLoading: false,
    sessionCity: sessionCity || DEFAULT_CITY,
  }));

  React.useEffect(() => {
    const inStorage = window.localStorage.getItem(ADULT_KEY);
    if (!inStorage || inStorage === ADULT_FALSE) {
      setState((prevState: ContextState) => ({
        ...prevState,
        isModal: {
          show: true,
          props: {},
          variant: ADULT_MODAL,
        },
      }));
    }
  }, []);

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
          isMobile: window.matchMedia(`(max-width: ${1024}px)`).matches,
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
