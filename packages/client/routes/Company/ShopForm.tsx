import React from 'react';
import { ObjectSchema } from 'yup';
import { UpdateShopInput, UserInListFragment } from '../../generated/apolloComponents';
import useMutationCallbacks from '../../hooks/useMutationCallbacks';
import { Form, Formik } from 'formik';
import Button from '../../components/Buttons/Button';
import ModalButtons from '../../components/Modal/ModalButtons';
import FormikDropZone from '../../components/FormElements/Upload/FormikDropZone';
import FormikInput from '../../components/FormElements/Input/FormikInput';
import FormikMultiLineInput from '../../components/FormElements/Input/FormikMultiLineInput';

type ShopFormPayloadInterface = Omit<UpdateShopInput, 'shopId'>;

interface ShopFormInitialValuesInterface extends Omit<UpdateShopInput, 'shopId'> {
  owner: UserInListFragment | null;
  staff: UserInListFragment[];
}

interface ShopFormInterface {
  validationSchema: ObjectSchema;
  initialValues: ShopFormInitialValuesInterface;
  onSubmitHandler: (values: ShopFormPayloadInterface) => void;
  submitButtonText?: string;
}

const ShopForm: React.FC<ShopFormInterface> = ({
  initialValues,
  validationSchema,
  onSubmitHandler,
  submitButtonText = 'Создать',
}) => {
  const { showErrorNotification } = useMutationCallbacks();
  const logoInputFilesLimit = 1;

  return (
    <Formik
      enableReinitialize
      validationSchema={validationSchema}
      initialValues={initialValues}
      onSubmit={(values) => {
        if (!values.owner) {
          showErrorNotification({
            title: 'Добавьте владельца компании',
          });
          return;
        }

        onSubmitHandler(values);
      }}
    >
      {() => {
        return (
          <Form>
            <ModalButtons>
              <FormikDropZone
                label={'Логотип'}
                name={'logo'}
                testId={'shop-logo'}
                limit={logoInputFilesLimit}
                isRequired
                showInlineError
              />

              <FormikDropZone
                label={'Фото магазина'}
                name={'assets'}
                testId={'shop-assets'}
                isRequired
                showInlineError
              />

              <FormikInput
                label={'Название'}
                name={'nameString'}
                testId={'nameString'}
                showInlineError
                isRequired
              />

              <FormikMultiLineInput
                label={'Email'}
                name={'contacts.emails'}
                type={'email'}
                testId={'email'}
                isRequired
                showInlineError
              />

              <FormikMultiLineInput
                label={'Телефон'}
                name={'contacts.phones'}
                type={'tel'}
                testId={'phone'}
                isRequired
                showInlineError
              />

              <FormikInput
                label={'Адрес'}
                name={'address'}
                testId={'address'}
                showInlineError
                isRequired
              />

              <Button type={'submit'} testId={'shop-submit'}>
                {submitButtonText}
              </Button>
            </ModalButtons>
          </Form>
        );
      }}
    </Formik>
  );
};

export default ShopForm;
