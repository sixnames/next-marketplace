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
import FormikInput from '../../components/FormElements/Input/FormikInput';
import FormikTextarea from '../../components/FormElements/Textarea/FormikTextarea';

const OrderRoute: React.FC = () => {
  // const { showErrorNotification } = useNotificationsContext();
  // const router = useRouter();
  const { cart } = useSiteContext();
  const validationSchema = useValidationSchema({
    schema: makeAnOrderSchema,
  });
  const { productsCount } = cart;
  //   router.push('/thank-you').catch(() => {
  //     showErrorNotification();
  //   });

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
                          <div className={classes.groupTitleCounter}>1</div>
                          Подтверждение заказа
                        </div>

                        <div className={classes.products} data-cy={'order-products'}>
                          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Assumenda culpa
                          et hic ipsa laudantium nostrum rerum tempora. Alias animi, aspernatur,
                          commodi, corporis dicta dolore provident quod recusandae repudiandae sunt
                          suscipit?
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

export default OrderRoute;
