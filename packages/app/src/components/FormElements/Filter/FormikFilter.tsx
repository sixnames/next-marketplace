import React, { useEffect, useState } from 'react';
import { ObjectType } from '../../../types';
import { Formik, Form } from 'formik';

interface ChildrenPropsInterface {
  onResetHandler: () => void;
}

interface FormikFilterInterface {
  onSubmitHandler?: (values: ObjectType) => void;
  initialValues: ObjectType;
  initialQueryValue?: ObjectType;
  children: (props: ChildrenPropsInterface) => React.ReactElement;
}

const FormikFilter: React.FC<FormikFilterInterface> = ({
  onSubmitHandler,
  initialValues,
  children,
  initialQueryValue,
}) => {
  const [initialQuery, setInitialQuery] = useState<ObjectType | null>(null);
  // TODO [Slava] router
  const router: any = { pathname: '', query: {}, replace: (args: any) => args };
  const { pathname = '', query } = router;

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
        router.replace({
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
          router.replace({
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
