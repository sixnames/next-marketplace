import { AddAttributesGroupToRubricInputInterface } from 'db/dao/rubrics/addAttributesGroupToRubric';
import { AttributesGroupInterface } from 'db/uiInterfaces';
import { Form, Formik } from 'formik';
import * as React from 'react';
import WpButton from '../button/WpButton';
import FormikSelect from '../FormElements/Select/FormikSelect';
import ModalButtons from './ModalButtons';
import ModalFrame from './ModalFrame';
import ModalTitle from './ModalTitle';

export interface AddAttributesGroupToRubricModalInterface {
  testId: string;
  rubricId: string;
  attributeGroups: AttributesGroupInterface[];
  confirm: (values: AddAttributesGroupToRubricInputInterface) => void;
}

const AddAttributesGroupToRubricModal: React.FC<AddAttributesGroupToRubricModalInterface> = ({
  testId,
  rubricId,
  attributeGroups,
  confirm,
}) => {
  return (
    <ModalFrame testId={testId}>
      <ModalTitle>Выберите группу атрибутов</ModalTitle>
      <Formik<AddAttributesGroupToRubricInputInterface>
        initialValues={{
          attributesGroupId: attributeGroups[0] ? `${attributeGroups[0]._id}` : '',
          rubricId,
        }}
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
