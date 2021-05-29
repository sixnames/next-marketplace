import Button from 'components/Buttons/Button';
import UserMainFields from 'components/FormTemplates/UserMainFields';
import ModalButtons from 'components/Modal/ModalButtons';
import ModalFrame from 'components/Modal/ModalFrame';
import ModalTitle from 'components/Modal/ModalTitle';
import { RoleInterface } from 'db/uiInterfaces';
import useMutationCallbacks from 'hooks/useMutationCallbacks';
import useValidationSchema from 'hooks/useValidationSchema';
import { phoneToRaw } from 'lib/phoneUtils';
import * as React from 'react';
import { createUserSchema } from 'validation/userSchema';
import { Form, Formik } from 'formik';
import { CreateUserInput, useCreateUserMutation } from 'generated/apolloComponents';

export interface CreateUserModalInterface {
  roles: RoleInterface[];
}

const CreateUserModal: React.FC<CreateUserModalInterface> = ({ roles }) => {
  const { showLoading, hideModal, onCompleteCallback, onErrorCallback } = useMutationCallbacks({
    reload: true,
  });
  const validationSchema = useValidationSchema({
    schema: createUserSchema,
  });

  const [createUserMutation] = useCreateUserMutation({
    onCompleted: (data) => onCompleteCallback(data.createUser),
    onError: onErrorCallback,
  });

  return (
    <ModalFrame testId={'create-rubric-modal'}>
      <ModalTitle>Добавление рубрики</ModalTitle>

      <Formik<CreateUserInput>
        validationSchema={validationSchema}
        initialValues={{
          name: '',
          lastName: '',
          secondName: '',
          email: '',
          phone: '',
          roleId: null,
        }}
        onSubmit={(values) => {
          showLoading();
          createUserMutation({
            variables: {
              input: {
                ...values,
                phone: phoneToRaw(values.phone),
              },
            },
          }).catch(console.log);
        }}
      >
        {() => {
          return (
            <Form>
              <UserMainFields roles={roles} />

              <ModalButtons>
                <Button type={'submit'} testId={'user-submit'}>
                  Создать
                </Button>
                <Button theme={'secondary'} onClick={hideModal}>
                  Закрыть
                </Button>
              </ModalButtons>
            </Form>
          );
        }}
      </Formik>
    </ModalFrame>
  );
};

export default CreateUserModal;
