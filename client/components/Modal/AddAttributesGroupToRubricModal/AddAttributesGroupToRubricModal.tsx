import React from 'react';
import ModalFrame from '../ModalFrame';
import ModalTitle from '../ModalTitle';
import { useGetAttributesGroupsForRubricQuery } from '../../../generated/apolloComponents';
import Spinner from '../../Spinner/Spinner';
import RequestError from '../../RequestError/RequestError';
import { Formik, Form } from 'formik';
import FormikSelect from '../../FormElements/Select/FormikSelect';
import ModalButtons from '../ModalButtons';
import Button from '../../Buttons/Button';
import { addAttributesGroupToRubricSchema } from '../../../validation';
import { AddAttributesGroupToRubricValues } from '../../../routes/Rubrics/RubricAttributes';
import useValidationSchema from '../../../hooks/useValidationSchema';

interface AddAttributesGroupToRubricModalInterface {
  testId: string;
  exclude: string[] | [];
  confirm: (values: AddAttributesGroupToRubricValues) => void;
}

const AddAttributesGroupToRubricModal: React.FC<AddAttributesGroupToRubricModalInterface> = ({
  testId,
  exclude,
  confirm,
}) => {
  const validationSchema = useValidationSchema({
    schema: addAttributesGroupToRubricSchema,
    messagesKeys: ['validation.attributesGroups.id', 'validation.rubrics.id'],
  });
  const { data, loading, error } = useGetAttributesGroupsForRubricQuery({
    variables: {
      exclude,
    },
    fetchPolicy: 'network-only',
  });

  if (loading) return <Spinner />;

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
      <Formik
        validationSchema={validationSchema}
        initialValues={{ attributesGroupId: null, showInCatalogueFilter: null }}
        onSubmit={({ attributesGroupId }) => {
          confirm({
            attributesGroupId: `${attributesGroupId}`,
          });
        }}
      >
        {() => (
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
        )}
      </Formik>
    </ModalFrame>
  );
};

export default AddAttributesGroupToRubricModal;
