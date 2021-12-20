import { Form, Formik } from 'formik';
import * as React from 'react';
import {
  AddAttributesGroupToRubricInput,
  useGetAttributesGroupsForRubricQuery,
} from '../../generated/apolloComponents';
import useValidationSchema from '../../hooks/useValidationSchema';
import { addAttributesGroupToRubricSchema } from '../../validation/rubricSchema';
import WpButton from '../button/WpButton';
import FormikSelect from '../FormElements/Select/FormikSelect';
import RequestError from '../RequestError';
import Spinner from '../Spinner';
import ModalButtons from './ModalButtons';
import ModalFrame from './ModalFrame';
import ModalTitle from './ModalTitle';

export interface AddAttributesGroupToRubricModalInterface {
  testId: string;
  rubricId: string;
  excludedIds: string[];
  confirm: (values: AddAttributesGroupToRubricInput) => void;
}

const AddAttributesGroupToRubricModal: React.FC<AddAttributesGroupToRubricModalInterface> = ({
  testId,
  rubricId,
  excludedIds,
  confirm,
}) => {
  const validationSchema = useValidationSchema({
    schema: addAttributesGroupToRubricSchema,
  });
  const { data, loading, error } = useGetAttributesGroupsForRubricQuery({
    fetchPolicy: 'network-only',
    variables: {
      excludedIds,
    },
  });

  if (loading) {
    return <Spinner />;
  }

  if (error || !data) {
    return (
      <ModalFrame>
        <RequestError />
      </ModalFrame>
    );
  }

  const { getAllAttributesGroups } = data;

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
                options={getAllAttributesGroups}
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
