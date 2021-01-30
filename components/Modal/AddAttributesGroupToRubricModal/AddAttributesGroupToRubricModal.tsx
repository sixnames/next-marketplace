import * as React from 'react';
import ModalFrame from '../ModalFrame';
import ModalTitle from '../ModalTitle';
import {
  AddAttributesGroupToRubricInput,
  useGetAttributesGroupsForRubricQuery,
} from 'generated/apolloComponents';
import Spinner from '../../Spinner/Spinner';
import RequestError from '../../RequestError/RequestError';
import { Formik, Form } from 'formik';
import FormikSelect from '../../FormElements/Select/FormikSelect';
import ModalButtons from '../ModalButtons';
import Button from '../../Buttons/Button';
import useValidationSchema from '../../../hooks/useValidationSchema';
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
    variables: {
      excludedIds,
    },
    fetchPolicy: 'network-only',
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
                firstOption={'Не выбрано'}
              />

              <ModalButtons>
                <Button type={'submit'} testId={'attributes-group-submit'}>
                  Добавить
                </Button>
              </ModalButtons>
            </Form>
          );
        }}
      </Formik>
    </ModalFrame>
  );
};

export default AddAttributesGroupToRubricModal;
