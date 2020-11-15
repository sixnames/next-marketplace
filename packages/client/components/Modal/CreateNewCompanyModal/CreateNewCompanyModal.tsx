import React from 'react';
import ModalFrame from '../ModalFrame';
import ModalTitle from '../ModalTitle';
import { CreateCompanyInput } from '../../../generated/apolloComponents';
import useMutationCallbacks from '../../../hooks/useMutationCallbacks';
import { Form, Formik } from 'formik';
import Button from '../../Buttons/Button';
import ModalButtons from '../ModalButtons';
import FormikInput from '../../FormElements/Input/FormikInput';
import FormikDropZone from '../../FormElements/Upload/FormikDropZone';
import { createCompanySchema } from '@yagu/validation';
import useValidationSchema from '../../../hooks/useValidationSchema';
import { PureQueryOptions, RefetchQueriesFunction } from '@apollo/client';

export interface CreateNewCompanyModalInterface {
  refetchQueries?: (string | PureQueryOptions)[] | RefetchQueriesFunction;
}

const CreateNewCompanyModal: React.FC<CreateNewCompanyModalInterface> = () => {
  const validationSchema = useValidationSchema({
    schema: createCompanySchema,
  });

  const { hideModal, showLoading } = useMutationCallbacks({
    withModal: true,
  });

  const initialValues: CreateCompanyInput = {
    nameString: '',
    contacts: {
      emails: [],
      phones: [],
    },
    logo: [],
    owner: '',
    staff: [],
  };

  const logoInputFilesLimit = 1;

  return (
    <ModalFrame testId={'create-new-company-modal'}>
      <ModalTitle>Создание компании</ModalTitle>
      <Formik
        validationSchema={validationSchema}
        initialValues={initialValues}
        onSubmit={(values) => {
          showLoading();
          console.log(values);
        }}
      >
        {() => {
          return (
            <Form>
              <FormikDropZone
                label={'Логотип'}
                name={'logo'}
                testId={'company-logo'}
                limit={logoInputFilesLimit}
                isRequired
                showInlineError
              />

              <FormikInput
                label={'Название'}
                name={'nameString'}
                testId={'nameString'}
                showInlineError
                isRequired
              />

              <ModalButtons>
                <Button type={'submit'} testId={'submit-new-product'}>
                  Создать
                </Button>
                <Button theme={'secondary'} onClick={hideModal} testId={'product-decline'}>
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

export default CreateNewCompanyModal;
