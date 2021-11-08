import Button from 'components/button/Button';
import UserMainFields from 'components/FormTemplates/UserMainFields';
import ModalButtons from 'components/Modal/ModalButtons';
import ModalFrame from 'components/Modal/ModalFrame';
import ModalTitle from 'components/Modal/ModalTitle';
import { CreateUserInputInterface } from 'db/dao/user/createUser';
import { RoleInterface } from 'db/uiInterfaces';
import { useCreateUserMutation } from 'hooks/mutations/useUserMutations';
import useMutationCallbacks from 'hooks/useMutationCallbacks';
import useValidationSchema from 'hooks/useValidationSchema';
import { phoneToRaw } from 'lib/phoneUtils';
import * as React from 'react';
import { createUserSchema } from 'validation/userSchema';
import { Form, Formik } from 'formik';

export interface CreateUserModalInterface {
  roles: RoleInterface[];
}

const CreateUserModal: React.FC<CreateUserModalInterface> = ({ roles }) => {
  const { showLoading, hideModal } = useMutationCallbacks({
    reload: true,
  });
  const validationSchema = useValidationSchema({
    schema: createUserSchema,
  });

  const [createUserMutation] = useCreateUserMutation();

  return (
    <ModalFrame testId={'create-user-modal'}>
      <ModalTitle>Создание пользователя</ModalTitle>

      <Formik<CreateUserInputInterface>
        validationSchema={validationSchema}
        initialValues={{
          name: '',
          lastName: '',
          secondName: '',
          email: '',
          phone: '',
          roleId: '',
        }}
        onSubmit={(values) => {
          showLoading();
          createUserMutation({
            ...values,
            phone: phoneToRaw(values.phone),
          }).catch(console.log);
        }}
      >
        {() => {
          return (
            <Form>
              <UserMainFields roles={roles} />

              <ModalButtons>
                <Button type={'submit'} testId={'submit-user'}>
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
