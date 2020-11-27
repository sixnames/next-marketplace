import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import Router from 'next/router';
import { debounce } from 'lodash';

interface ContextState {
  isModal: {
    show: boolean;
    props: any;
    type: string;
  };
  isMobile: boolean;
  isCartDropdown: boolean;
  isLoading: boolean;
}

type AppContextType = {
  state: ContextState;
  setState?: any;
};

type ModalProps<T> = {
  type: string;
  props?: T;
};

const AppContext = createContext<AppContextType>({
  state: {
    isModal: {
      show: false,
      props: {},
      type: '',
    },
    isMobile: false,
    isCartDropdown: false,
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
      type: '',
    }),
    [],
  );

  const [state, setState] = useState(() => ({
    isCartDropdown: false,
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

function useAppContext() {
  const context = useContext<AppContextType>(AppContext);

  if (!context) {
    throw new Error('useAppContext must be used within a AppContextProvider');
  }

  const { state, setState } = context;

  function hideModal() {
    setState((prevState: ContextState) => ({
      ...prevState,
      isModal: {
        show: false,
        props: {},
        type: '',
      },
    }));
  }

  function showModal<T>({ type, props }: ModalProps<T>) {
    hideModal();
    setState((prevState: ContextState) => ({
      ...prevState,
      isModal: {
        show: true,
        props,
        type,
      },
    }));
  }

  function showLoading() {
    setState((prevState: ContextState) => ({
      ...prevState,
      isLoading: true,
    }));
  }

  function hideLoading() {
    setState((prevState: ContextState) => ({
      ...prevState,
      isLoading: false,
    }));
  }

  return {
    ...state,
    showModal,
    hideModal,
    showLoading,
    hideLoading,
  };
}

export { AppContextProvider, useAppContext };
