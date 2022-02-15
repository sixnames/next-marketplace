import { useRouter } from 'next/router';
import * as React from 'react';
import { get } from 'lodash';
import { CartModalInterface } from 'components/Modal/CartModal';
import { CART_MODAL } from 'lib/config/modalVariants';
import { AddCartProductInputInterface } from 'db/dao/cart/addCartProduct';
import { DeleteCartProductInputInterface } from 'db/dao/cart/deleteCartProduct';
import { UpdateCartProductInputInterface } from 'db/dao/cart/updateCartProduct';
import { CheckGiftCertificateAvailabilityInputInterface } from 'db/dao/giftCertificate/checkGiftCertificateAvailability';
import { MakeAnOrderInputInterface } from 'db/dao/orders/makeAnOrder';
import { CheckPromoCodeAvailabilityInputInterface } from 'db/dao/promo/checkPromoCodeAvailability';
import { SessionLogMakeAnOrderProductEventInputModel } from 'db/dao/sessionLogs/setSessionLog';
import { CartProductsFieldNameType, GiftCertificateModel } from 'db/dbModels';
import {
  CartInterface,
  CompanyInterface,
  PromoCodeInterface,
  RubricInterface,
} from 'db/uiInterfaces';
import {
  cartApiRouteBasePath,
  useAddCartProduct,
  useDeleteCartProduct,
  useMakeAnOrder,
  useRepeatOrder,
  useUpdateCartProduct,
} from 'hooks/mutations/useCartMutations';
import { useCheckGiftCertificateMutation } from 'hooks/mutations/useGiftCertificateMutations';
import { useCheckPromoCode } from 'hooks/mutations/usePromoMutations';
import { useSetSessionLogHandler } from 'hooks/mutations/useSessionLogMutations';
import { noNaN } from 'lib/numbers';
import { useAppContext } from 'components/context/appContext';
import { useNotificationsContext } from 'components/context/notificationsContext';
import { useSiteUserContext } from 'components/context/siteUserContext';

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

export interface SiteContextInterface extends SiteContextStateInterface {
  navRubrics: RubricInterface[];
  addCartProduct: (input: AddCartProductInputInterface) => void;
  updateCartProduct: (input: UpdateCartProductInputInterface) => void;
  deleteCartProduct: (input: DeleteCartProductInputInterface) => void;
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
  addCartProduct: () => undefined,
  updateCartProduct: () => undefined,
  deleteCartProduct: () => undefined,
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
  const logHandler = useSetSessionLogHandler();
  const { showModal, showLoading, hideLoading } = useAppContext();
  const { showSuccessNotification } = useNotificationsContext();
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
      fetch(
        `${cartApiRouteBasePath}/session-cart?${
          domainCompany ? `companyId=${domainCompany._id}` : ''
        }`,
      )
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
          if (callback && typeof callback === 'function') {
            callback();
          }
        })
        .catch((e) => {
          console.log('refetchCartHandler', e);
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

  const [addCartProductMutation] = useAddCartProduct(() => {
    refetchCartHandler(() => {
      showModal<CartModalInterface>({
        variant: CART_MODAL,
      });
    });
  });

  const [updateProductInCartMutation] = useUpdateCartProduct(() => {
    refetchCartHandler();
  });
  const [deleteCartProductMutation] = useDeleteCartProduct((payload) => {
    refetchCartHandler(() => {
      showSuccessNotification(payload);
    });
  });

  const [makeAnOrderMutation] = useMakeAnOrder(() => {
    refetchCartHandler();
  });

  const [repeatAnOrderMutation] = useRepeatOrder(() => {
    refetchCartHandler(() => {
      showModal<CartModalInterface>({
        variant: CART_MODAL,
        props: {
          title: `Товары из заказа добавлены в корзину`,
        },
      });
    });
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

  const addCartProduct = React.useCallback(
    (input: AddCartProductInputInterface) => {
      addCartProductMutation(input).catch(console.log);
    },
    [addCartProductMutation],
  );

  const updateCartProduct = React.useCallback(
    (input: UpdateCartProductInputInterface) => {
      updateProductInCartMutation(input).catch(console.log);
    },
    [updateProductInCartMutation],
  );

  const deleteCartProduct = React.useCallback(
    (input: DeleteCartProductInputInterface) => {
      deleteCartProductMutation(input).catch(console.log);
    },
    [deleteCartProductMutation],
  );

  const clearCart = React.useCallback(() => {
    deleteCartProductMutation({ deleteAll: true }).catch(console.log);
  }, [deleteCartProductMutation]);

  const makeAnOrder = React.useCallback(
    (input: MakeAnOrderInputInterface) => {
      showLoading();

      // create log
      if (state.cart) {
        const orderProducts: SessionLogMakeAnOrderProductEventInputModel[] = [];
        [...state.cart.cartDeliveryProducts, ...state.cart.cartBookingProducts].forEach(
          (cartProduct) => {
            const orderProduct: SessionLogMakeAnOrderProductEventInputModel = {
              shopProductId: `${cartProduct.shopProductId}`,
              shopId: `${cartProduct.shopProduct?.shopId}`,
              summaryId: `${cartProduct.shopProduct?.productId}`,
              amount: cartProduct.amount,
            };
            orderProducts.push(orderProduct);
          },
        );

        logHandler({
          event: {
            variant: 'makeAnOrderClick',
            asPath: router.asPath,
            orderProducts,
          },
        });
      }

      // make and order
      makeAnOrderMutation(input).catch(console.log);
    },
    [logHandler, makeAnOrderMutation, router.asPath, showLoading, state.cart],
  );

  const repeatAnOrder = React.useCallback(
    (_id: string) => {
      repeatAnOrderMutation({
        orderId: _id,
      }).catch(console.log);
    },
    [repeatAnOrderMutation],
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
      addCartProduct,
      updateCartProduct,
      deleteCartProduct,
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
    addCartProduct,
    updateCartProduct,
    deleteCartProduct,
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
