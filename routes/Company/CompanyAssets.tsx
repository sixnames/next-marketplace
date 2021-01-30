import FormikImageUpload from 'components/FormElements/Upload/FormikImageUpload';
import InnerWide from 'components/Inner/InnerWide';
import { Form, Formik } from 'formik';
import { CompanyFragment, useUpdateCompanyLogoMutation } from 'generated/apolloComponents';
import { COMPANY_QUERY } from 'graphql/query/companiesQueries';
import useMutationCallbacks from 'hooks/useMutationCallbacks';
import * as React from 'react';
import classes from './CompanyAssets.module.css';

interface CompanyAssetsInterface {
  company: CompanyFragment;
}

const CompanyAssets: React.FC<CompanyAssetsInterface> = ({ company }) => {
  const {
    onErrorCallback,
    showErrorNotification,
    onCompleteCallback,
    showLoading,
  } = useMutationCallbacks({});
  const { logo, slug, _id } = company;
  const [updateCompanyLogoMutation] = useUpdateCompanyLogoMutation({
    onError: onErrorCallback,
    onCompleted: (data) => onCompleteCallback(data.updateCompanyLogo),
    refetchQueries: [
      {
        query: COMPANY_QUERY,
        variables: {
          _id: company._id,
        },
      },
    ],
  });

  return (
    <InnerWide testId={'shop-assets'}>
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
                testId={slug}
                width={'10rem'}
                height={'10rem'}
                format={'image/png'}
                setImageHandler={(files) => {
                  if (files) {
                    showLoading();
                    updateCompanyLogoMutation({
                      variables: {
                        input: {
                          companyId: _id,
                          logo: [files[0]],
                        },
                      },
                    }).catch(() => showErrorNotification());
                  }
                }}
              >
                {isEmpty ? (
                  <div className={classes.error}>Логотип обязателен к заполнению</div>
                ) : null}
              </FormikImageUpload>
            </Form>
          );
        }}
      </Formik>
    </InnerWide>
  );
};

export default CompanyAssets;
