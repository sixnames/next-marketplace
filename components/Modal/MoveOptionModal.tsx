import { Form, Formik } from 'formik';
import * as React from 'react';
import { OptionInterface } from '../../db/uiInterfaces';
import {
  useGetAllOptionsGroupsQuery,
  useMoveOptionMutation,
} from '../../generated/apolloComponents';
import useMutationCallbacks from '../../hooks/useMutationCallbacks';
import WpButton from '../button/WpButton';
import FormikSelect from '../FormElements/Select/FormikSelect';
import RequestError from '../RequestError';
import Spinner from '../Spinner';
import ModalButtons from './ModalButtons';
import ModalFrame from './ModalFrame';
import ModalTitle from './ModalTitle';

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
                <WpButton type={'submit'} testId={'options-group-submit'}>
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

export default MoveOptionModal;
