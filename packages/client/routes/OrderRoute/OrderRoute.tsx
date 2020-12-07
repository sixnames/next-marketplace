import React from 'react';
import classes from './OrderRoute.module.css';
import { useSiteContext } from '../../context/siteContext';
import Breadcrumbs from '../../components/Breadcrumbs/Breadcrumbs';
import Inner from '../../components/Inner/Inner';
import Title from '../../components/Title/Title';
import CartAside from '../CartRoute/CartAside';
// import { useNotificationsContext } from '../../context/notificationsContext';
// import { useRouter } from 'next/router';
import { Form, Formik } from 'formik';
import useValidationSchema from '../../hooks/useValidationSchema';
import { makeAnOrderSchema } from '@yagu/validation';

const OrderRoute: React.FC = () => {
  // const { showErrorNotification } = useNotificationsContext();
  // const router = useRouter();
  const { cart } = useSiteContext();
  const validationSchema = useValidationSchema({
    schema: makeAnOrderSchema,
  });
  const { productsCount } = cart;

  return (
    <div className={classes.cart} data-cy={'order-form'}>
      <Breadcrumbs currentPageName={'Корзина'} config={[]} />

      <Inner lowTop testId={'cart'}>
        <Title className={classes.cartTitle}>
          Корзина
          <span>{`(${productsCount})`}</span>
        </Title>
        <Formik
          enableReinitialize={true}
          validationSchema={validationSchema}
          initialValues={{
            name: '',
            email: '',
            phone: '',
            comment: '',
          }}
          onSubmit={(values) => {
            console.log(values);
          }}
        >
          {() => {
            return (
              <Form>
                <div className={classes.frame}>
                  <div data-cy={'order-products'}>lorem</div>

                  <div className={classes.aside}>
                    <CartAside
                      cart={cart}
                      buttonText={'подтвердить заказ'}
                      backLinkHref={'/cart'}
                      buttonType={'submit'}
                      // onConfirmHandler={() => {
                      //   router.push('/thank-you').catch(() => {
                      //     showErrorNotification();
                      //   });
                      // }}
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

export default OrderRoute;
