import WpButton from 'components/button/WpButton';
import FormikDatePicker from 'components/FormElements/Input/FormikDatePicker';
import FormikInput from 'components/FormElements/Input/FormikInput';
import FormikTranslationsInput from 'components/FormElements/Input/FormikTranslationsInput';
import ModalButtons from 'components/Modal/ModalButtons';
import ModalFrame from 'components/Modal/ModalFrame';
import ModalTitle from 'components/Modal/ModalTitle';
import { DEFAULT_LOCALE } from 'config/common';
import { useAppContext } from 'context/appContext';
import { CreatePromoInputInterface } from 'db/dao/promo/createPromo';
import { CompanyInterface } from 'db/uiInterfaces';
import { useCreatePromo } from 'hooks/mutations/usePromoMutations';
import useValidationSchema from 'hooks/useValidationSchema';
import * as React from 'react';
import { Form, Formik } from 'formik';
import { createPromoSchema } from 'validation/promoSchema';

export interface CreatePromoModalInterface {
  pageCompany: CompanyInterface;
}

const CreatePromoModal: React.FC<CreatePromoModalInterface> = ({ pageCompany }) => {
  const { showLoading } = useAppContext();
  const validationSchema = useValidationSchema({
    schema: createPromoSchema,
  });

  const [createPromoMutation] = useCreatePromo();

  const initialValues: CreatePromoInputInterface = {
    companyId: `${pageCompany._id}`,
    companySlug: pageCompany.slug,
    nameI18n: {
      [DEFAULT_LOCALE]: '',
    },
    descriptionI18n: {
      [DEFAULT_LOCALE]: '',
    },
    discountPercent: 0,
    cashbackPercent: 0,
    startAt: null,
    endAt: null,
  };

  return (
    <ModalFrame testId={'create-promo-modal'}>
      <ModalTitle>Создание страницы</ModalTitle>

      <Formik
        validationSchema={validationSchema}
        initialValues={initialValues}
        onSubmit={(values) => {
          showLoading();
          createPromoMutation(values).catch(console.log);
        }}
      >
        {() => {
          return (
            <Form>
              <FormikTranslationsInput
                label={'Название'}
                name={'nameI18n'}
                testId={'name'}
                showInlineError
                isRequired
              />

              <FormikTranslationsInput
                label={'Описание'}
                name={'descriptionI18n'}
                testId={'description'}
                showInlineError
                isRequired
              />

              <FormikInput
                label={'Скидка %'}
                name={'discountPercent'}
                testId={'discountPercent'}
                type={'number'}
                min={0}
                showInlineError
                isRequired
              />

              <FormikInput
                label={'Кэшбэк %'}
                name={'cashbackPercent'}
                testId={'cashbackPercent'}
                type={'number'}
                min={0}
                showInlineError
                isRequired
              />

              <FormikDatePicker
                label={'Начало акции'}
                name={'startAt'}
                testId={'startAt'}
                showInlineError
                isRequired
              />

              <FormikDatePicker
                label={'Окончание акции'}
                name={'endAt'}
                testId={'endAt'}
                showInlineError
                isRequired
              />

              <ModalButtons>
                <WpButton type={'submit'} testId={'submit-promo'}>
                  Создать
                </WpButton>
              </ModalButtons>
            </Form>
          );
        }}
      </Formik>
    </ModalFrame>
  );
};

export default CreatePromoModal;
