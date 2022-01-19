import { useRouter } from 'next/router';
import * as React from 'react';
import { get } from 'lodash';
import { CartModalInterface } from '../components/Modal/CartModal';
import { REQUEST_METHOD_POST, ROUTE_THANK_YOU } from '../config/common';
import { CART_MODAL } from '../config/modalVariants';
import { CheckGiftCertificateAvailabilityInputInterface } from '../db/dao/giftCertificate/checkGiftCertificateAvailability';
import { MakeAnOrderInputInterface, MakeAnOrderPayloadModel } from '../db/dao/orders/makeAnOrder';
import { CheckPromoCodeAvailabilityInputInterface } from '../db/dao/promo/checkPromoCodeAvailability';
import { CartProductsFieldNameType, GiftCertificateModel } from '../db/dbModels';
import {
  CartInterface,
  CompanyInterface,
  PromoCodeInterface,
  RubricInterface,
} from '../db/uiInterfaces';
import {
  AddProductToCartInput,
  AddShoplessProductToCartInput,
  AddShopToCartProductInput,
  DeleteProductFromCartInput,
  UpdateProductInCartInput,
  useAddProductToCartMutation,
  useAddShoplessProductToCartMutation,
  useAddShopToCartProductMutation,
  useClearCartMutation,
  useDeleteProductFromCartMutation,
  useRepeatAnOrderMutation,
  useUpdateProductInCartMutation,
} from '../generated/apolloComponents';
import { useMutation } from '../hooks/mutations/useFetch';
import { useCheckGiftCertificateMutation } from '../hooks/mutations/useGiftCertificateMutations';
import { useCheckPromoCode } from '../hooks/mutations/usePromoMutations';
import { noNaN } from '../lib/numbers';
import { useAppContext } from './appContext';
import { useNotificationsContext } from './notificationsContext';
import { useSiteUserContext } from './siteUserContext';

interface SiteContextStateInterface {
  loadingCart: boolean;
  cart?: CartInterface | null;
}

interface CheckGiftCertificateInputInterface
  extends Omit<CheckGiftCertificateAvailabilityInputInterface, 'userId'> {
  cartId: string;
  onError: () => void;
  onSuccess: (giftCertificate: GiftCertificateModel) => void;
}

interface CheckPromoCodeInputInterface
  extends Omit<CheckPromoCodeAvailabilityInputInterface, 'userId'> {
  cartId: string;
  onError: () => void;
  onSuccess: (promoCode: PromoCodeInterface) => void;
}

interface SiteContextInterface extends SiteContextStateInterface {
  navRubrics: RubricInterface[];
  addProductToCart: (input: AddProductToCartInput) => void;
  addShoplessProductToCart: (input: AddShoplessProductToCartInput) => void;
  addShopToCartProduct: (input: AddShopToCartProductInput) => void;
  updateProductInCart: (input: UpdateProductInCartInput) => void;
  deleteProductFromCart: (input: DeleteProductFromCartInput) => void;
  checkGiftCertificate: (input: CheckGiftCertificateInputInterface) => void;
  checkPromoCode: (input: CheckPromoCodeInputInterface) => void;
  getShopProductInCartCount: (shopProductId: string, allowDelivery: boolean) => number;
  makeAnOrder: (input: MakeAnOrderInputInterface) => void;
  repeatAnOrder: (_id: string) => void;
  clearCart: () => void;
  domainCompany?: CompanyInterface | null;
}

const SiteContext = React.createContext<SiteContextInterface>({
  navRubrics: [],
  loadingCart: true,
  cart: null,
  addProductToCart: () => undefined,
  addShoplessProductToCart: () => undefined,
  addShopToCartProduct: () => undefined,
  updateProductInCart: () => undefined,
  deleteProductFromCart: () => undefined,
  getShopProductInCartCount: () => 0,
  makeAnOrder: () => undefined,
  repeatAnOrder: () => undefined,
  clearCart: () => undefined,
  checkGiftCertificate: () => undefined,
  checkPromoCode: () => undefined,
});

interface SiteContextProviderInterface {
  navRubrics: RubricInterface[];
  sessionCity: string;
  domainCompany?: CompanyInterface | null;
}

const SiteContextProvider: React.FC<SiteContextProviderInterface> = ({
  children,
  navRubrics,
  domainCompany,
}) => {
  const sessionUser = useSiteUserContext();
  const router = useRouter();
  const { showModal, showLoading, hideLoading } = useAppContext();
  const { showErrorNotification, showSuccessNotification } = useNotificationsContext();
  const [state, setState] = React.useState<SiteContextStateInterface>({
    loadingCart: false,
    cart: null,
  });

  const refetchCartHandler = React.useCallback(
    (callback?: () => void) => {
      setState((prevState) => {
        return {
          ...prevState,
          loadingCart: true,
        };
      });
      fetch(`/api/cart/session-cart?${domainCompany ? `companyId=${domainCompany._id}` : ''}`)
        .then((res) => res.json())
        .then((data) => {
          setState((prevState) => {
            return {
              ...prevState,
              loadingCart: false,
              cart: data.sessionCart,
            };
          });
          hideLoading();
          if (callback) {
            callback();
          }
        })
        .catch((e) => {
          console.log(e);
          setState((prevState) => {
            return {
              ...prevState,
              loadingCart: false,
              cart: null,
            };
          });
        });
    },
    [domainCompany, hideLoading],
  );

  React.useEffect(() => {
    if (!state.cart && !state.loadingCart) {
      refetchCartHandler();
    }
  }, [refetchCartHandler, state]);

  const [addProductToCartMutation] = useAddProductToCartMutation({
    onCompleted: () => {
      refetchCartHandler(() => {
        showModal<CartModalInterface>({
          variant: CART_MODAL,
        });
      });
    },
  });

  const [addShoplessProductToCartMutation] = useAddShoplessProductToCartMutation({
    onCompleted: () => {
      refetchCartHandler(() => {
        showModal<CartModalInterface>({
          variant: CART_MODAL,
        });
      });
    },
  });

  const [addShopToCartProductMutation] = useAddShopToCartProductMutation({
    onCompleted: () => {
      refetchCartHandler();
    },
  });

  const [updateProductInCartMutation] = useUpdateProductInCartMutation({
    onCompleted: () => {
      refetchCartHandler();
    },
  });

  const [deleteProductFromCartMutation] = useDeleteProductFromCartMutation({
    onCompleted: () => {
      refetchCartHandler();
    },
  });

  const [clearCartMutation] = useClearCartMutation({
    onCompleted: ({ clearCart }) => {
      refetchCartHandler(() => {
        showSuccessNotification(clearCart);
      });
    },
  });

  const [makeAnOrderMutation] = useMutation<MakeAnOrderPayloadModel>({
    input: '/api/order/make',
    onSuccess: (payload) => {
      if (payload.success) {
        refetchCartHandler();
        router.push(ROUTE_THANK_YOU).catch(console.log);
        return;
      }
      hideLoading();
      showErrorNotification({ title: payload.message });
    },
  });

  const [repeatAnOrderMutation] = useRepeatAnOrderMutation({
    onCompleted: () => {
      refetchCartHandler(() => {
        showModal<CartModalInterface>({
          variant: CART_MODAL,
          props: {
            title: `Товары из заказа добавлены в корзину`,
          },
        });
      });
    },
  });

  // gift certificate
  const [checkGiftCertificateMutation] = useCheckGiftCertificateMutation();
  const checkGiftCertificate = React.useCallback(
    (input: CheckGiftCertificateInputInterface) => {
      checkGiftCertificateMutation({
        userId: sessionUser ? `${sessionUser.me._id}` : null,
        code: input.code,
        companyId: input.companyId,
        cartId: input.cartId,
      })
        .then((response) => {
          if (!response || !response.success || !response.payload) {
            input.onError();
            return;
          }
          input.onSuccess(response.payload);
          refetchCartHandler();
        })
        .catch(console.log);
    },
    [checkGiftCertificateMutation, refetchCartHandler, sessionUser],
  );

  // promo code
  const [checkPromoCodeMutation] = useCheckPromoCode();
  const checkPromoCode = React.useCallback(
    (input: CheckPromoCodeInputInterface) => {
      checkPromoCodeMutation({
        userId: sessionUser ? `${sessionUser.me._id}` : null,
        cartId: input.cartId,
        companyId: input.companyId,
        code: input.code,
        shopProductIds: input.shopProductIds,
      })
        .then((response) => {
          if (!response || !response.success || !response.payload) {
            input.onError();
            return;
          }
          input.onSuccess(response.payload.promoCode);
          refetchCartHandler();
        })
        .catch(console.log);
    },
    [checkPromoCodeMutation, refetchCartHandler, sessionUser],
  );

  const addProductToCart = React.useCallback(
    (input: AddProductToCartInput) => {
      addProductToCartMutation({
        variables: {
          input,
        },
      }).catch(() => {
        showErrorNotification();
      });
    },
    [addProductToCartMutation, showErrorNotification],
  );

  const addShoplessProductToCart = React.useCallback(
    (input: AddShoplessProductToCartInput) => {
      addShoplessProductToCartMutation({
        variables: {
          input,
        },
      }).catch(() => {
        showErrorNotification();
      });
    },
    [addShoplessProductToCartMutation, showErrorNotification],
  );

  const addShopToCartProduct = React.useCallback(
    (input: AddShopToCartProductInput) => {
      addShopToCartProductMutation({
        variables: {
          input,
        },
      }).catch(() => {
        showErrorNotification();
      });
    },
    [addShopToCartProductMutation, showErrorNotification],
  );

  const updateProductInCart = React.useCallback(
    (input: UpdateProductInCartInput) => {
      updateProductInCartMutation({
        variables: {
          input,
        },
      }).catch(() => {
        showErrorNotification();
      });
    },
    [showErrorNotification, updateProductInCartMutation],
  );

  const deleteProductFromCart = React.useCallback(
    (input: DeleteProductFromCartInput) => {
      deleteProductFromCartMutation({
        variables: {
          input,
        },
      }).catch(() => {
        showErrorNotification();
      });
    },
    [deleteProductFromCartMutation, showErrorNotification],
  );

  const clearCart = React.useCallback(() => {
    clearCartMutation().catch(() => {
      showErrorNotification();
    });
  }, [clearCartMutation, showErrorNotification]);

  const makeAnOrder = React.useCallback(
    (input: MakeAnOrderInputInterface) => {
      showLoading();
      makeAnOrderMutation({
        method: REQUEST_METHOD_POST,
        body: JSON.stringify(input),
      }).catch(() => {
        hideLoading();
        showErrorNotification();
      });
    },
    [hideLoading, makeAnOrderMutation, showErrorNotification, showLoading],
  );

  const repeatAnOrder = React.useCallback(
    (_id: string) => {
      repeatAnOrderMutation({
        variables: {
          input: {
            orderId: _id,
          },
        },
      }).catch(() => {
        hideLoading();
        showErrorNotification();
      });
    },
    [hideLoading, repeatAnOrderMutation, showErrorNotification],
  );

  const getShopProductInCartCount = React.useCallback(
    (shopProductId: string, allowDelivery: boolean) => {
      const cartProductsFieldName: CartProductsFieldNameType = allowDelivery
        ? 'cartDeliveryProducts'
        : 'cartBookingProducts';
      const cartProducts = get(state.cart, cartProductsFieldName);
      const currentProduct = (cartProducts || []).find((cartProduct) => {
        return `${cartProduct.shopProductId}` === shopProductId;
      });
      if (!currentProduct) {
        return 0;
      }
      return noNaN(currentProduct?.amount);
    },
    [state.cart],
  );

  const initialValue = React.useMemo(() => {
    return {
      navRubrics,
      addProductToCart,
      addShoplessProductToCart,
      addShopToCartProduct,
      updateProductInCart,
      deleteProductFromCart,
      clearCart,
      makeAnOrder,
      repeatAnOrder,
      getShopProductInCartCount,
      checkGiftCertificate,
      checkPromoCode,
      domainCompany,
      ...state,
    };
  }, [
    navRubrics,
    addProductToCart,
    addShoplessProductToCart,
    addShopToCartProduct,
    updateProductInCart,
    deleteProductFromCart,
    clearCart,
    makeAnOrder,
    repeatAnOrder,
    getShopProductInCartCount,
    checkGiftCertificate,
    checkPromoCode,
    domainCompany,
    state,
  ]);

  return <SiteContext.Provider value={initialValue}>{children}</SiteContext.Provider>;
};

function useSiteContext() {
  const context = React.useContext<SiteContextInterface>(SiteContext);
  if (!context) {
    throw new Error('useSiteContext must be used within a SiteContextProvider');
  }

  return context;
}

export { SiteContextProvider, useSiteContext };
