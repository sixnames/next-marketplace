import FormikInput from 'components/FormElements/Input/FormikInput';
import FormikTranslationsInput from 'components/FormElements/Input/FormikTranslationsInput';
import { OrderStatusInterface } from 'db/uiInterfaces';
import {
  UpdateOrderStatusInput,
  useCreateOrderStatusMutation,
  useUpdateOrderStatusMutation,
} from 'generated/apolloComponents';
import useMutationCallbacks from 'hooks/useMutationCallbacks';
import { ResolverValidationSchema } from 'lib/sessionHelpers';
import * as React from 'react';
import ModalFrame from 'components/Modal/ModalFrame';
import ModalTitle from 'components/Modal/ModalTitle';
import ModalButtons from 'components/Modal/ModalButtons';
import { Form, Formik } from 'formik';
import Button from 'components/Button';

export interface OrderStatusModalInterface {
  orderStatus?: OrderStatusInterface;
  validationSchema: ResolverValidationSchema;
}

const OrderStatusModal: React.FC<OrderStatusModalInterface> = ({
  orderStatus,
  validationSchema,
}) => {
  const { showLoading, onErrorCallback, onCompleteCallback } = useMutationCallbacks({
    withModal: true,
    reload: true,
  });

  const [updateOrderStatusMutation] = useUpdateOrderStatusMutation({
    onCompleted: (data) => onCompleteCallback(data.updateOrderStatus),
    onError: onErrorCallback,
  });

  const [createOrderStatusMutation] = useCreateOrderStatusMutation({
    onCompleted: (data) => onCompleteCallback(data.createOrderStatus),
    onError: onErrorCallback,
  });

  const initialValues: UpdateOrderStatusInput = {
    orderStatusId: orderStatus ? orderStatus._id : 'null',
    nameI18n: orderStatus?.nameI18n || {},
    color: orderStatus?.color || '',
    index: orderStatus?.index || 0,
  };

  return (
    <ModalFrame testId={'order-status-modal'}>
      <ModalTitle>{`${orderStatus ? 'Обновление' : 'Создание'} статуса заказа`}</ModalTitle>

      <Formik
        validationSchema={validationSchema}
        initialValues={initialValues}
        onSubmit={(values) => {
          showLoading();
          if (orderStatus) {
            updateOrderStatusMutation({
              variables: {
                input: {
                  orderStatusId: `${orderStatus._id}`,
                  nameI18n: values.nameI18n,
                  color: values.color,
                  index: values.index,
                },
              },
            }).catch(console.log);
            return;
          }

          createOrderStatusMutation({
            variables: {
              input: {
                nameI18n: values.nameI18n,
                color: values.color,
                index: values.index,
              },
            },
          }).catch(console.log);
        }}
      >
        {() => {
          return (
            <Form>
              <FormikTranslationsInput
                label={'Название'}
                name={'nameI18n'}
                testId={'nameI18n'}
                showInlineError
                isRequired
              />

              <FormikInput
                label={'Цвет'}
                name={'color'}
                type={'color'}
                testId={'color'}
                isRequired
                showInlineError
              />

              <FormikInput
                label={'Порядковый номер'}
                name={'index'}
                testId={'index'}
                type={'number'}
                isRequired
                showInlineError
              />

              <ModalButtons>
                <Button type={'submit'} testId={'submit-order-status'}>
                  {orderStatus ? 'Обновить' : 'Создать'}
                </Button>
              </ModalButtons>
            </Form>
          );
        }}
      </Formik>
    </ModalFrame>
  );
};

export default OrderStatusModal;
