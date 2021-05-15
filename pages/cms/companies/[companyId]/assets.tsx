import FormikImageUpload from 'components/FormElements/Upload/FormikImageUpload';
import Inner from 'components/Inner/Inner';
import { COL_COMPANIES } from 'db/collectionNames';
import { getDatabase } from 'db/mongodb';
import { CompanyInterface } from 'db/uiInterfaces';
import { Form, Formik } from 'formik';
import useMutationCallbacks from 'hooks/useMutationCallbacks';
import CmsCompanyLayout from 'layout/CmsLayout/CmsCompanyLayout';
import { ObjectId } from 'mongodb';
import { useRouter } from 'next/router';
import { PagePropsInterface } from 'pages/_app';
import * as React from 'react';
import CmsLayout from 'layout/CmsLayout/CmsLayout';
import { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from 'next';
import { castDbData, getAppInitialData } from 'lib/ssrUtils';

// import CompanyShops from 'routes/Company/CompanyShops';

interface CompanyAssetsConsumerInterface {
  currentCompany: CompanyInterface;
}

const CompanyAssetsConsumer: React.FC<CompanyAssetsConsumerInterface> = ({ currentCompany }) => {
  const { showErrorNotification, showLoading, hideLoading } = useMutationCallbacks({});
  const router = useRouter();
  const { logo } = currentCompany;

  return (
    <CmsCompanyLayout company={currentCompany}>
      <Inner testId={'company-assets-list'}>
        <Formik
          enableReinitialize
          initialValues={{ logo: [logo.url] }}
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
                      formData.append('companyId', `${currentCompany._id}`);

                      fetch('/api/update-company-logo', {
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
                    <div className='font-medium text-red-700'>Логотип обязателен к заполнению</div>
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

interface CompanyAssetsPageInterface extends PagePropsInterface, CompanyAssetsConsumerInterface {}

const CompanyAssetsPage: NextPage<CompanyAssetsPageInterface> = ({ currentCompany, ...props }) => {
  return (
    <CmsLayout {...props}>
      <CompanyAssetsConsumer currentCompany={currentCompany} />
    </CmsLayout>
  );
};

export const getServerSideProps = async (
  context: GetServerSidePropsContext,
): Promise<GetServerSidePropsResult<CompanyAssetsPageInterface>> => {
  const { query } = context;
  const { props } = await getAppInitialData({ context, isCms: true });

  if (!props || !query.companyId) {
    return {
      notFound: true,
    };
  }

  const db = await getDatabase();
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
      currentCompany: castDbData(companyResult),
    },
  };
};

export default CompanyAssetsPage;
