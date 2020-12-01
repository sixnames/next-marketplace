import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
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
}

type AppContextType = {
  state: ContextState;
  setState?: any;
};

type ModalProps<T> = {
  variant: string;
  props?: T;
};

const AppContext = createContext<AppContextType>({
  state: {
    isModal: {
      show: false,
      props: {},
      variant: '',
    },
    isMobile: false,
    isLoading: false,
  },
});

interface AppContextProviderInterface {
  isMobileDevice: boolean;
}

const AppContextProvider: React.FC<AppContextProviderInterface> = ({
  children,
  isMobileDevice,
}) => {
  const defaultModalState = useMemo(
    () => ({
      show: false,
      props: {},
      variant: '',
    }),
    [],
  );

  const [state, setState] = useState(() => ({
    isMobile: isMobileDevice,
    isModal: {
      ...defaultModalState,
    },
    isLoading: false,
  }));

  useEffect(() => {
    Router.events.on('routeChangeStart', () => {
      setState((prevState) => ({
        ...prevState,
        isModal: { ...defaultModalState },
      }));
    });
  }, [defaultModalState]);

  useEffect(() => {
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

  const value = useMemo(() => {
    return {
      state,
      setState,
    };
  }, [state]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

type ShowModalCallbackType = <T>(modalProps: ModalProps<T>) => void;

function useAppContext() {
  const context = useContext<AppContextType>(AppContext);

  if (!context) {
    throw new Error('useAppContext must be used within a AppContextProvider');
  }

  const hideModal = useCallback(() => {
    context.setState((prevState: ContextState) => ({
      ...prevState,
      isModal: {
        show: false,
        props: {},
        type: '',
      },
    }));
  }, [context]);

  const showModal = useCallback<ShowModalCallbackType>(
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

  const showLoading = useCallback(() => {
    context.setState((prevState: ContextState) => ({
      ...prevState,
      isLoading: true,
    }));
  }, [context]);

  const hideLoading = useCallback(() => {
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
