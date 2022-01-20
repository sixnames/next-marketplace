import * as React from 'react';
import { Form, Formik } from 'formik';
import { DEFAULT_LOCALE } from '../../config/common';
import { CreatePromoCodeInputInterface } from '../../db/dao/promo/createPromoCode';
import { useCreatePromoCode } from '../../hooks/mutations/usePromoMutations';
import useValidationSchema from '../../hooks/useValidationSchema';
import { createPromoCodeSchema } from '../../validation/promoSchema';
import WpButton from '../button/WpButton';
import PromoCodeMainFields from '../FormTemplates/PromoCodeMainFields';
import ModalButtons from './ModalButtons';
import ModalFrame from './ModalFrame';
import ModalTitle from './ModalTitle';

export interface CreatePromoCodeModalInterface {
  promoId: string;
}

const CreatePromoCodeModal: React.FC<CreatePromoCodeModalInterface> = ({ promoId }) => {
  const validationSchema = useValidationSchema({
    schema: createPromoCodeSchema,
  });

  const [createPromoCodeMutation] = useCreatePromoCode();

  const initialValues: CreatePromoCodeInputInterface = {
    promoId,
    code: '',
    descriptionI18n: {
      [DEFAULT_LOCALE]: '',
    },
  };

  return (
    <ModalFrame testId={'create-promo-code-modal'}>
      <ModalTitle>Создание промо-кода</ModalTitle>

      <Formik
        validationSchema={validationSchema}
        initialValues={initialValues}
        onSubmit={(values) => {
          createPromoCodeMutation(values).catch(console.log);
        }}
      >
        {() => {
          return (
            <Form>
              <PromoCodeMainFields />

              <ModalButtons>
                <WpButton type={'submit'} testId={'submit-promo-code'}>
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

export default CreatePromoCodeModal;
