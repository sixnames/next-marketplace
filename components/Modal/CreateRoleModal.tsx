import * as React from 'react';
import { Form, Formik } from 'formik';
import { useAppContext } from '../../context/appContext';
import { CreateRoleInput } from '../../generated/apolloComponents';
import useValidationSchema from '../../hooks/useValidationSchema';
import { createRoleSchema } from '../../validation/roleSchema';
import WpButton from '../button/WpButton';
import RoleMainFields from '../FormTemplates/RoleMainFields';
import ModalButtons from './ModalButtons';
import ModalFrame from './ModalFrame';
import ModalTitle from './ModalTitle';

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
          isCompanyStaff: false,
          showAdminUiInCatalogue: false,
          isModerator: false,
          isContentManager: false,
          isInspector: false,
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
                <WpButton type={'submit'} testId={'role-submit'}>
                  Создать
                </WpButton>

                <WpButton theme={'secondary'} onClick={hideModal} testId={'role-decline'}>
                  Отмена
                </WpButton>
              </ModalButtons>
            </Form>
          );
        }}
      </Formik>
    </ModalFrame>
  );
};

export default CreateRoleModal;
