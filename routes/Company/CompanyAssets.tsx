import FormikImageUpload from 'components/FormElements/Upload/FormikImageUpload';
import InnerWide from 'components/Inner/InnerWide';
import { Form, Formik } from 'formik';
import { CompanyFragment } from 'generated/apolloComponents';
import useMutationCallbacks from 'hooks/useMutationCallbacks';
import { useRouter } from 'next/router';
import * as React from 'react';
import classes from './CompanyAssets.module.css';

interface CompanyAssetsInterface {
  company: CompanyFragment;
}

const CompanyAssets: React.FC<CompanyAssetsInterface> = ({ company }) => {
  const { showErrorNotification, showLoading, hideLoading } = useMutationCallbacks({});
  const router = useRouter();
  const { logo, slug } = company;

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
                setImageHandler={(files) => {
                  if (files) {
                    showLoading();
                    const formData = new FormData();
                    formData.append('assets', files[0]);
                    formData.append('companyId', `${company._id}`);

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
