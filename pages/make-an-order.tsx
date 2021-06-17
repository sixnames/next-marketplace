import Breadcrumbs from 'components/Breadcrumbs/Breadcrumbs';
import Button from 'components/Buttons/Button';
import Currency from 'components/Currency/Currency';
import FormikInput from 'components/FormElements/Input/FormikInput';
import FormikTextarea from 'components/FormElements/Textarea/FormikTextarea';
import Icon from 'components/Icon/Icon';
import Inner from 'components/Inner/Inner';
import ProductShopPrices from 'components/Product/ProductShopPrices/ProductShopPrices';
import RequestError from 'components/RequestError';
import Spinner from 'components/Spinner/Spinner';
import Title from 'components/Title/Title';
import { CATALOGUE_DEFAULT_RUBRIC_SLUG, ROUTE_CATALOGUE } from 'config/common';
import { useNotificationsContext } from 'context/notificationsContext';
import { useSiteContext } from 'context/siteContext';
import { useUserContext } from 'context/userContext';
import { CartProductInterface, CompanyInterface } from 'db/uiInterfaces';
import { Form, Formik } from 'formik';
import useValidationSchema from 'hooks/useValidationSchema';
import SiteLayoutProvider, { SiteLayoutProviderInterface } from 'layout/SiteLayoutProvider';
import { phoneToRaw } from 'lib/phoneUtils';
import Image from 'next/image';
import { useRouter } from 'next/router';
import * as React from 'react';
import { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from 'next';
import { getSiteInitialData } from 'lib/ssrUtils';
import CartAside from 'routes/CartRoute/CartAside';
import classes from 'styles/MakeAnOrderRoute.module.css';
import { makeAnOrderSchema } from 'validation/orderSchema';

interface OrderRouteProductInterface {
  cartProduct: CartProductInterface;
}

const OrderRouteProduct: React.FC<OrderRouteProductInterface> = ({ cartProduct }) => {
  const { shopProduct, amount, totalPrice } = cartProduct;
  if (!shopProduct) {
    return null;
  }

  const {
    shop,
    formattedOldPrice,
    discountedPercent,
    formattedPrice,
    originalName,
    itemId,
    mainImage,
  } = shopProduct;

  return (
    <div className={classes.productHolder}>
      <div data-cy={'order-product'} className={classes.product}>
        <div className={classes.productMainGrid}>
          <div className={classes.productImage}>
            <div className={classes.productImageHolder}>
              <Image
                src={`${mainImage}`}
                alt={originalName}
                title={originalName}
                layout='fill'
                objectFit='contain'
              />
            </div>
          </div>
          <div>
            <div className={classes.productArt}>{`Артикул: ${itemId}`}</div>
            <div className={classes.productContent}>
              <div>
                <div className={classes.productName}>{originalName}</div>
              </div>

              <div>
                <div className={classes.productTotals}>
                  <ProductShopPrices
                    className={classes.productTotalsPrice}
                    formattedPrice={`${formattedPrice}`}
                    formattedOldPrice={formattedOldPrice}
                    discountedPercent={discountedPercent}
                    size={'small'}
                  />
                  <Icon name={'cross'} className={classes.productTotalsIcon} />
                  <div className={classes.productTotalsAmount}>{amount}</div>
                </div>
                <div className={classes.productTotalPrice}>
                  Итого <Currency value={totalPrice} />
                </div>
              </div>

              <div>
                <div className={classes.shop}>
                  <div>
                    <span>винотека: </span>
                    {shop?.name}
                  </div>
                  <div>{shop?.address.formattedAddress}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

interface MakeAnOrderRouteInterface {
  company?: CompanyInterface | null;
}

const MakeAnOrderRoute: React.FC<MakeAnOrderRouteInterface> = ({ company }) => {
  const router = useRouter();
  const { showErrorNotification } = useNotificationsContext();
  const { loadingCart, cart, makeAnOrder } = useSiteContext();
  const { me } = useUserContext();
  const validationSchema = useValidationSchema({
    schema: makeAnOrderSchema,
  });
  const disabled = !!me;

  if (loadingCart && !cart) {
    return (
      <div className={classes.cart}>
        <Breadcrumbs currentPageName={'Корзина'} />

        <Inner lowTop testId={'cart'}>
          <Spinner isNested isTransparent />
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
                router.push(`${ROUTE_CATALOGUE}/${CATALOGUE_DEFAULT_RUBRIC_SLUG}`).catch(() => {
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
              companySlug: company?.slug,
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
                          disabled={disabled}
                          isRequired
                        />
                        <FormikInput
                          testId={'order-form-phone'}
                          name={'phone'}
                          type={'tel'}
                          label={'Телефон'}
                          disabled={disabled}
                          isRequired
                        />
                        <FormikInput
                          testId={'order-form-email'}
                          name={'email'}
                          type={'email'}
                          label={'E-mail'}
                          disabled={disabled}
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
                              <OrderRouteProduct
                                cartProduct={cartProduct}
                                key={`${cartProduct._id}`}
                              />
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

type MakeAnOrderInterface = SiteLayoutProviderInterface;

const MakeAnOrder: NextPage<MakeAnOrderInterface> = (props) => {
  return (
    <SiteLayoutProvider title={'Корзина'} {...props}>
      <MakeAnOrderRoute company={props.company} />
    </SiteLayoutProvider>
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
