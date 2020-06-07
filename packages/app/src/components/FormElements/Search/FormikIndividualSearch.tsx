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
  const initialValues = { query: '' };
  return (
    <Formik initialValues={initialValues} onSubmit={({ query }) => onSubmit(query)}>
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
