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
import { addAttributesGroupToRubricClientSchema } from '../../../validation';
import { AddAttributesGroupToRubricValues } from '../../../routes/Rubrics/RubricAttributes';
import FormikCheckboxLine from '../../FormElements/Checkbox/FormikCheckboxLine';

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
        validationSchema={addAttributesGroupToRubricClientSchema}
        initialValues={{ attributesGroupId: null, showInCatalogueFilter: null }}
        onSubmit={({ attributesGroupId, showInCatalogueFilter }) => {
          confirm({
            showInCatalogueFilter,
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

            <FormikCheckboxLine
              testId={'show-in-filter'}
              label={'Показывать группу атрибутов в фильтре каталога'}
              name={'showInCatalogueFilter'}
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
