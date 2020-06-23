import React from 'react';
import { Form, Formik } from 'formik';
import FormikSearch from './FormikSearch';

interface FormikIndividualSearchInterface {
  onSubmit: (query: string) => void;
  onReset?: () => void;
  withReset?: boolean;
  testId?: string;
}

const FormikIndividualSearch: React.FC<FormikIndividualSearchInterface> = ({
  onSubmit,
  testId,
  withReset,
  onReset,
}) => {
  const initialValues = { search: '' };
  return (
    <Formik initialValues={initialValues} onSubmit={({ search }) => onSubmit(search)}>
      {({ resetForm }) => {
        function resetFormHandler() {
          if (onReset) {
            onReset();
          }
          resetForm();
        }

        return (
          <Form>
            <FormikSearch testId={testId} resetForm={withReset ? resetFormHandler : null} />
          </Form>
        );
      }}
    </Formik>
  );
};

export default FormikIndividualSearch;
