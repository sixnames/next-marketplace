import React from 'react';
import classes from './MakeAnOrderRoute.module.css';
import { useSiteContext } from '../../context/siteContext';
import Breadcrumbs from '../../components/Breadcrumbs/Breadcrumbs';
import Inner from '../../components/Inner/Inner';
import Title from '../../components/Title/Title';
import CartAside from '../CartRoute/CartAside';
import { Form, Formik } from 'formik';
import useValidationSchema from '../../hooks/useValidationSchema';
import { makeAnOrderSchema } from '@yagu/validation';
import FormikInput from '../../components/FormElements/Input/FormikInput';
import FormikTextarea from '../../components/FormElements/Textarea/FormikTextarea';
import { CartProductFragment } from '../../generated/apolloComponents';
import Image from '../../components/Image/Image';
import ProductShopPrices from '../../components/Product/ProductShopPrices/ProductShopPrices';
import Icon from '../../components/Icon/Icon';
import Button from '../../components/Buttons/Button';
import { useRouter } from 'next/router';
import { useNotificationsContext } from '../../context/notificationsContext';
import { useUserContext } from '../../context/userContext';

interface OrderRouteProductInterface {
  cartProduct: CartProductFragment;
}

const OrderRouteProduct: React.FC<OrderRouteProductInterface> = ({ cartProduct }) => {
  const { shopProduct, amount } = cartProduct;
  if (!shopProduct) {
    return null;
  }

  const imageWidth = 35;
  const {
    product: { mainImage, nameString, itemId },
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
            <Image url={mainImage} alt={nameString} title={nameString} width={imageWidth} />
          </div>
          <div>
            <div className={classes.productArt}>{`Артикул: ${itemId}`}</div>
            <div className={classes.productContent}>
              <div>
                <div className={classes.productName}>{nameString}</div>
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
              </div>

              <div>
                <div className={classes.shop}>
                  <div>
                    <span>винотека: </span>
                    {shop.nameString}
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
  const { makeAnOrder } = useSiteContext();
  const { me } = useUserContext();
  const { cart } = useSiteContext();
  const validationSchema = useValidationSchema({
    schema: makeAnOrderSchema,
  });

  const { productsCount, products } = cart;

  if (products.length < 1) {
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
                router.push('/').catch(() => {
                  showErrorNotification();
                });
              }}
            >
              на главную
            </Button>
            <Button className={classes.emptyBtnsItem} theme={'secondary'}>
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
            makeAnOrder(values);
          }}
        >
          {() => {
            return (
              <Form>
                <div className={classes.frame}>
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
                          {products.map((cartProduct) => {
                            return (
                              <OrderRouteProduct cartProduct={cartProduct} key={cartProduct.id} />
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
                      backLinkHref={'/cart'}
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

export default MakeAnOrderRoute;
