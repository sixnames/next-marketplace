import * as React from 'react';
import ModalFrame from 'components/Modal/ModalFrame';
import ModalTitle from 'components/Modal/ModalTitle';
import ModalButtons from 'components/Modal/ModalButtons';
import { Form, Formik } from 'formik';
import WpButton from 'components/button/WpButton';
import { useAppContext } from 'context/appContext';
import { CreateAttributesGroupInput, UpdateAttributesGroupInput } from 'generated/apolloComponents';
import FormikTranslationsInput from 'components/FormElements/Input/FormikTranslationsInput';
import useValidationSchema from 'hooks/useValidationSchema';
import { TranslationModel } from 'db/dbModels';
import { attributesGroupModalSchema } from 'validation/attributesGroupSchema';

type AttributesGroupModalValuesType =
  | CreateAttributesGroupInput
  | Omit<UpdateAttributesGroupInput, 'attributesGroupId'>;

export interface AttributesGroupModalInterface {
  nameI18n?: TranslationModel;
  confirm: (values: AttributesGroupModalValuesType) => void;
}

const AttributesGroupModal: React.FC<AttributesGroupModalInterface> = ({ nameI18n, confirm }) => {
  const validationSchema = useValidationSchema({
    schema: attributesGroupModalSchema,
  });
  const { hideModal } = useAppContext();

  return (
    <ModalFrame testId={'attributes-group-modal'}>
      <ModalTitle>{nameI18n ? 'Изменение названия группы' : 'Введите название группы'}</ModalTitle>

      <Formik<AttributesGroupModalValuesType>
        initialValues={{
          nameI18n,
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
                label={'Введите название'}
                name={'nameI18n'}
                testId={'nameI18n'}
                showInlineError
                isRequired
              />

              <ModalButtons>
                <WpButton type={'submit'} testId={'attributes-group-submit'}>
                  {nameI18n ? 'Изменить' : 'Создать'}
                </WpButton>

                <WpButton theme={'secondary'} onClick={hideModal} testId={'attributes-group-decline'}>
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

export default AttributesGroupModal;
