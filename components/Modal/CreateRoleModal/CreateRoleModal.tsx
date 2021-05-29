import RoleMainFields from 'components/FormTemplates/RoleMainFields';
import { useAppContext } from 'context/appContext';
import { CreateRoleInput } from 'generated/apolloComponents';
import useValidationSchema from 'hooks/useValidationSchema';
import * as React from 'react';
import { createRoleSchema } from 'validation/roleSchema';
import ModalFrame from '../ModalFrame';
import ModalTitle from '../ModalTitle';
import ModalButtons from '../ModalButtons';
import { Form, Formik } from 'formik';
import Button from '../../Buttons/Button';

export interface CreateRoleModalInterface {
  confirm: (values: CreateRoleInput) => void;
}

const CreateRoleModal: React.FC<CreateRoleModalInterface> = ({ confirm }) => {
  const { hideModal } = useAppContext();
  const validationSchema = useValidationSchema({
    schema: createRoleSchema,
  });

  return (
    <ModalFrame testId={'create-role-modal'}>
      <ModalTitle>Создание роли</ModalTitle>

      <Formik
        validationSchema={validationSchema}
        initialValues={{
          nameI18n: null,
          descriptionI18n: null,
          isStaff: false,
        }}
        onSubmit={(values) => {
          confirm(values);
        }}
      >
        {() => {
          return (
            <Form>
              <RoleMainFields />

              <ModalButtons>
                <Button type={'submit'} testId={'role-submit'}>
                  Создать
                </Button>

                <Button theme={'secondary'} onClick={hideModal} testId={'role-decline'}>
                  Отмена
                </Button>
              </ModalButtons>
            </Form>
          );
        }}
      </Formik>
    </ModalFrame>
  );
};

export default CreateRoleModal;
