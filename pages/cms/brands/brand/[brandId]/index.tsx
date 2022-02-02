import { Form, Formik } from 'formik';
import { ObjectId } from 'mongodb';
import Head from 'next/head';
import { useRouter } from 'next/router';
import * as React from 'react';
import { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from 'next';
import FixedButtons from '../../../../../components/button/FixedButtons';
import WpButton from '../../../../../components/button/WpButton';
import WpImageUpload from '../../../../../components/FormElements/Upload/WpImageUpload';
import BrandMainFields from '../../../../../components/FormTemplates/BrandMainFields';
import Inner from '../../../../../components/Inner';
import WpTitle from '../../../../../components/WpTitle';
import { REQUEST_METHOD_DELETE, REQUEST_METHOD_POST } from '../../../../../config/common';
import { COL_BRANDS } from '../../../../../db/collectionNames';
import { getDatabase } from '../../../../../db/mongodb';
import { AppContentWrapperBreadCrumbs, BrandInterface } from '../../../../../db/uiInterfaces';
import {
  UpdateBrandInput,
  useUpdateBrandMutation,
} from '../../../../../generated/apolloComponents';
import useMutationCallbacks from '../../../../../hooks/useMutationCallbacks';
import useValidationSchema from '../../../../../hooks/useValidationSchema';
import AppContentWrapper from '../../../../../layout/AppContentWrapper';
import AppSubNav from '../../../../../layout/AppSubNav';
import { getProjectLinks } from '../../../../../lib/getProjectLinks';
import { getFieldStringLocale } from '../../../../../lib/i18n';
import {
  castDbData,
  getAppInitialData,
  GetAppInitialDataPropsInterface,
} from '../../../../../lib/ssrUtils';
import { updateBrandSchema } from '../../../../../validation/brandSchema';
import ConsoleLayout from '../../../../../layout/cms/ConsoleLayout';

interface BrandDetailsConsumerInterface {
  brand: BrandInterface;
}

const BrandDetailsConsumer: React.FC<BrandDetailsConsumerInterface> = ({ brand }) => {
  const router = useRouter();
  const validationSchema = useValidationSchema({
    schema: updateBrandSchema,
  });
  const { onErrorCallback, onCompleteCallback, showLoading, hideLoading, showErrorNotification } =
    useMutationCallbacks({
      reload: true,
    });
  const [updateBrandMutation] = useUpdateBrandMutation({
    onError: onErrorCallback,
    onCompleted: (data) => onCompleteCallback(data.updateBrand),
  });

  const initialValues: UpdateBrandInput = {
    brandId: brand._id,
    nameI18n: brand.nameI18n,
    descriptionI18n: brand.descriptionI18n,
    url: !brand.url || brand.url.length < 1 ? [''] : brand.url,
    showAsBreadcrumb: brand.showAsBreadcrumb || false,
    showAsCatalogueBreadcrumb: brand.showAsCatalogueBreadcrumb || false,
    showInCardTitle: brand.showInCardTitle || false,
    showInSnippetTitle: brand.showInSnippetTitle || false,
    showInCatalogueTitle: brand.showInCatalogueTitle || false,
  };

  const links = getProjectLinks({
    brandId: brand._id,
  });

  const breadcrumbs: AppContentWrapperBreadCrumbs = {
    currentPageName: `${brand.name}`,
    config: [
      {
        name: 'Бренды',
        href: links.cms.brands.url,
      },
    ],
  };

  const navConfig = [
    {
      name: 'Детали',
      testId: 'brand-details',
      path: links.cms.brands.brand.brandId.url,
      exact: true,
    },
    {
      name: 'Коллекции',
      testId: 'brand-collections',
      path: links.cms.brands.brand.brandId.collections.url,
    },
  ];

  return (
    <AppContentWrapper breadcrumbs={breadcrumbs}>
      <Head>
        <title>{brand.name}</title>
      </Head>
      <Inner lowBottom>
        <WpTitle testId={`${brand.itemId}-brand-title`}>{brand.name}</WpTitle>
      </Inner>

      <AppSubNav navConfig={navConfig} />

      <Inner testId={'brand-details'}>
        <WpImageUpload
          name={'logo'}
          width={'10rem'}
          height={'10rem'}
          previewUrl={brand.logo}
          removeImageHandler={() => {
            showLoading();
            const formData = new FormData();
            formData.append('brandId', `${brand._id}`);

            fetch('/api/brand/logo', {
              method: REQUEST_METHOD_DELETE,
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
          }}
          uploadImageHandler={(files) => {
            if (files) {
              showLoading();
              const formData = new FormData();
              formData.append('assets', files[0]);
              formData.append('brandId', `${brand._id}`);

              fetch('/api/brand/logo', {
                method: REQUEST_METHOD_POST,
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
        />
        <Formik
          enableReinitialize
          validationSchema={validationSchema}
          initialValues={initialValues}
          onSubmit={(values) => {
            showLoading();
            updateBrandMutation({
              variables: {
                input: {
                  ...values,
                  url: (values.url || []).reduce((acc: string[], url) => {
                    if (!url) {
                      return acc;
                    }
                    return [...acc, url];
                  }, []),
                },
              },
            }).catch(console.log);
          }}
        >
          {() => {
            return (
              <Form noValidate>
                <BrandMainFields />

                <FixedButtons>
                  <WpButton size={'small'} testId={'submit-brand'} type={'submit'}>
                    Сохранить
                  </WpButton>
                </FixedButtons>
              </Form>
            );
          }}
        </Formik>
      </Inner>
    </AppContentWrapper>
  );
};

interface BrandDetailsPageInterface
  extends GetAppInitialDataPropsInterface,
    BrandDetailsConsumerInterface {}

const BrandDetailsPage: NextPage<BrandDetailsPageInterface> = ({ layoutProps, ...props }) => {
  return (
    <ConsoleLayout {...layoutProps}>
      <BrandDetailsConsumer {...props} />
    </ConsoleLayout>
  );
};

export const getServerSideProps = async (
  context: GetServerSidePropsContext,
): Promise<GetServerSidePropsResult<BrandDetailsPageInterface>> => {
  const { query } = context;
  const { brandId } = query;
  const { db } = await getDatabase();
  const brandsCollection = db.collection<BrandInterface>(COL_BRANDS);

  const { props } = await getAppInitialData({ context });
  if (!props || !brandId) {
    return {
      notFound: true,
    };
  }
  const initialBrand = await brandsCollection.findOne({
    _id: new ObjectId(`${brandId}`),
  });
  if (!initialBrand) {
    return {
      notFound: true,
    };
  }

  const brand: BrandInterface = {
    ...initialBrand,
    name: getFieldStringLocale(initialBrand.nameI18n, props.sessionLocale),
  };

  return {
    props: {
      ...props,
      brand: castDbData(brand),
    },
  };
};

export default BrandDetailsPage;
