import React from 'react';
import ModalFrame from '../ModalFrame';
import ModalTitle from '../ModalTitle';
import ModalButtons from '../ModalButtons';
import { Form, Formik } from 'formik';
import Button from '../../Buttons/Button';
import { useAppContext } from '../../../context/appContext';
import {
  CreateOptionsGroupInput,
  OptionsGroupFragment,
  OptionsGroupVariantEnum,
  UpdateOptionsGroupInput,
  useOptionsGroupVariantsQuery,
} from '../../../generated/apolloComponents';
import { useLanguageContext } from '../../../context/languageContext';
import FormikTranslationsInput from '../../FormElements/Input/FormikTranslationsInput';
import useValidationSchema from '../../../hooks/useValidationSchema';
import RequestError from '../../RequestError/RequestError';
import Spinner from '../../Spinner/Spinner';
import FormikSelect from '../../FormElements/Select/FormikSelect';
import { OPTIONS_GROUP_VARIANT_TEXT, optionsGroupModalSchema } from '@yagu/shared';

export interface OptionsGroupModalInterface {
  group?: OptionsGroupFragment;
  confirm: (values: CreateOptionsGroupInput | Omit<UpdateOptionsGroupInput, 'id'>) => void;
}

const OptionsGroupModal: React.FC<OptionsGroupModalInterface> = ({ group, confirm }) => {
  const { getLanguageFieldInitialValue, getLanguageFieldInputValue } = useLanguageContext();
  const { hideModal } = useAppContext();
  const { data, loading, error } = useOptionsGroupVariantsQuery();
  const validationSchema = useValidationSchema({
    schema: optionsGroupModalSchema,
  });

  const title = group ? 'Изменение названия группы' : 'Введите название группы';

  if (loading) {
    return (
      <ModalFrame testId={'options-group-modal'}>
        <ModalTitle>{title}</ModalTitle>
        <Spinner isNested />
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
          name: getLanguageFieldInitialValue(group?.name),
          variant: group ? group.variant : OPTIONS_GROUP_VARIANT_TEXT,
        }}
        onSubmit={({ name, variant }) => {
          confirm({
            name: getLanguageFieldInputValue(name),
            variant: variant as OptionsGroupVariantEnum,
          });
        }}
        validationSchema={validationSchema}
      >
        {() => {
          return (
            <Form>
              <FormikTranslationsInput
                label={'Введите название'}
                name={'name'}
                testId={'name'}
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
                  {group ? 'Изменить' : 'Создать'}
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
