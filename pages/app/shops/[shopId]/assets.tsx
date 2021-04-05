import AssetsManager from 'components/Assets/AssetsManager';
import Button from 'components/Buttons/Button';
import FormikDropZone from 'components/FormElements/Upload/FormikDropZone';
import FormikImageUpload from 'components/FormElements/Upload/FormikImageUpload';
import Inner from 'components/Inner/Inner';
import Title from 'components/Title/Title';
import { COL_SHOPS } from 'db/collectionNames';
import { ShopModel } from 'db/dbModels';
import { getDatabase } from 'db/mongodb';
import { Form, Formik } from 'formik';
import {
  useAddShopAssetsMutation,
  useDeleteShopAssetMutation,
  useUpdateShopAssetIndexMutation,
  useUpdateShopLogoMutation,
} from 'generated/apolloComponents';
import { SHOP_QUERY } from 'graphql/query/companiesQueries';
import useMutationCallbacks from 'hooks/useMutationCallbacks';
import useShopAppNav from 'hooks/useShopAppNav';
import useValidationSchema from 'hooks/useValidationSchema';
import AppLayout from 'layout/AppLayout/AppLayout';
import AppSubNav from 'layout/AppLayout/AppSubNav';
import { castDbData, getAppInitialData } from 'lib/ssrUtils';
import { ObjectId } from 'mongodb';
import { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from 'next';
import Head from 'next/head';
import { PagePropsInterface } from 'pages/_app';
import * as React from 'react';
import { addShopAssetsSchema } from 'validation/shopSchema';

interface ShopAssetsRouteInterface {
  shop: ShopModel;
}

const ShopAssetsRoute: React.FC<ShopAssetsRouteInterface> = ({ shop }) => {
  const navConfig = useShopAppNav({ shopId: `${shop._id}` });
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
    <div className={'pt-11'}>
      <Head>
        <title>{`Магазин ${shop.name}`}</title>
      </Head>

      <Inner lowBottom>
        <Title>Магазин {shop.name}</Title>
      </Inner>
      <AppSubNav navConfig={navConfig} />
      <Inner>
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
      </Inner>
    </div>
  );
};

interface CompanyShopAssetsInterface extends PagePropsInterface, ShopAssetsRouteInterface {}

const CompanyShopAssets: NextPage<CompanyShopAssetsInterface> = ({ pageUrls, shop }) => {
  return (
    <AppLayout pageUrls={pageUrls}>
      <ShopAssetsRoute shop={shop} />
    </AppLayout>
  );
};

export const getServerSideProps = async (
  context: GetServerSidePropsContext,
): Promise<GetServerSidePropsResult<CompanyShopAssetsInterface>> => {
  const db = await getDatabase();
  const shopsCollection = db.collection<ShopModel>(COL_SHOPS);
  const { query } = context;
  const { shopId } = query;
  const initialProps = await getAppInitialData({ context });

  const shop = await shopsCollection.findOne({ _id: new ObjectId(`${shopId}`) });

  if (!initialProps.props || !shop) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      ...initialProps.props,
      shop: castDbData(shop),
    },
  };
};

export default CompanyShopAssets;
