import * as React from 'react';
import ModalFrame from '../ModalFrame';
import ModalTitle from '../ModalTitle';
import ModalButtons from '../ModalButtons';
import { Form, Formik } from 'formik';
import Button from '../../Buttons/Button';
import { useAppContext } from 'context/appContext';
import {
  CreateOptionsGroupInput,
  OptionsGroupVariant,
  useOptionsGroupVariantsQuery,
} from 'generated/apolloComponents';
import FormikTranslationsInput from '../../FormElements/Input/FormikTranslationsInput';
import useValidationSchema from '../../../hooks/useValidationSchema';
import RequestError from '../../RequestError/RequestError';
import Spinner from '../../Spinner/Spinner';
import FormikSelect from '../../FormElements/Select/FormikSelect';
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
          variant: '' as OptionsGroupVariant,
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
