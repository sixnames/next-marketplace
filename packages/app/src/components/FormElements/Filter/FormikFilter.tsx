import React, { useEffect, useState } from 'react';
import { ObjectType } from '../../../types';
import { Formik, Form } from 'formik';
import useRouterQuery from '../../../hooks/useRouterQuery';
import { ParsedUrlQueryInput } from 'querystring';

interface ChildrenPropsInterface {
  onResetHandler: () => void;
}

interface FormikFilterInterface {
  onSubmitHandler?: (values: ObjectType) => void;
  initialValues: ObjectType;
  initialQueryValue?: ParsedUrlQueryInput;
  children: (props: ChildrenPropsInterface) => React.ReactElement;
}

const FormikFilter: React.FC<FormikFilterInterface> = ({
  onSubmitHandler,
  initialValues,
  children,
  initialQueryValue,
}) => {
  const [initialQuery, setInitialQuery] = useState<ObjectType | null>(null);
  const { pathname, query, replaceLocation } = useRouterQuery();

  useEffect(() => {
    if (!initialQuery) {
      if (initialQueryValue) {
        setInitialQuery(initialQueryValue);
      } else {
        setInitialQuery(query);
      }
    }
  }, [query, initialQuery, initialQueryValue]);

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={(values) => {
        if (onSubmitHandler) {
          onSubmitHandler(values);
        }
        replaceLocation({
          pathname,
          query: {
            ...query,
            ...values,
          },
        });
      }}
    >
      {({ resetForm }) => {
        function onResetHandler() {
          resetForm(initialValues);
          replaceLocation({
            pathname,
            query: initialQuery,
          });
        }

        return <Form>{children({ onResetHandler })}</Form>;
      }}
    </Formik>
  );
};

export default FormikFilter;
