import * as React from 'react';
import { Form, Formik } from 'formik';
import { CreateUserInputInterface } from '../../db/dao/user/createUser';
import { RoleInterface } from '../../db/uiInterfaces';
import { useCreateUserMutation } from '../../hooks/mutations/useUserMutations';
import useMutationCallbacks from '../../hooks/useMutationCallbacks';
import useValidationSchema from '../../hooks/useValidationSchema';
import { phoneToRaw } from '../../lib/phoneUtils';
import { createUserSchema } from '../../validation/userSchema';
import WpButton from '../button/WpButton';
import UserMainFields from '../FormTemplates/UserMainFields';
import ModalButtons from './ModalButtons';
import ModalFrame from './ModalFrame';
import ModalTitle from './ModalTitle';

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
                <WpButton type={'submit'} testId={'submit-user'}>
                  Создать
                </WpButton>
                <WpButton theme={'secondary'} onClick={hideModal}>
                  Закрыть
                </WpButton>
              </ModalButtons>
            </Form>
          );
        }}
      </Formik>
    </ModalFrame>
  );
};

export default CreateUserModal;
