import AssetsManager from 'components/Assets/AssetsManager';
import Button from 'components/Buttons/Button';
import FormikDropZone from 'components/FormElements/Upload/FormikDropZone';
import FormikImageUpload from 'components/FormElements/Upload/FormikImageUpload';
import Inner from 'components/Inner/Inner';
import { COL_SHOPS } from 'db/collectionNames';
import { ShopModel } from 'db/dbModels';
import { getDatabase } from 'db/mongodb';
import { Form, Formik } from 'formik';
import {
  useDeleteShopAssetMutation,
  useUpdateShopAssetIndexMutation,
} from 'generated/apolloComponents';
import { SHOP_QUERY } from 'graphql/query/companiesQueries';
import useMutationCallbacks from 'hooks/useMutationCallbacks';
import AppLayout from 'layout/AppLayout/AppLayout';
import AppShopLayout from 'layout/AppLayout/AppShopLayout';
import { castDbData, getAppInitialData } from 'lib/ssrUtils';
import { ObjectId } from 'mongodb';
import { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from 'next';
import { useRouter } from 'next/router';
import { PagePropsInterface } from 'pages/_app';
import * as React from 'react';

interface ShopAssetsRouteInterface {
  shop: ShopModel;
}

const ShopAssetsRoute: React.FC<ShopAssetsRouteInterface> = ({ shop }) => {
  const router = useRouter();
  const { _id, slug, logo, name } = shop;
  const {
    hideLoading,
    onErrorCallback,
    showErrorNotification,
    onCompleteCallback,
    showLoading,
  } = useMutationCallbacks({});

  const refetchQueries = [
    {
      query: SHOP_QUERY,
      variables: {
        _id,
      },
    },
  ];

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
    <AppShopLayout shop={shop}>
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
                        const formData = new FormData();
                        formData.append('assets', files[0]);
                        formData.append('shopId', `${shop._id}`);

                        fetch('/api/update-shop-logo', {
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
            initialValues={{ assets: [], shopId: _id }}
            onSubmit={(values) => {
              if (values.assets && values.assets.length > 0) {
                showLoading();
                const formData = new FormData();
                values.assets.forEach((file, index) => {
                  formData.append(`assets[${index}]`, file);
                });
                formData.append('shopId', `${values.shopId}`);

                fetch('/api/add-shop-asset', {
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
    </AppShopLayout>
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
