import Button from 'components/Button';
import FixedButtons from 'components/FixedButtons';
import BrandMainFields from 'components/FormTemplates/BrandMainFields';
import Inner from 'components/Inner';
import Title from 'components/Title';
import { ROUTE_CMS } from 'config/common';
import { COL_BRANDS } from 'db/collectionNames';
import { getDatabase } from 'db/mongodb';
import { BrandInterface } from 'db/uiInterfaces';
import { Form, Formik } from 'formik';
import { UpdateBrandInput, useUpdateBrandMutation } from 'generated/apolloComponents';
import useMutationCallbacks from 'hooks/useMutationCallbacks';
import useValidationSchema from 'hooks/useValidationSchema';
import AppContentWrapper, {
  AppContentWrapperBreadCrumbs,
} from 'layout/AppLayout/AppContentWrapper';
import AppSubNav from 'layout/AppLayout/AppSubNav';
import { getFieldStringLocale } from 'lib/i18n';
import { ObjectId } from 'mongodb';
import Head from 'next/head';
import { PagePropsInterface } from 'pages/_app';
import * as React from 'react';
import CmsLayout from 'layout/CmsLayout/CmsLayout';
import { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from 'next';
import { castDbData, getAppInitialData } from 'lib/ssrUtils';
import { updateBrandSchema } from 'validation/brandSchema';

interface BrandDetailsConsumerInterface {
  brand: BrandInterface;
}

const BrandDetailsConsumer: React.FC<BrandDetailsConsumerInterface> = ({ brand }) => {
  const validationSchema = useValidationSchema({
    schema: updateBrandSchema,
  });
  const { onErrorCallback, onCompleteCallback, showLoading } = useMutationCallbacks({
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
    url: brand.url,
  };

  const breadcrumbs: AppContentWrapperBreadCrumbs = {
    currentPageName: `${brand.name}`,
    config: [
      {
        name: 'Бренды',
        href: `${ROUTE_CMS}/brands`,
      },
    ],
  };

  const navConfig = React.useMemo(() => {
    return [
      {
        name: 'Детали',
        testId: 'brand-details',
        path: `${ROUTE_CMS}/brands/brand/${brand._id}`,
        exact: true,
      },
      {
        name: 'Коллекции',
        testId: 'brand-collections',
        path: `${ROUTE_CMS}/brands/brand/${brand._id}/collection`,
      },
    ];
  }, [brand._id]);

  return (
    <AppContentWrapper breadcrumbs={breadcrumbs}>
      <Head>
        <title>{brand.name}</title>
      </Head>
      <Inner lowBottom>
        <Title
          testId={`${brand.itemId}-brand-title`}
          subtitle={
            <div className='flex'>
              <div>{`ID ${brand.itemId}`}</div>
            </div>
          }
        >
          {brand.name}
        </Title>
      </Inner>

      <AppSubNav navConfig={navConfig} />

      <Inner testId={'brand-details-page'}>
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
                  <Button size={'small'} testId={'submit-brand'} type={'submit'}>
                    Сохранить
                  </Button>
                </FixedButtons>
              </Form>
            );
          }}
        </Formik>
      </Inner>
    </AppContentWrapper>
  );
};

interface BrandDetailsPageInterface extends PagePropsInterface, BrandDetailsConsumerInterface {}

const BrandDetailsPage: NextPage<BrandDetailsPageInterface> = ({ pageUrls, ...props }) => {
  return (
    <CmsLayout pageUrls={pageUrls}>
      <BrandDetailsConsumer {...props} />
    </CmsLayout>
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
