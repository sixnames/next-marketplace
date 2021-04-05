import AssetsManager from 'components/Assets/AssetsManager';
import Button from 'components/Buttons/Button';
import FormikDropZone from 'components/FormElements/Upload/FormikDropZone';
import FormikImageUpload from 'components/FormElements/Upload/FormikImageUpload';
import Inner from 'components/Inner/Inner';
import RequestError from 'components/RequestError/RequestError';
import Spinner from 'components/Spinner/Spinner';
import Title from 'components/Title/Title';
import { ROUTE_APP } from 'config/common';
import { Form, Formik } from 'formik';
import {
  ShopFragment,
  useAddShopAssetsMutation,
  useDeleteShopAssetMutation,
  useGetCompanyShopQuery,
  useUpdateShopAssetIndexMutation,
  useUpdateShopLogoMutation,
} from 'generated/apolloComponents';
import { SHOP_QUERY } from 'graphql/query/companiesQueries';
import useMutationCallbacks from 'hooks/useMutationCallbacks';
import useValidationSchema from 'hooks/useValidationSchema';
import AppLayout from 'layout/AppLayout/AppLayout';
import AppSubNav from 'layout/AppLayout/AppSubNav';
import { getAppInitialData } from 'lib/ssrUtils';
import { GetServerSidePropsContext, NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { PagePropsInterface } from 'pages/_app';
import * as React from 'react';
import { NavItemInterface } from 'types/clientTypes';
import { addShopAssetsSchema } from 'validation/shopSchema';

interface ShopAssetsInterface {
  shop: ShopFragment;
}

const ShopAssets: React.FC<ShopAssetsInterface> = ({ shop }) => {
  const { _id, slug, logo, name } = shop;
  const {
    onErrorCallback,
    showErrorNotification,
    onCompleteCallback,
    showLoading,
  } = useMutationCallbacks({});
  const validationSchema = useValidationSchema({
    schema: addShopAssetsSchema,
  });

  const refetchQueries = [
    {
      query: SHOP_QUERY,
      variables: {
        _id,
      },
    },
  ];

  const [updateShopLogoMutation] = useUpdateShopLogoMutation({
    awaitRefetchQueries: true,
    onError: onErrorCallback,
    onCompleted: (data) => onCompleteCallback(data.updateShopLogo),
    refetchQueries,
  });

  const [addShopAssetsMutation] = useAddShopAssetsMutation({
    awaitRefetchQueries: true,
    onError: onErrorCallback,
    onCompleted: (data) => onCompleteCallback(data.addShopAssets),
    refetchQueries,
  });

  const [deleteShopAssetMutation] = useDeleteShopAssetMutation({
    awaitRefetchQueries: true,
    onError: onErrorCallback,
    onCompleted: (data) => onCompleteCallback(data.deleteShopAsset),
    refetchQueries,
  });

  const [updateShopAssetIndexMutation] = useUpdateShopAssetIndexMutation({
    awaitRefetchQueries: true,
    onError: onErrorCallback,
    onCompleted: (data) => onCompleteCallback(data.updateShopAssetIndex),
    refetchQueries,
  });

  return (
    <div data-cy={'shop-assets'}>
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
                label={'Логотип магазина'}
                name={'logo'}
                testId={slug}
                width={'10rem'}
                height={'10rem'}
                format={'image/png'}
                setImageHandler={(files) => {
                  if (files) {
                    showLoading();
                    updateShopLogoMutation({
                      variables: {
                        input: {
                          shopId: _id,
                          logo: [files[0]],
                        },
                      },
                    }).catch(() => showErrorNotification());
                  }
                }}
              >
                {isEmpty ? (
                  <div className={`text-[var(--red) mt-[1rem]] font-medium`}>
                    Логотип обязателен к заполнению
                  </div>
                ) : null}
              </FormikImageUpload>
            </Form>
          );
        }}
      </Formik>

      <AssetsManager
        initialAssets={shop.assets}
        assetsTitle={name}
        onRemoveHandler={(assetIndex) => {
          deleteShopAssetMutation({
            variables: {
              input: {
                shopId: _id,
                assetIndex,
              },
            },
          }).catch((e) => console.log(e));
        }}
        onReorderHandler={({ assetNewIndex, assetUrl }) => {
          updateShopAssetIndexMutation({
            variables: {
              input: {
                shopId: _id,
                assetNewIndex,
                assetUrl,
              },
            },
          }).catch((e) => console.log(e));
        }}
      />

      <Formik
        enableReinitialize
        validationSchema={validationSchema}
        initialValues={{ assets: [], shopId: _id }}
        onSubmit={(values, formikHelpers) => {
          showLoading();
          addShopAssetsMutation({
            variables: {
              input: values,
            },
            update: () => {
              formikHelpers.resetForm();
            },
          }).catch((e) => console.log(e));
        }}
      >
        {() => {
          return (
            <Form noValidate>
              <FormikDropZone
                tooltip={'Подсказка для загрузки изображения'}
                label={'Добавить изображения'}
                name={'assets'}
                testId={'product-images'}
              />

              <Button testId={'submit-product'} type={'submit'}>
                Добавить
              </Button>
            </Form>
          );
        }}
      </Formik>
    </div>
  );
};

const ShopAssetsRoute: React.FC = () => {
  const { query } = useRouter();
  const { slug } = query;
  const { data, loading, error } = useGetCompanyShopQuery({
    fetchPolicy: 'network-only',
    variables: {
      slug: `${slug}`,
    },
  });

  if (loading) {
    return <Spinner />;
  }

  if (error || !data || !data.getShopBySlug) {
    return <RequestError />;
  }

  const navConfig: NavItemInterface[] = [
    {
      name: 'Детали',
      testId: 'details',
      path: `${ROUTE_APP}/shops/${data.getShopBySlug.slug}`,
    },
    {
      name: 'Товары',
      testId: 'products',
      path: `${ROUTE_APP}/shops/${data.getShopBySlug.slug}/products`,
    },
    {
      name: 'Изображения',
      testId: 'assets',
      path: `${ROUTE_APP}/shops/${data.getShopBySlug.slug}/assets`,
    },
  ];

  return (
    <div className={'pt-11'}>
      <Head>
        <title>{`Магазин ${data.getShopBySlug.name}`}</title>
      </Head>

      <Inner lowBottom>
        <Title>Магазин {data.getShopBySlug.name}</Title>
      </Inner>
      <AppSubNav navConfig={navConfig} />
      <Inner>
        <ShopAssets shop={data.getShopBySlug} />
      </Inner>
    </div>
  );
};

const CompanyShopAssets: NextPage<PagePropsInterface> = ({ pageUrls }) => {
  return (
    <AppLayout pageUrls={pageUrls}>
      <ShopAssetsRoute />
    </AppLayout>
  );
};

export const getServerSideProps = async (context: GetServerSidePropsContext) => {
  return getAppInitialData({ context });
};

export default CompanyShopAssets;
