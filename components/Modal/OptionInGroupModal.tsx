import OptionMainFields from 'components/FormTemplates/OptionMainFields';
import { GENDER_ENUMS } from 'config/common';
import { OptionVariantsModel } from 'db/dbModels';
import * as React from 'react';
import ModalFrame from 'components/Modal/ModalFrame';
import ModalTitle from 'components/Modal/ModalTitle';
import ModalButtons from 'components/Modal/ModalButtons';
import { Form, Formik } from 'formik';
import Button from 'components/button/Button';
import { useAppContext } from 'context/appContext';
import {
  AddOptionToGroupInput,
  UpdateOptionInGroupInput,
  OptionsGroupVariant,
} from 'generated/apolloComponents';
import useValidationSchema from 'hooks/useValidationSchema';
import { optionInGroupModalSchema } from 'validation/optionsGroupSchema';

type OptionInGroupModalValuesType =
  | Omit<AddOptionToGroupInput, 'optionsGroupId'>
  | Omit<UpdateOptionInGroupInput, 'optionsGroupId' | 'optionId'>;

export interface OptionInGroupModalInterface {
  confirm: (values: OptionInGroupModalValuesType) => void;
  groupVariant: OptionsGroupVariant;
}

const OptionInGroupModal: React.FC<OptionInGroupModalInterface> = ({ confirm, groupVariant }) => {
  const { hideModal } = useAppContext();
  const validationSchema = useValidationSchema({
    schema: optionInGroupModalSchema,
  });

  const initialValues: OptionInGroupModalValuesType = {
    nameI18n: {},
    color: '#000000',
    gender: null,
    variants: GENDER_ENUMS.reduce((acc: OptionVariantsModel, gender) => {
      acc[gender] = {};
      return acc;
    }, {}),
  };

  return (
    <ModalFrame testId={'option-in-group-modal'}>
      <ModalTitle>Создание опции</ModalTitle>

      <Formik<OptionInGroupModalValuesType>
        validationSchema={validationSchema}
        initialValues={initialValues}
        onSubmit={(values) => {
          confirm({
            ...values,
            color: values.color ? values.color : null,
          });
        }}
      >
        {() => {
          return (
            <Form>
              <OptionMainFields groupVariant={groupVariant} />

              <ModalButtons>
                <Button type={'submit'} testId={'option-submit'}>
                  Создать
                </Button>

                <Button theme={'secondary'} onClick={hideModal} testId={'option-decline'}>
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

export default OptionInGroupModal;
