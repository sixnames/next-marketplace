import Button from 'components/Buttons/Button';
import CompanyMainFields, {
  CompanyFormMainValuesInterface,
} from 'components/FormTemplates/CompanyMainFields';
import Inner from 'components/Inner/Inner';
import Title from 'components/Title/Title';
import { ROUTE_CMS } from 'config/common';
import { Form, Formik } from 'formik';
import { useCreateCompanyMutation } from 'generated/apolloComponents';
import useMutationCallbacks from 'hooks/useMutationCallbacks';
import useValidationSchema from 'hooks/useValidationSchema';
import AppContentWrapper from 'layout/AppLayout/AppContentWrapper';
import { phoneToRaw } from 'lib/phoneUtils';
import { omit } from 'lodash';
import Head from 'next/head';
import { useRouter } from 'next/router';
import * as React from 'react';
import CmsLayout from 'layout/CmsLayout/CmsLayout';
import { PagePropsInterface } from 'pages/_app';
import { GetServerSidePropsContext, NextPage } from 'next';
import { getAppInitialData } from 'lib/ssrUtils';
import { createCompanyClientSchema } from 'validation/companySchema';

const pageTitle = 'Создание компании';

export type CreateCompanyFieldsInterface = CompanyFormMainValuesInterface;

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
    owner: null,
    staff: [],
  };

  return (
    <AppContentWrapper testId={'create-company-content'}>
      <Head>
        <title>{pageTitle}</title>
      </Head>

      <Inner>
        <Title>{pageTitle}</Title>

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
                <CompanyMainFields />
                <Button type={'submit'} testId={'company-submit'}>
                  Создать компанию
                </Button>
              </Form>
            );
          }}
        </Formik>
      </Inner>
    </AppContentWrapper>
  );
};

const CompaniesCreate: NextPage<PagePropsInterface> = ({ pageUrls }) => {
  return (
    <CmsLayout pageUrls={pageUrls}>
      <CreateCompanyContent />
    </CmsLayout>
  );
};

export const getServerSideProps = async (context: GetServerSidePropsContext) => {
  return getAppInitialData({ context });
};

export default CompaniesCreate;
