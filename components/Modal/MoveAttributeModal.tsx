import { useMoveAttributeMutation } from 'hooks/mutations/useAttributeMutations';
import useMutationCallbacks from 'hooks/useMutationCallbacks';
import * as React from 'react';
import ModalFrame from 'components/Modal/ModalFrame';
import ModalTitle from 'components/Modal/ModalTitle';
import { useGetAttributesGroupsForRubricQuery } from 'generated/apolloComponents';
import Spinner from 'components/Spinner';
import RequestError from 'components/RequestError';
import { Formik, Form } from 'formik';
import FormikSelect from 'components/FormElements/Select/FormikSelect';
import ModalButtons from 'components/Modal/ModalButtons';
import Button from 'components/button/Button';

export interface MoveAttributeModalInterface {
  oldAttributesGroupId: string;
  attributeId: string;
}

const MoveAttributeModal: React.FC<MoveAttributeModalInterface> = ({
  oldAttributesGroupId,
  attributeId,
}) => {
  const { showErrorNotification } = useMutationCallbacks({
    reload: true,
    withModal: true,
  });

  const { data, loading, error } = useGetAttributesGroupsForRubricQuery({
    fetchPolicy: 'network-only',
    variables: {
      excludedIds: [oldAttributesGroupId],
    },
  });

  const [moveAttributeMutation] = useMoveAttributeMutation();

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
    <ModalFrame testId={'move-attribute-modal'}>
      <ModalTitle>Выберите группу атрибутов</ModalTitle>
      <Formik
        initialValues={{ attributesGroupId: null }}
        onSubmit={(values) => {
          if (!values.attributesGroupId) {
            showErrorNotification({
              message: 'Выберите группу атрибутов',
            });
            return;
          }

          moveAttributeMutation({
            attributeId: `${attributeId}`,
            attributesGroupId: `${values.attributesGroupId}`,
          }).catch(console.log);
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
                <Button type={'submit'} testId={'attributes-group-submit'}>
                  Сохранить
                </Button>
              </ModalButtons>
            </Form>
          );
        }}
      </Formik>
    </ModalFrame>
  );
};

export default MoveAttributeModal;
