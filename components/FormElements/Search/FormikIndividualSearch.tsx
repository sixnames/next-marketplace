import * as React from 'react';
import { Form, Formik } from 'formik';
import FormikSearch from './FormikSearch';

interface FormikIndividualSearchInterface {
  onSubmit: (query: string) => void;
  onReset?: () => void;
  testId?: string;
  initialValue?: string;
}

const FormikIndividualSearch: React.FC<FormikIndividualSearchInterface> = ({
  onSubmit,
  testId,
  onReset,
  initialValue = '',
}) => {
  return (
    <Formik
      enableReinitialize
      initialValues={{
        search: initialValue,
      }}
      onSubmit={({ search }) => {
        onSubmit(search);
      }}
    >
      {({ resetForm }) => {
        return (
          <Form>
            <FormikSearch
              testId={testId}
              resetForm={
                onReset
                  ? () => {
                      resetForm();
                      onReset();
                    }
                  : null
              }
            />
          </Form>
        );
      }}
    </Formik>
  );
};

export default FormikIndividualSearch;
