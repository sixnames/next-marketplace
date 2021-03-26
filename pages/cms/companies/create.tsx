import Button from 'components/Buttons/Button';
import DataLayout from 'components/DataLayout/DataLayout';
import DataLayoutContentFrame from 'components/DataLayout/DataLayoutContentFrame';
import FormikImageUpload from 'components/FormElements/Upload/FormikImageUpload';
import CompanyMainFields, {
  CompanyFormMainValuesInterface,
} from 'components/FormTemplates/CompanyMainFields';
import Inner from 'components/Inner/Inner';
import { ROUTE_CMS } from 'config/common';
import { Form, Formik } from 'formik';
import { useCreateCompanyMutation } from 'generated/apolloComponents';
import useMutationCallbacks from 'hooks/useMutationCallbacks';
import useValidationSchema from 'hooks/useValidationSchema';
import { phoneToRaw } from 'lib/phoneUtils';
import { omit } from 'lodash';
import { useRouter } from 'next/router';
import * as React from 'react';
import AppLayout from 'layout/AppLayout/AppLayout';
import { PagePropsInterface } from 'pages/_app';
import { GetServerSidePropsContext, NextPage } from 'next';
import { getAppInitialData } from 'lib/ssrUtils';
import { createCompanyClientSchema } from 'validation/companySchema';

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
        onCompleteCallback(data.createCompany);
        router.replace(`${ROUTE_CMS}/companies`).catch((e) => console.log(e));
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

const CreateCompanyRoute: React.FC = () => {
  return <DataLayout title={'Создание компании'} filterResult={() => <CreateCompanyContent />} />;
};

const CompaniesCreate: NextPage<PagePropsInterface> = () => {
  return (
    <AppLayout>
      <CreateCompanyRoute />
    </AppLayout>
  );
};

export const getServerSideProps = async (context: GetServerSidePropsContext) => {
  return getAppInitialData({ context, isCms: true });
};

export default CompaniesCreate;
