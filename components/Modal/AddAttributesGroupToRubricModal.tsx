import * as React from 'react';
import ModalFrame from 'components/Modal/ModalFrame';
import ModalTitle from 'components/Modal/ModalTitle';
import {
  AddAttributesGroupToRubricInput,
  useGetAttributesGroupsForRubricQuery,
} from 'generated/apolloComponents';
import Spinner from 'components/Spinner';
import RequestError from 'components/RequestError';
import { Formik, Form } from 'formik';
import FormikSelect from 'components/FormElements/Select/FormikSelect';
import ModalButtons from 'components/Modal/ModalButtons';
import WpButton from 'components/button/WpButton';
import useValidationSchema from 'hooks/useValidationSchema';
import { addAttributesGroupToRubricSchema } from 'validation/rubricSchema';

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
