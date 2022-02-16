import FormikImageUpload from 'components/FormElements/Upload/FormikImageUpload';
import Inner from 'components/Inner';
import ConsoleLayout from 'components/layout/cms/ConsoleLayout';
import ConsoleCompanyLayout from 'components/layout/console/ConsoleCompanyLayout';
import { CompanyInterface } from 'db/uiInterfaces';
import { Form, Formik } from 'formik';
import useMutationCallbacks from 'hooks/useMutationCallbacks';
import {
  castDbData,
  getConsoleInitialData,
  GetConsoleInitialDataPropsInterface,
} from 'lib/ssrUtils';
import { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from 'next';
import { useRouter } from 'next/router';
import * as React from 'react';

interface CompanyAssetsConsumerInterface {
  pageCompany: CompanyInterface;
}

const CompanyAssetsConsumer: React.FC<CompanyAssetsConsumerInterface> = ({ pageCompany }) => {
  const { showErrorNotification, showLoading, hideLoading } = useMutationCallbacks({});
  const router = useRouter();

  return (
    <ConsoleCompanyLayout pageCompany={pageCompany}>
      <Inner testId={'company-assets-list'}>
        <Formik
          enableReinitialize
          initialValues={{ logo: [pageCompany?.logo] }}
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
                    <div className='mt-4 font-medium text-red-500'>
                      Логотип обязателен к заполнению
                    </div>
                  ) : null}
                </FormikImageUpload>
              </Form>
            );
          }}
        </Formik>
      </Inner>
    </ConsoleCompanyLayout>
  );
};

interface CompanyAssetsPageInterface
  extends GetConsoleInitialDataPropsInterface,
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
  const { props } = await getConsoleInitialData({ context });
  if (!props) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      ...props,
      pageCompany: castDbData(props.layoutProps.pageCompany),
    },
  };
};

export default CompanyAssetsPage;
