import { Form, Formik } from 'formik';
import { omit } from 'lodash';
import Head from 'next/head';
import { useRouter } from 'next/router';
import * as React from 'react';
import { GetServerSidePropsContext, NextPage } from 'next';
import WpButton from '../../../components/button/WpButton';
import CompanyMainFields, {
  CompanyFormMainValuesInterface,
} from '../../../components/FormTemplates/CompanyMainFields';
import Inner from '../../../components/Inner';
import WpTitle from '../../../components/WpTitle';
import { ROUTE_CMS } from '../../../config/common';
import { AppContentWrapperBreadCrumbs } from '../../../db/uiInterfaces';
import { useCreateCompanyMutation } from '../../../generated/apolloComponents';
import useMutationCallbacks from '../../../hooks/useMutationCallbacks';
import useValidationSchema from '../../../hooks/useValidationSchema';
import AppContentWrapper from '../../../layout/AppContentWrapper';
import { phoneToRaw } from '../../../lib/phoneUtils';
import { getAppInitialData, GetAppInitialDataPropsInterface } from '../../../lib/ssrUtils';
import { createCompanyClientSchema } from '../../../validation/companySchema';
import ConsoleLayout from '../../../layout/cms/ConsoleLayout';

const pageTitle = 'Создание компании';

export type CreateCompanyFieldsInterface = CompanyFormMainValuesInterface;

const CreateCompanyContent: React.FC = () => {
  const router = useRouter();
  const { showLoading, onCompleteCallback, onErrorCallback, showErrorNotification, hideLoading } =
    useMutationCallbacks();
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

  const breadcrumbs: AppContentWrapperBreadCrumbs = {
    currentPageName: pageTitle,
    config: [
      {
        name: 'Компании',
        href: `${ROUTE_CMS}/companies`,
      },
    ],
  };

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
    <AppContentWrapper testId={'create-company-content'} breadcrumbs={breadcrumbs}>
      <Head>
        <title>{pageTitle}</title>
      </Head>

      <Inner>
        <WpTitle>{pageTitle}</WpTitle>

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
                <WpButton type={'submit'} testId={'company-submit'}>
                  Создать компанию
                </WpButton>
              </Form>
            );
          }}
        </Formik>
      </Inner>
    </AppContentWrapper>
  );
};

const CompaniesCreate: NextPage<GetAppInitialDataPropsInterface> = ({ layoutProps }) => {
  return (
    <ConsoleLayout {...layoutProps}>
      <CreateCompanyContent />
    </ConsoleLayout>
  );
};

export const getServerSideProps = async (context: GetServerSidePropsContext) => {
  return getAppInitialData({ context });
};

export default CompaniesCreate;
