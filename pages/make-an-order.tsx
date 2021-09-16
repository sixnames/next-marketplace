import Breadcrumbs from 'components/Breadcrumbs';
import Button from 'components/Button';
import Currency from 'components/Currency';
import FormikDatePicker from 'components/FormElements/Input/FormikDatePicker';
import FormikInput from 'components/FormElements/Input/FormikInput';
import FormikTextarea from 'components/FormElements/Textarea/FormikTextarea';
import Icon from 'components/Icon';
import Inner from 'components/Inner';
import Link from 'components/Link/Link';
import ProductShopPrices from 'components/ProductShopPrices';
import RequestError from 'components/RequestError';
import Spinner from 'components/Spinner';
import Title from 'components/Title';
import { ROUTE_CATALOGUE } from 'config/common';
import { useConfigContext } from 'context/configContext';
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
    oldPrice,
    discountedPercent,
    price,
    originalName,
    itemId,
    mainImage,
    rubricSlug,
    slug,
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
              <Link
                target={'_blank'}
                className='block absolute z-10 inset-0 text-indent-full'
                href={`${ROUTE_CATALOGUE}/${rubricSlug}/product/${slug}`}
              >
                {originalName}
              </Link>
            </div>
          </div>
          <div>
            <div className={classes.productArt}>{`Артикул: ${itemId}`}</div>
            <div className={classes.productContent}>
              <div>
                <div className={classes.productName}>
                  <Link
                    target={'_blank'}
                    className='block text-primary-text hover:no-underline hover:text-primary-text'
                    href={`${ROUTE_CATALOGUE}/${rubricSlug}/product/${slug}`}
                  >
                    {originalName}
                  </Link>
                </div>
              </div>

              <div>
                <div className={classes.productTotals}>
                  <ProductShopPrices
                    className={classes.productTotalsPrice}
                    price={price}
                    oldPrice={oldPrice}
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
                    <span>магазин: </span>
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
  const { configs } = useConfigContext();
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
              В каталог
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
            reservationDate: '',
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

                        <FormikDatePicker
                          isRequired
                          label={'Дата брони'}
                          name={'reservationDate'}
                          testId={'reservationDate'}
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
                      buttonText={configs.buyButtonText}
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
