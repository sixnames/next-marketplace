import * as React from 'react';
import { Form, Formik } from 'formik';
import { OPTIONS_GROUP_VARIANT_TEXT } from '../../config/common';
import { useAppContext } from '../../context/appContext';
import { CreateOptionsGroupInput, OptionsGroupVariant } from '../../generated/apolloComponents';
import { useConstantOptions } from '../../hooks/useConstantOptions';
import useValidationSchema from '../../hooks/useValidationSchema';
import { optionsGroupModalSchema } from '../../validation/optionsGroupSchema';
import WpButton from '../button/WpButton';
import FormikTranslationsInput from '../FormElements/Input/FormikTranslationsInput';
import FormikSelect from '../FormElements/Select/FormikSelect';
import ModalButtons from './ModalButtons';
import ModalFrame from './ModalFrame';
import ModalTitle from './ModalTitle';

export interface OptionsGroupModalInterface {
  confirm: (values: CreateOptionsGroupInput) => void;
}

const OptionsGroupModal: React.FC<OptionsGroupModalInterface> = ({ confirm }) => {
  const { hideModal } = useAppContext();
  const { optionsGroupVariantOptions } = useConstantOptions();
  const validationSchema = useValidationSchema({
    schema: optionsGroupModalSchema,
  });

  const title = 'Создание группы';

  return (
    <ModalFrame testId={'options-group-modal'}>
      <ModalTitle>{title}</ModalTitle>

      <Formik
        initialValues={{
          nameI18n: undefined,
          variant: OPTIONS_GROUP_VARIANT_TEXT as OptionsGroupVariant,
        }}
        onSubmit={(values) => {
          confirm(values);
        }}
        validationSchema={validationSchema}
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

              <FormikSelect
                testId={'variant'}
                label={'Тип группы'}
                name={'variant'}
                options={optionsGroupVariantOptions}
              />

              <ModalButtons>
                <WpButton type={'submit'} testId={'options-group-submit'}>
                  Создать
                </WpButton>

                <WpButton theme={'secondary'} onClick={hideModal} testId={'options-group-decline'}>
                  Отмена
                </WpButton>
              </ModalButtons>
            </Form>
          );
        }}
      </Formik>
    </ModalFrame>
  );
};

export default OptionsGroupModal;
