import * as React from 'react';
import { Formik, Form } from 'formik';
import { useRouter } from 'next/router';
import { ObjectType } from '../../../types/clientTypes';

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
  const [initialQuery, setInitialQuery] = React.useState<ObjectType | null>(null);
  const router = useRouter();
  const { pathname = '', query } = router;

  React.useEffect(() => {
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
        router
          .replace({
            pathname,
            query: {
              ...query,
              ...values,
            },
          })
          .catch(console.log);
      }}
    >
      {({ resetForm }) => {
        function onResetHandler() {
          resetForm(initialValues);
          router
            .replace({
              pathname,
              query: initialQuery,
            })
            .catch(console.log);
        }

        return <Form>{children({ onResetHandler })}</Form>;
      }}
    </Formik>
  );
};

export default FormikFilter;
