import { Form, Formik } from 'formik';
import * as React from 'react';
import { AttributesGroupInterface } from '../../db/uiInterfaces';
import { AddAttributesGroupToRubricInput } from '../../generated/apolloComponents';
import useValidationSchema from '../../hooks/useValidationSchema';
import { addAttributesGroupToRubricSchema } from '../../validation/rubricSchema';
import WpButton from '../button/WpButton';
import FormikSelect from '../FormElements/Select/FormikSelect';
import ModalButtons from './ModalButtons';
import ModalFrame from './ModalFrame';
import ModalTitle from './ModalTitle';

export interface AddAttributesGroupToRubricModalInterface {
  testId: string;
  rubricId: string;
  confirm: (values: AddAttributesGroupToRubricInput) => void;
  attributeGroups: AttributesGroupInterface[];
}

const AddAttributesGroupToRubricModal: React.FC<AddAttributesGroupToRubricModalInterface> = ({
  testId,
  rubricId,
  attributeGroups,
  confirm,
}) => {
  const validationSchema = useValidationSchema({
    schema: addAttributesGroupToRubricSchema,
  });

  return (
    <ModalFrame testId={testId}>
      <ModalTitle>Выберите группу атрибутов</ModalTitle>
      <Formik<AddAttributesGroupToRubricInput>
        validationSchema={validationSchema}
        initialValues={{ attributesGroupId: null, rubricId }}
        onSubmit={(values) => {
          confirm(values);
        }}
      >
        {() => {
          return (
            <Form>
              <FormikSelect
                showInlineError
                label={'Группа атрибутов'}
                name={'attributesGroupId'}
                options={attributeGroups}
                testId={'attributes-groups'}
                firstOption
              />

              <ModalButtons>
                <WpButton type={'submit'} testId={'attributes-group-submit'}>
                  Добавить
                </WpButton>
              </ModalButtons>
            </Form>
          );
        }}
      </Formik>
    </ModalFrame>
  );
};

export default AddAttributesGroupToRubricModal;
