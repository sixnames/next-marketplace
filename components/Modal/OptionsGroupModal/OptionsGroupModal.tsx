import * as React from 'react';
import ModalFrame from '../ModalFrame';
import ModalTitle from '../ModalTitle';
import ModalButtons from '../ModalButtons';
import { Form, Formik } from 'formik';
import Button from '../../Buttons/Button';
import { useAppContext } from 'context/appContext';
import {
  CreateOptionsGroupInput,
  OptionsGroupFragment,
  OptionsGroupVariant,
  UpdateOptionsGroupInput,
  useOptionsGroupVariantsQuery,
} from 'generated/apolloComponents';
import FormikTranslationsInput from '../../FormElements/Input/FormikTranslationsInput';
import useValidationSchema from '../../../hooks/useValidationSchema';
import RequestError from '../../RequestError/RequestError';
import Spinner from '../../Spinner/Spinner';
import FormikSelect from '../../FormElements/Select/FormikSelect';
import { OPTIONS_GROUP_VARIANT_TEXT } from 'config/common';
import { optionsGroupModalSchema } from 'validation/optionsGroupSchema';

export interface OptionsGroupModalInterface {
  group?: OptionsGroupFragment;
  confirm: (
    values: CreateOptionsGroupInput | Omit<UpdateOptionsGroupInput, 'optionsGroupId'>,
  ) => void;
}

const OptionsGroupModal: React.FC<OptionsGroupModalInterface> = ({ group, confirm }) => {
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
          nameI18n: group?.nameI18n || '',
          variant: group?.variant || (OPTIONS_GROUP_VARIANT_TEXT as OptionsGroupVariant),
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
