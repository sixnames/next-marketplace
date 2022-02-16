import WpButton from 'components/button/WpButton';
import CompanyMainFields, {
  CompanyFormMainValuesInterface,
} from 'components/FormTemplates/CompanyMainFields';
import Inner from 'components/Inner';
import AppContentWrapper from 'components/layout/AppContentWrapper';
import ConsoleLayout from 'components/layout/cms/ConsoleLayout';
import WpTitle from 'components/WpTitle';
import { AppContentWrapperBreadCrumbs } from 'db/uiInterfaces';
import { Form, Formik } from 'formik';
import { useCreateCompanyMutation } from 'generated/apolloComponents';
import useMutationCallbacks from 'hooks/useMutationCallbacks';
import useValidationSchema from 'hooks/useValidationSchema';
import { getProjectLinks } from 'lib/links/getProjectLinks';
import { phoneToRaw } from 'lib/phoneUtils';
import { getAppInitialData, GetAppInitialDataPropsInterface } from 'lib/ssrUtils';
import { omit } from 'lodash';
import { GetServerSidePropsContext, NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import * as React from 'react';
import { createCompanyClientSchema } from 'validation/companySchema';

const pageTitle = 'Создание компании';

export type CreateCompanyFieldsInterface = CompanyFormMainValuesInterface;

const CreateCompanyContent: React.FC = () => {
  const router = useRouter();
  const { showLoading, onCompleteCallback, onErrorCallback, showErrorNotification, hideLoading } =
    useMutationCallbacks();
  const links = getProjectLinks();
  const [createCompanyMutation] = useCreateCompanyMutation({
    onError: onErrorCallback,
    onCompleted: (data) => {
      if (data?.createCompany?.success) {
        onCompleteCallback(data.createCompany);
        router.replace(links.cms.companies.url).catch((e) => console.log(e));
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
        href: links.cms.companies.url,
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
