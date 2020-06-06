import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

type AppContext = {
  state: ContextState;
  setState?: any;
};

type ModalProps<T> = {
  type: string;
  props?: T;
};

interface ContextState {
  isModal: {
    show: boolean;
    props: any;
    type: string;
  };
  isCartDropdown: boolean;
  isLoading: boolean;
}

const AppContext = createContext<AppContext>({
  state: {
    isModal: {
      show: false,
      props: {},
      type: '',
    },
    isCartDropdown: false,
    isLoading: false,
  },
});

const AppContextProvider: React.FC = ({ children }) => {
  const defaultModalState = useMemo(
    () => ({
      show: false,
      props: {},
      type: '',
    }),
    [],
  );

  const [state, setState] = useState({
    isCartDropdown: false,
    isModal: {
      ...defaultModalState,
    },
    isLoading: false,
  });

  useEffect(() => {
    /*Router.events.on('routeChangeStart', () => {
      setState((prevState) => ({
        ...prevState,
        isModal: { ...defaultModalState },
      }));
    });*/
  }, [defaultModalState]);

  const value = useMemo(() => {
    return {
      state,
      setState,
    };
  }, [state]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

function useAppContext() {
  const context: AppContext = useContext(AppContext);

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

  function showCartDropdown() {
    setState((prevState: ContextState) => ({
      ...prevState,
      isCartDropdown: true,
    }));
  }

  function hideCartDropdown() {
    setState((prevState: ContextState) => ({
      ...prevState,
      isCartDropdown: false,
    }));
  }

  /*function setCart(cart) {
    setState((prevState: ContextState) => ({
      ...prevState,
      cart: cart,
    }));
  }

  function resetCart() {
    setState((prevState: ContextState) => ({
      ...prevState,
      cart: {
        id: null,
        products: [],
      },
    }));
  }*/

  return {
    ...state,
    showModal,
    hideModal,
    showLoading,
    hideLoading,
    showCartDropdown,
    hideCartDropdown,
    // setCart,
    // resetCart,
  };
}

export { AppContextProvider, useAppContext };
