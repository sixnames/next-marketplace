import React from 'react';
import DataLayoutContentFrame from '../../components/DataLayout/DataLayoutContentFrame';
import useValidationSchema from '../../hooks/useValidationSchema';
import { createCompanySchema } from '@yagu/validation';
import useMutationCallbacks from '../../hooks/useMutationCallbacks';
import { CreateCompanyInput } from '../../generated/apolloComponents';
import { Form, Formik } from 'formik';
import FormikDropZone from '../../components/FormElements/Upload/FormikDropZone';
import FormikInput from '../../components/FormElements/Input/FormikInput';
import FormikMultiLineInput from '../../components/FormElements/Input/FormikMultiLineInput';
import ModalButtons from '../../components/Modal/ModalButtons';
import Button from '../../components/Buttons/Button';
import Inner from '../../components/Inner/Inner';
// import classes from './CreateCompanyContent.module.css';

const CreateCompanyContent: React.FC = () => {
  const validationSchema = useValidationSchema({
    schema: createCompanySchema,
  });

  const { showLoading } = useMutationCallbacks({
    withModal: true,
  });

  const initialValues: CreateCompanyInput = {
    nameString: '',
    contacts: {
      emails: [''],
      phones: [''],
    },
    logo: [],
    owner: '',
    staff: [],
  };

  const logoInputFilesLimit = 1;

  return (
    <DataLayoutContentFrame testId={'create-company-content'}>
      <Inner>
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

                <FormikMultiLineInput
                  label={'Email'}
                  name={'contacts.emails'}
                  type={'email'}
                  testId={'email'}
                  isRequired
                  showInlineError
                />

                <FormikMultiLineInput
                  label={'Телефон'}
                  name={'contacts.phones'}
                  type={'tel'}
                  testId={'phone'}
                  isRequired
                  showInlineError
                />

                <ModalButtons>
                  <Button type={'submit'} testId={'new-company-submit'}>
                    Создать
                  </Button>
                </ModalButtons>
              </Form>
            );
          }}
        </Formik>
      </Inner>
    </DataLayoutContentFrame>
  );
};

export default CreateCompanyContent;
