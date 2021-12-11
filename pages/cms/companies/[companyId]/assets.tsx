import FormikImageUpload from 'components/FormElements/Upload/FormikImageUpload';
import Inner from 'components/Inner';
import { ROUTE_CMS } from 'config/common';
import { COL_COMPANIES } from 'db/collectionNames';
import { getDatabase } from 'db/mongodb';
import { AppContentWrapperBreadCrumbs, CompanyInterface } from 'db/uiInterfaces';
import { Form, Formik } from 'formik';
import useMutationCallbacks from 'hooks/useMutationCallbacks';
import CmsCompanyLayout from 'layout/cms/CmsCompanyLayout';
import { ObjectId } from 'mongodb';
import { useRouter } from 'next/router';
import * as React from 'react';
import ConsoleLayout from 'layout/cms/ConsoleLayout';
import { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from 'next';
import { castDbData, getAppInitialData, GetAppInitialDataPropsInterface } from 'lib/ssrUtils';

interface CompanyAssetsConsumerInterface {
  pageCompany: CompanyInterface;
}

const CompanyAssetsConsumer: React.FC<CompanyAssetsConsumerInterface> = ({ pageCompany }) => {
  const { showErrorNotification, showLoading, hideLoading } = useMutationCallbacks({});
  const router = useRouter();

  const breadcrumbs: AppContentWrapperBreadCrumbs = {
    currentPageName: 'Изображения',
    config: [
      {
        name: 'Компании',
        href: `${ROUTE_CMS}/companies`,
      },
      {
        name: `${pageCompany?.name}`,
        href: `${ROUTE_CMS}/companies/${pageCompany?._id}`,
      },
    ],
  };

  return (
    <CmsCompanyLayout company={pageCompany} breadcrumbs={breadcrumbs}>
      <Inner testId={'company-assets-list'}>
        <Formik
          enableReinitialize
          initialValues={{ logo: [pageCompany?.logo.url] }}
          onSubmit={(values) => console.log(values)}
        >
          {({ values: { logo } }) => {
            const isEmpty = !logo || !logo.length;

            return (
              <Form>
                <FormikImageUpload
                  label={'Логотип компании'}
                  name={'logo'}
                  testId={'logo'}
                  width={'10rem'}
                  height={'10rem'}
                  setImageHandler={(files) => {
                    if (files) {
                      showLoading();
                      const formData = new FormData();
                      formData.append('assets', files[0]);
                      formData.append('companyId', `${pageCompany?._id}`);

                      fetch('/api/company/update-company-logo', {
                        method: 'POST',
                        body: formData,
                      })
                        .then((res) => {
                          return res.json();
                        })
                        .then((json) => {
                          if (json.success) {
                            router.reload();
                            return;
                          }
                          hideLoading();
                          showErrorNotification({ title: json.message });
                        })
                        .catch(() => {
                          hideLoading();
                          showErrorNotification({ title: 'error' });
                        });
                    }
                  }}
                >
                  {isEmpty ? (
                    <div className='font-medium text-red-500 mt-4'>
                      Логотип обязателен к заполнению
                    </div>
                  ) : null}
                </FormikImageUpload>
              </Form>
            );
          }}
        </Formik>
      </Inner>
    </CmsCompanyLayout>
  );
};

interface CompanyAssetsPageInterface
  extends GetAppInitialDataPropsInterface,
    CompanyAssetsConsumerInterface {}

const CompanyAssetsPage: NextPage<CompanyAssetsPageInterface> = ({ layoutProps, ...props }) => {
  return (
    <ConsoleLayout {...layoutProps}>
      <CompanyAssetsConsumer {...props} />
    </ConsoleLayout>
  );
};

export const getServerSideProps = async (
  context: GetServerSidePropsContext,
): Promise<GetServerSidePropsResult<CompanyAssetsPageInterface>> => {
  const { query } = context;
  const { props } = await getAppInitialData({ context });

  if (!props || !query.companyId) {
    return {
      notFound: true,
    };
  }

  const { db } = await getDatabase();
  const companiesCollection = db.collection<CompanyInterface>(COL_COMPANIES);
  const companyAggregationResult = await companiesCollection
    .aggregate([
      {
        $match: {
          _id: new ObjectId(`${query.companyId}`),
        },
      },
    ])
    .toArray();
  const companyResult = companyAggregationResult[0];
  if (!companyResult) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      ...props,
      pageCompany: castDbData(companyResult),
    },
  };
};

export default CompanyAssetsPage;
