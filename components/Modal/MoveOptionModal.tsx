import { Form, Formik } from 'formik';
import * as React from 'react';
import { OptionInterface, OptionsGroupInterface } from '../../db/uiInterfaces';
import { useMoveOptionMutation } from '../../generated/apolloComponents';
import useMutationCallbacks from '../../hooks/useMutationCallbacks';
import WpButton from '../button/WpButton';
import FormikSelect from '../FormElements/Select/FormikSelect';
import ModalButtons from './ModalButtons';
import ModalFrame from './ModalFrame';
import ModalTitle from './ModalTitle';

export interface MoveOptionModalInterface {
  option: OptionInterface;
  optionGroups: OptionsGroupInterface[];
}

const MoveOptionModal: React.FC<MoveOptionModalInterface> = ({ option, optionGroups }) => {
  const { onCompleteCallback, onErrorCallback, showLoading, showErrorNotification } =
    useMutationCallbacks({
      reload: true,
      withModal: true,
    });

  const [moveOptionMutation] = useMoveOptionMutation({
    onCompleted: (data) => onCompleteCallback(data.moveOption),
    onError: onErrorCallback,
  });

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
                options={optionGroups}
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
