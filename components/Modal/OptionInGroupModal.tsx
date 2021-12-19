import * as React from 'react';
import { Form, Formik } from 'formik';
import { GENDER_ENUMS } from '../../config/common';
import { useAppContext } from '../../context/appContext';
import { OptionVariantsModel } from '../../db/dbModels';
import {
  AddOptionToGroupInput,
  OptionsGroupVariant,
  UpdateOptionInGroupInput,
} from '../../generated/apolloComponents';
import useValidationSchema from '../../hooks/useValidationSchema';
import { optionInGroupModalSchema } from '../../validation/optionsGroupSchema';
import WpButton from '../button/WpButton';
import OptionMainFields from '../FormTemplates/OptionMainFields';
import ModalButtons from './ModalButtons';
import ModalFrame from './ModalFrame';
import ModalTitle from './ModalTitle';

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
                <WpButton type={'submit'} testId={'option-submit'}>
                  Создать
                </WpButton>

                <WpButton theme={'secondary'} onClick={hideModal} testId={'option-decline'}>
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

export default OptionInGroupModal;
