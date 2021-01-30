import Button from 'components/Buttons/Button';
import FormikImageUpload from 'components/FormElements/Upload/FormikImageUpload';
import CompanyMainFields, {
  CompanyFormMainValuesInterface,
} from 'components/FormTemplates/CompanyMainFields';
import { Form, Formik } from 'formik';
import { phoneToRaw } from 'lib/phoneUtils';
import * as React from 'react';
import DataLayoutContentFrame from '../../components/DataLayout/DataLayoutContentFrame';
import useValidationSchema from '../../hooks/useValidationSchema';
import useMutationCallbacks from '../../hooks/useMutationCallbacks';
import { useCreateCompanyMutation } from 'generated/apolloComponents';
import Inner from '../../components/Inner/Inner';
import { useRouter } from 'next/router';
import { ROUTE_CMS } from 'config/common';
import { createCompanyClientSchema } from 'validation/companySchema';
import { omit } from 'lodash';

export interface CreateCompanyFieldsInterface extends CompanyFormMainValuesInterface {
  logo: any[];
}

const CreateCompanyContent: React.FC = () => {
  const router = useRouter();
  const {
    showLoading,
    onCompleteCallback,
    onErrorCallback,
    showErrorNotification,
    hideLoading,
  } = useMutationCallbacks();
  const [createCompanyMutation] = useCreateCompanyMutation({
    onError: onErrorCallback,
    onCompleted: (data) => {
      if (data?.createCompany?.success) {
        router.replace(`${ROUTE_CMS}/companies`).catch((e) => console.log(e));
        onCompleteCallback(data.createCompany);
      } else {
        hideLoading();
        showErrorNotification({ title: data?.createCompany?.message });
      }
    },
  });
  const validationSchema = useValidationSchema({
    schema: createCompanyClientSchema,
  });

  const initialValues: CreateCompanyFieldsInterface = {
    name: '',
    contacts: {
      emails: [''],
      phones: [''],
    },
    ownerId: null,
    staffIds: [],
    logo: [null],
    owner: null,
    staff: [],
  };

  return (
    <DataLayoutContentFrame testId={'create-company-content'}>
      <Inner>
        <Formik<CreateCompanyFieldsInterface>
          enableReinitialize
          validationSchema={validationSchema}
          initialValues={initialValues}
          onSubmit={(values) => {
            if (!values.owner) {
              showErrorNotification({
                title: 'Добавьте владельца компании',
              });
              return;
            }

            const finalValues = omit(values, ['owner', 'staff']);

            showLoading();
            createCompanyMutation({
              variables: {
                input: {
                  ...finalValues,
                  contacts: {
                    ...finalValues.contacts,
                    phones: finalValues.contacts.phones.map((phone) => phoneToRaw(phone)),
                  },
                  ownerId: `${values.owner._id}`,
                  staffIds: values.staff.map(({ _id }) => _id),
                },
              },
            }).catch((e) => console.log(e));
          }}
        >
          {() => {
            return (
              <Form>
                <FormikImageUpload
                  label={'Логотип компании'}
                  name={'logo'}
                  testId={'logo'}
                  showInlineError
                  isRequired
                />

                <CompanyMainFields />
                <Button type={'submit'} testId={'company-submit'}>
                  Создать компанию
                </Button>
              </Form>
            );
          }}
        </Formik>
      </Inner>
    </DataLayoutContentFrame>
  );
};

export default CreateCompanyContent;
