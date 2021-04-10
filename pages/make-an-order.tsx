import Breadcrumbs from 'components/Breadcrumbs/Breadcrumbs';
import Button from 'components/Buttons/Button';
import Currency from 'components/Currency/Currency';
import FormikInput from 'components/FormElements/Input/FormikInput';
import FormikTextarea from 'components/FormElements/Textarea/FormikTextarea';
import Icon from 'components/Icon/Icon';
import Inner from 'components/Inner/Inner';
import ProductShopPrices from 'components/Product/ProductShopPrices/ProductShopPrices';
import RequestError from 'components/RequestError/RequestError';
import Spinner from 'components/Spinner/Spinner';
import Title from 'components/Title/Title';
import { ROUTE_CATALOGUE } from 'config/common';
import { useNotificationsContext } from 'context/notificationsContext';
import { useUserContext } from 'context/userContext';
import { Form, Formik } from 'formik';
import { CartProductFragment } from 'generated/apolloComponents';
import useCart from 'hooks/useCart';
import useCartMutations from 'hooks/useCartMutations';
import useValidationSchema from 'hooks/useValidationSchema';
import { phoneToRaw } from 'lib/phoneUtils';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { PagePropsInterface } from 'pages/_app';
import * as React from 'react';
import { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from 'next';
import SiteLayout, { SiteLayoutInterface } from 'layout/SiteLayout/SiteLayout';
import { getSiteInitialData } from 'lib/ssrUtils';
import CartAside from 'routes/CartRoute/CartAside';
import classes from 'styles/MakeAnOrderRoute.module.css';
import { makeAnOrderSchema } from 'validation/orderSchema';

interface OrderRouteProductInterface {
  cartProduct: CartProductFragment;
}

const OrderRouteProduct: React.FC<OrderRouteProductInterface> = ({ cartProduct }) => {
  const { shopProduct, amount, formattedTotalPrice } = cartProduct;
  if (!shopProduct) {
    return null;
  }

  const {
    product: { mainImage, name, itemId },
    shop,
    formattedOldPrice,
    discountedPercent,
    formattedPrice,
  } = shopProduct;

  return (
    <div className={classes.productHolder}>
      <div data-cy={'order-product'} className={classes.product}>
        <div className={classes.productMainGrid}>
          <div className={classes.productImage}>
            <div className={classes.productImageHolder}>
              <Image src={mainImage} alt={name} title={name} layout='fill' objectFit='contain' />
            </div>
          </div>
          <div>
            <div className={classes.productArt}>{`Артикул: ${itemId}`}</div>
            <div className={classes.productContent}>
              <div>
                <div className={classes.productName}>{name}</div>
              </div>

              <div>
                <div className={classes.productTotals}>
                  <ProductShopPrices
                    className={classes.productTotalsPrice}
                    formattedPrice={formattedPrice}
                    formattedOldPrice={formattedOldPrice}
                    discountedPercent={discountedPercent}
                    size={'small'}
                  />
                  <Icon name={'cross'} className={classes.productTotalsIcon} />
                  <div className={classes.productTotalsAmount}>{amount}</div>
                </div>
                <div className={classes.productTotalPrice}>
                  Итого <Currency value={formattedTotalPrice} />
                </div>
              </div>

              <div>
                <div className={classes.shop}>
                  <div>
                    <span>винотека: </span>
                    {shop.name}
                  </div>
                  <div>{shop.address.formattedAddress}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const MakeAnOrderRoute: React.FC = () => {
  const router = useRouter();
  const { showErrorNotification } = useNotificationsContext();
  const { loadingCart, cart } = useCart();
  const { makeAnOrder } = useCartMutations();
  const { me } = useUserContext();
  const validationSchema = useValidationSchema({
    schema: makeAnOrderSchema,
  });

  if (loadingCart && !cart) {
    return (
      <div className={classes.cart}>
        <Breadcrumbs currentPageName={'Корзина'} />

        <Inner lowTop testId={'cart'}>
          <Spinner isNested />
        </Inner>
      </div>
    );
  }

  if (!cart) {
    return (
      <div className={classes.cart}>
        <Breadcrumbs currentPageName={'Корзина'} />

        <Inner lowTop testId={'cart'}>
          <RequestError />
        </Inner>
      </div>
    );
  }

  const { productsCount, cartProducts } = cart;

  if (cartProducts.length < 1) {
    return (
      <div className={classes.cart}>
        <Breadcrumbs currentPageName={'Корзина'} />

        <Inner lowTop testId={'cart'}>
          <Title className={classes.cartTitle}>Корзина пуста</Title>
          <div className={classes.emptyBtns}>
            <Button
              className={classes.emptyBtnsItem}
              theme={'secondary'}
              onClick={() => {
                router.push(`/`).catch(() => {
                  showErrorNotification();
                });
              }}
            >
              на главную
            </Button>
            <Button
              className={classes.emptyBtnsItem}
              theme={'secondary'}
              onClick={() => {
                router.push(`${ROUTE_CATALOGUE}/vino`).catch(() => {
                  showErrorNotification();
                });
              }}
            >
              каталог вин
            </Button>
          </div>
        </Inner>
      </div>
    );
  }

  return (
    <div className={classes.cart} data-cy={'order-form'}>
      <Breadcrumbs currentPageName={'Корзина'} />

      <Inner lowTop testId={'cart'}>
        <Title className={classes.cartTitle}>
          Корзина
          <span>{`(${productsCount})`}</span>
        </Title>
        <Formik
          enableReinitialize={true}
          validationSchema={validationSchema}
          initialValues={{
            name: me ? me.name : '',
            email: me ? me.email : '',
            phone: me ? me.phone : '',
            comment: '',
          }}
          onSubmit={(values) => {
            makeAnOrder({
              ...values,
              phone: phoneToRaw(values.phone),
            });
          }}
        >
          {() => {
            return (
              <Form>
                <div className={classes.order}>
                  <div data-cy={'order-products'}>
                    <div className={classes.form}>
                      <div className={classes.group}>
                        <div className={classes.groupTitle}>
                          <div className={classes.groupTitleCounter}>1</div>
                          Личные данные
                        </div>

                        <FormikInput
                          testId={'order-form-name'}
                          name={'name'}
                          label={'Имя'}
                          isRequired
                        />
                        <FormikInput
                          testId={'order-form-phone'}
                          name={'phone'}
                          type={'tel'}
                          label={'Телефон'}
                          isRequired
                        />
                        <FormikInput
                          testId={'order-form-email'}
                          name={'email'}
                          type={'email'}
                          label={'E-mail'}
                          isRequired
                        />
                      </div>

                      <div className={classes.group}>
                        <div className={classes.groupTitle}>
                          <div className={classes.groupTitleCounter}>2</div>
                          Подтверждение заказа
                        </div>

                        <div className={classes.products} data-cy={'order-products'}>
                          {cartProducts.map((cartProduct) => {
                            return (
                              <OrderRouteProduct cartProduct={cartProduct} key={cartProduct._id} />
                            );
                          })}
                        </div>

                        <FormikTextarea
                          label={'Ваш комментарий к заказу'}
                          testId={'order-form-comment'}
                          name={'comment'}
                        />
                      </div>
                    </div>
                  </div>

                  <div className={classes.aside}>
                    <CartAside
                      cart={cart}
                      buttonText={'подтвердить заказ'}
                      backLinkHref={`/cart`}
                      buttonType={'submit'}
                    />
                  </div>
                </div>
              </Form>
            );
          }}
        </Formik>
      </Inner>
    </div>
  );
};

interface MakeAnOrderInterface extends PagePropsInterface, SiteLayoutInterface {}

const MakeAnOrder: NextPage<MakeAnOrderInterface> = ({ navRubrics, pageUrls }) => {
  return (
    <SiteLayout title={'Корзина'} navRubrics={navRubrics} pageUrls={pageUrls}>
      <MakeAnOrderRoute />
    </SiteLayout>
  );
};

export async function getServerSideProps(
  context: GetServerSidePropsContext,
): Promise<GetServerSidePropsResult<MakeAnOrderInterface>> {
  const { props } = await getSiteInitialData({
    context,
  });

  return {
    props,
  };
}

export default MakeAnOrder;
