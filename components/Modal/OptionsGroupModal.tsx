import { OPTIONS_GROUP_VARIANT_TEXT } from 'config/common';
import * as React from 'react';
import ModalFrame from 'components/Modal/ModalFrame';
import ModalTitle from 'components/Modal/ModalTitle';
import ModalButtons from 'components/Modal/ModalButtons';
import { Form, Formik } from 'formik';
import Button from 'components/Button';
import { useAppContext } from 'context/appContext';
import {
  CreateOptionsGroupInput,
  OptionsGroupVariant,
  useOptionsGroupVariantsQuery,
} from 'generated/apolloComponents';
import FormikTranslationsInput from 'components/FormElements/Input/FormikTranslationsInput';
import useValidationSchema from 'hooks/useValidationSchema';
import RequestError from 'components/RequestError';
import Spinner from 'components/Spinner';
import FormikSelect from 'components/FormElements/Select/FormikSelect';
import { optionsGroupModalSchema } from 'validation/optionsGroupSchema';

export interface OptionsGroupModalInterface {
  confirm: (values: CreateOptionsGroupInput) => void;
}

const OptionsGroupModal: React.FC<OptionsGroupModalInterface> = ({ confirm }) => {
  const { hideModal } = useAppContext();
  const { data, loading, error } = useOptionsGroupVariantsQuery();
  const validationSchema = useValidationSchema({
    schema: optionsGroupModalSchema,
  });

  const title = 'Создание группы';

  if (loading) {
    return (
      <ModalFrame testId={'options-group-modal'}>
        <ModalTitle>{title}</ModalTitle>
        <Spinner isNested isTransparent />
      </ModalFrame>
    );
  }

  if (error || !data || !data.getOptionsGroupVariantsOptions) {
    return (
      <ModalFrame>
        <RequestError />
      </ModalFrame>
    );
  }

  const { getOptionsGroupVariantsOptions } = data;

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
                options={getOptionsGroupVariantsOptions}
              />

              <ModalButtons>
                <Button type={'submit'} testId={'options-group-submit'}>
                  Создать
                </Button>

                <Button theme={'secondary'} onClick={hideModal} testId={'options-group-decline'}>
                  Отмена
                </Button>
              </ModalButtons>
            </Form>
          );
        }}
      </Formik>
    </ModalFrame>
  );
};

export default OptionsGroupModal;
