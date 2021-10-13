import FormikInput from 'components/FormElements/Input/FormikInput';
import FormikTranslationsInput from 'components/FormElements/Input/FormikTranslationsInput';
import { CreateUserCategoryInputInterface } from 'db/dao/userCategory/createUserCategory';
import { UserCategoryInterface } from 'db/uiInterfaces';
import {
  useCreateUserCategory,
  useUpdateUserCategory,
} from 'hooks/mutations/useUserCategoryMutations';
import * as React from 'react';
import ModalFrame from 'components/Modal/ModalFrame';
import ModalTitle from 'components/Modal/ModalTitle';
import ModalButtons from 'components/Modal/ModalButtons';
import Button from 'components/Button';
import { Formik, Form } from 'formik';
import useValidationSchema from 'hooks/useValidationSchema';
import { createUserCategorySchema } from 'validation/userCategorySchema';

export interface UserCategoryModalInterface {
  userCategory?: UserCategoryInterface;
  companyId: string;
}

const UserCategoryModal: React.FC<UserCategoryModalInterface> = ({ userCategory, companyId }) => {
  const [createUserCategory] = useCreateUserCategory();
  const [updateUserCategory] = useUpdateUserCategory();
  const validationSchema = useValidationSchema({
    schema: createUserCategorySchema,
  });

  const initialValues: CreateUserCategoryInputInterface = {
    companyId,
    nameI18n: userCategory?.nameI18n || {},
    descriptionI18n: userCategory?.descriptionI18n || {},
    cashbackPercent: userCategory?.cashbackPercent || 0,
    discountPercent: userCategory?.discountPercent || 0,
    payFromCashbackPercent: userCategory?.payFromCashbackPercent || 0,
    entryMinCharge: userCategory?.entryMinCharge || null,
  };

  return (
    <ModalFrame testId={'user-category-modal'}>
      <ModalTitle>{userCategory ? 'Обновление' : 'Создание'} категории клиента</ModalTitle>

      <Formik
        validationSchema={validationSchema}
        initialValues={initialValues}
        onSubmit={(values) => {
          const commonValues: CreateUserCategoryInputInterface = {
            companyId: values.companyId,
            nameI18n: values.nameI18n,
            descriptionI18n: values.descriptionI18n,
            cashbackPercent: values.cashbackPercent,
            discountPercent: values.discountPercent,
            payFromCashbackPercent: values.payFromCashbackPercent,
            entryMinCharge: values.entryMinCharge,
          };

          if (userCategory) {
            updateUserCategory({
              _id: `${userCategory._id}`,
              ...commonValues,
            }).catch(console.log);
            return;
          }

          createUserCategory(commonValues).catch(console.log);
        }}
      >
        {() => {
          return (
            <Form>
              <FormikTranslationsInput
                label={'Название'}
                name={'nameI18n'}
                testId={'nameI18n'}
                isRequired
                showInlineError
              />

              <FormikTranslationsInput
                label={'Описание'}
                name={'descriptionI18n'}
                testId={'descriptionI18n'}
              />

              <FormikInput
                label={'Процент скидки'}
                name={'discountPercent'}
                testId={'discountPercent'}
                type={'number'}
                isRequired
                showInlineError
              />

              <FormikInput
                label={'Процент кешбека'}
                name={'cashbackPercent'}
                testId={'cashbackPercent'}
                type={'number'}
                isRequired
                showInlineError
              />

              <FormikInput
                label={'Процент оплаты кешбеком'}
                name={'payFromCashbackPercent'}
                testId={'payFromCashbackPercent'}
                type={'number'}
                isRequired
                showInlineError
              />

              <FormikInput
                label={'Порог вхождения в категорию'}
                name={'entryMinCharge'}
                testId={'entryMinCharge'}
                type={'number'}
              />

              <ModalButtons>
                <Button testId={'user-category-submit'} type={'submit'}>
                  {userCategory ? 'Обновить' : 'Создать'}
                </Button>
              </ModalButtons>
            </Form>
          );
        }}
      </Formik>
    </ModalFrame>
  );
};

export default UserCategoryModal;
