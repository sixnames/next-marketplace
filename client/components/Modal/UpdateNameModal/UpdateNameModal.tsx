import React from 'react';
import ModalFrame from '../ModalFrame';
import ModalTitle from '../ModalTitle';
import ModalText from '../ModalText';
import ModalButtons from '../ModalButtons';
import FormikInput from '../../FormElements/Input/FormikInput';
import { Form, Formik, FormikValues } from 'formik';
import Button from '../../Buttons/Button';
import { useAppContext } from '../../../context/appContext';
import { nameLangSchema } from '../../../validation';

interface UpdateNameModalInterface {
  title?: string;
  message?: string;
  validationMessage?: string;
  oldName?: string;
  buttonText?: string;
  confirm: (values: FormikValues) => void;
  testId?: string;
}

const UpdateNameModal: React.FC<UpdateNameModalInterface> = ({
  title = '',
  message = '',
  validationMessage = '',
  oldName = '',
  buttonText = 'Изменить',
  confirm,
  testId,
}) => {
  const { hideModal } = useAppContext();

  return (
    <ModalFrame testId={testId}>
      <ModalTitle>{title}</ModalTitle>

      {!!message && (
        <ModalText>
          <p>{message}</p>
        </ModalText>
      )}

      <Formik
        initialValues={{
          name: [
            {
              key: 'ru',
              value: oldName,
            },
          ],
        }}
        onSubmit={confirm}
        validationSchema={() => nameLangSchema(validationMessage)}
      >
        {({ values }) => {
          return (
            <Form>
              {values.name.map((_, index) => {
                return (
                  <FormikInput
                    key={index}
                    name={`name[${index}].value`}
                    testId={'update-name-input'}
                    showInlineError
                  />
                );
              })}

              <ModalButtons>
                <ModalButtons>
                  <Button type={'submit'} testId={'update-name-submit'}>
                    {buttonText}
                  </Button>

                  <Button theme={'secondary'} onClick={hideModal} testId={'update-name-decline'}>
                    Отмена
                  </Button>
                </ModalButtons>
              </ModalButtons>
            </Form>
          );
        }}
      </Formik>
    </ModalFrame>
  );
};

export default UpdateNameModal;
