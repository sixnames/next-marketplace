import { OptionInterface } from 'db/uiInterfaces';
import useMutationCallbacks from 'hooks/useMutationCallbacks';
import * as React from 'react';
import ModalFrame from 'components/Modal/ModalFrame';
import ModalTitle from 'components/Modal/ModalTitle';
import { useGetAllOptionsGroupsQuery, useMoveOptionMutation } from 'generated/apolloComponents';
import Spinner from 'components/Spinner';
import RequestError from 'components/RequestError';
import { Formik, Form } from 'formik';
import FormikSelect from 'components/FormElements/Select/FormikSelect';
import ModalButtons from 'components/Modal/ModalButtons';
import Button from 'components/Button';

export interface MoveOptionModalInterface {
  option: OptionInterface;
}

const MoveOptionModal: React.FC<MoveOptionModalInterface> = ({ option }) => {
  const { onCompleteCallback, onErrorCallback, showLoading, showErrorNotification } =
    useMutationCallbacks({
      reload: true,
      withModal: true,
    });

  const { data, loading, error } = useGetAllOptionsGroupsQuery({
    fetchPolicy: 'network-only',
    variables: {
      excludedIds: [option.optionsGroupId],
    },
  });

  const [moveOptionMutation] = useMoveOptionMutation({
    onCompleted: (data) => onCompleteCallback(data.moveOption),
    onError: onErrorCallback,
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

  const { getAllOptionsGroups } = data;

  return (
    <ModalFrame testId={'move-option-modal'}>
      <ModalTitle>Выберите группу опций</ModalTitle>
      <Formik
        initialValues={{ optionsGroupId: null }}
        onSubmit={(values) => {
          if (!values.optionsGroupId) {
            showErrorNotification({
              message: 'Выберите группу опций',
            });
            return;
          }
          showLoading();
          moveOptionMutation({
            variables: {
              input: {
                optionId: option._id,
                optionsGroupId: values.optionsGroupId,
              },
            },
          }).catch(console.log);
        }}
      >
        {() => {
          return (
            <Form>
              <FormikSelect
                showInlineError
                label={'Группа опций'}
                name={'optionsGroupId'}
                options={getAllOptionsGroups}
                testId={'options-groups'}
                firstOption
              />

              <ModalButtons>
                <Button type={'submit'} testId={'options-group-submit'}>
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

export default MoveOptionModal;
