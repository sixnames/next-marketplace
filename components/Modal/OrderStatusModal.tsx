import FormikCheckboxLine from 'components/FormElements/Checkbox/FormikCheckboxLine';
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
import WpButton from 'components/button/WpButton';

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
    isNew: orderStatus?.isCanceled || false,
    isConfirmed: orderStatus?.isConfirmed || false,
    isPayed: orderStatus?.isPayed || false,
    isDone: orderStatus?.isDone || false,
    isCancelationRequest: orderStatus?.isCancelationRequest || false,
    isCanceled: orderStatus?.isCanceled || false,
  };

  return (
    <ModalFrame testId={'order-status-modal'}>
      <ModalTitle>{`${orderStatus ? 'Обновление' : 'Создание'} статуса заказа`}</ModalTitle>

      <Formik
        validationSchema={validationSchema}
        initialValues={initialValues}
        onSubmit={(values) => {
          showLoading();
          const commonValues = {
            nameI18n: values.nameI18n,
            color: values.color,
            index: values.index,
            isNew: values.isNew,
            isConfirmed: values.isConfirmed,
            isPayed: values.isPayed,
            isDone: values.isDone,
            isCancelationRequest: values.isCancelationRequest,
            isCanceled: values.isCanceled,
          };

          if (orderStatus) {
            updateOrderStatusMutation({
              variables: {
                input: {
                  orderStatusId: `${orderStatus._id}`,
                  ...commonValues,
                },
              },
            }).catch(console.log);
            return;
          }

          createOrderStatusMutation({
            variables: {
              input: commonValues,
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

              <FormikCheckboxLine label={'Новый'} name={'isNew'} />
              <FormikCheckboxLine label={'Подтверждён'} name={'isConfirmed'} />
              <FormikCheckboxLine label={'Оплачен'} name={'isPayed'} />
              <FormikCheckboxLine label={'Завершён'} name={'isDone'} />
              <FormikCheckboxLine label={'Запрос на отмену'} name={'isCancelationRequest'} />
              <FormikCheckboxLine label={'Отменён'} name={'isCanceled'} />

              <ModalButtons>
                <WpButton type={'submit'} testId={'submit-order-status'}>
                  {orderStatus ? 'Обновить' : 'Создать'}
                </WpButton>
              </ModalButtons>
            </Form>
          );
        }}
      </Formik>
    </ModalFrame>
  );
};

export default OrderStatusModal;
