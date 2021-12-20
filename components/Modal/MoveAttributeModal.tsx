import * as React from 'react';
import { Formik, Form } from 'formik';
import { useGetAttributesGroupsForRubricQuery } from '../../generated/apolloComponents';
import { useMoveAttributeMutation } from '../../hooks/mutations/useAttributeMutations';
import useMutationCallbacks from '../../hooks/useMutationCallbacks';
import WpButton from '../button/WpButton';
import FormikSelect from '../FormElements/Select/FormikSelect';
import RequestError from '../RequestError';
import Spinner from '../Spinner';
import ModalButtons from './ModalButtons';
import ModalFrame from './ModalFrame';
import ModalTitle from './ModalTitle';

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
                <WpButton type={'submit'} testId={'attributes-group-submit'}>
                  Сохранить
                </WpButton>
              </ModalButtons>
            </Form>
          );
        }}
      </Formik>
    </ModalFrame>
  );
};

export default MoveAttributeModal;
