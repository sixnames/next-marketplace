import Button from 'components/Buttons/Button';
import ShopMainFields from 'components/FormTemplates/ShopMainFields';
import Inner from 'components/Inner/Inner';
import { COL_SHOPS } from 'db/collectionNames';
import { ShopModel } from 'db/dbModels';
import { getDatabase } from 'db/mongodb';
import { Form, Formik } from 'formik';
import { UpdateShopInput, useUpdateShopMutation } from 'generated/apolloComponents';
import { COMPANY_SHOP_QUERY } from 'graphql/query/companiesQueries';
import useMutationCallbacks from 'hooks/useMutationCallbacks';
import useValidationSchema from 'hooks/useValidationSchema';
import AppLayout from 'layout/AppLayout/AppLayout';
import AppShopLayout from 'layout/AppLayout/AppShopLayout';
import { phoneToRaw } from 'lib/phoneUtils';
import { ObjectId } from 'mongodb';
import { PagePropsInterface } from 'pages/_app';
import * as React from 'react';
import { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from 'next';
import { castDbData, getAppInitialData } from 'lib/ssrUtils';
import { updateShopSchema } from 'validation/shopSchema';

interface ShopRouteInterface {
  shop: ShopModel;
}

const ShopRoute: React.FC<ShopRouteInterface> = ({ shop }) => {
  const {
    showLoading,
    onCompleteCallback,
    onErrorCallback,
    showErrorNotification,
  } = useMutationCallbacks();
  const [updateShopMutation] = useUpdateShopMutation({
    awaitRefetchQueries: true,
    onError: onErrorCallback,
    onCompleted: (data) => onCompleteCallback(data.updateShop),
    refetchQueries: [
      {
        query: COMPANY_SHOP_QUERY,
        variables: {
          slug: shop.slug,
        },
      },
    ],
  });
  const validationSchema = useValidationSchema({
    schema: updateShopSchema,
  });

  const initialValues: UpdateShopInput = {
    name: shop.name,
    shopId: shop._id,
    citySlug: shop.citySlug,
    contacts: {
      emails: shop.contacts.emails[0] ? shop.contacts.emails : [''],
      phones: shop.contacts.phones[0] ? shop.contacts.phones : [''],
    },
    address: {
      formattedAddress: shop.address.formattedAddress,
      point: {
        lat: shop.address.point.coordinates[1],
        lng: shop.address.point.coordinates[0],
      },
    },
  };

  return (
    <AppShopLayout shop={shop}>
      <Inner>
        <div data-cy={'shop-details'}>
          <Formik
            enableReinitialize
            validationSchema={validationSchema}
            initialValues={initialValues}
            onSubmit={(values) => {
              const { address } = values;
              if (!address) {
                showErrorNotification({
                  title: 'Укажите адрес магазина',
                });
                return;
              }

              showLoading();
              updateShopMutation({
                variables: {
                  input: {
                    ...values,
                    contacts: {
                      ...values.contacts,
                      phones: values.contacts.phones.map((phone) => {
                        const rawPhone = phoneToRaw(phone);
                        return rawPhone;
                      }),
                    },
                  },
                },
              }).catch((e) => console.log(e));
            }}
          >
            {() => {
              return (
                <Form>
                  <ShopMainFields />

                  <Button type={'submit'} testId={'shop-submit'}>
                    Сохранить
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

interface CompanyShopInterface extends PagePropsInterface, ShopRouteInterface {}

const CompanyShop: NextPage<CompanyShopInterface> = ({ pageUrls, shop }) => {
  return (
    <AppLayout pageUrls={pageUrls}>
      <ShopRoute shop={shop} />
    </AppLayout>
  );
};

export const getServerSideProps = async (
  context: GetServerSidePropsContext,
): Promise<GetServerSidePropsResult<CompanyShopInterface>> => {
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

export default CompanyShop;
