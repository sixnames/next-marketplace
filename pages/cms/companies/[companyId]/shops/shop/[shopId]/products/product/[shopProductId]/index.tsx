import Button from 'components/Button';
import CompanyProductDetails from 'components/CompanyProductDetails';
import FormikInput from 'components/FormElements/Input/FormikInput';
import RequestError from 'components/RequestError';
import { ROUTE_CMS } from 'config/common';
import { COL_PRODUCT_CARD_DESCRIPTIONS, COL_PRODUCT_SEO } from 'db/collectionNames';
import { getDatabase } from 'db/mongodb';
import { ProductCardDescriptionInterface, ShopProductInterface } from 'db/uiInterfaces';
import { useUpdateManyShopProductsMutation } from 'generated/apolloComponents';
import useMutationCallbacks from 'hooks/useMutationCallbacks';
import useValidationSchema from 'hooks/useValidationSchema';
import { AppContentWrapperBreadCrumbs } from 'layout/AppContentWrapper';
import CmsLayout from 'layout/cms/CmsLayout';
import ConsoleShopProductLayout from 'layout/console/ConsoleShopProductLayout';
import { noNaN } from 'lib/numbers';
import { getConsoleShopProduct } from 'lib/productUtils';
import { PagePropsInterface } from 'pages/_app';
import * as React from 'react';
import { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from 'next';
import { castDbData, getAppInitialData } from 'lib/ssrUtils';
import { updateManyShopProductsSchema } from 'validation/shopSchema';
import { Form, Formik } from 'formik';

interface ProductDetailsInterface {
  shopProduct: ShopProductInterface;
}

const ProductDetails: React.FC<ProductDetailsInterface> = ({ shopProduct }) => {
  const { onErrorCallback, onCompleteCallback, showLoading } = useMutationCallbacks({
    reload: true,
  });
  const [updateManyShopProductsMutation] = useUpdateManyShopProductsMutation({
    onCompleted: (data) => onCompleteCallback(data.updateManyShopProducts),
    onError: onErrorCallback,
  });
  const validationSchema = useValidationSchema({
    schema: updateManyShopProductsSchema,
  });

  const { product, shop, company } = shopProduct;
  if (!product || !shop || !company) {
    return <RequestError />;
  }

  const { rubric, snippetTitle } = product;
  if (!rubric) {
    return <RequestError />;
  }

  const companyBasePath = `${ROUTE_CMS}/companies/${shopProduct.companyId}`;
  const breadcrumbs: AppContentWrapperBreadCrumbs = {
    currentPageName: `${snippetTitle}`,
    config: [
      {
        name: 'Компании',
        href: `${ROUTE_CMS}/companies`,
      },
      {
        name: `${company.name}`,
        href: companyBasePath,
      },
      {
        name: 'Магазины',
        href: `${companyBasePath}/shops/${shop.companyId}`,
      },
      {
        name: shop.name,
        href: `${companyBasePath}/shops/shop/${shop._id}`,
      },
      {
        name: 'Товары',
        href: `${companyBasePath}/shops/shop/${shop._id}/products`,
      },
      {
        name: `${rubric?.name}`,
        href: `${companyBasePath}/shops/shop/${shop._id}/products/${rubric?._id}`,
      },
    ],
  };

  const initialValues = {
    input: [
      {
        productId: shopProduct.productId,
        shopProductId: shopProduct._id,
        price: noNaN(shopProduct.price),
        available: noNaN(shopProduct.available),
      },
    ],
  };

  return (
    <ConsoleShopProductLayout
      showEditButton
      breadcrumbs={breadcrumbs}
      shopProduct={shopProduct}
      basePath={`${companyBasePath}/shops/shop/${shopProduct.shopId}/products/product`}
    >
      <CompanyProductDetails
        routeBasePath={''}
        rubric={rubric}
        product={product}
        currentCompany={company}
      >
        <div className='mb-16'>
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={(values) => {
              showLoading();
              updateManyShopProductsMutation({
                variables: values,
              }).catch((e) => console.log(e));
            }}
          >
            {() => {
              return (
                <Form>
                  <FormikInput
                    label={'Цена'}
                    testId={`price`}
                    name={`input[0].price`}
                    type={'number'}
                    min={0}
                  />

                  <FormikInput
                    label={'Наличие'}
                    testId={`available`}
                    name={`input[0].available`}
                    type={'number'}
                    min={0}
                  />

                  <Button type={'submit'}>Сохранить</Button>
                </Form>
              );
            }}
          </Formik>
        </div>
      </CompanyProductDetails>
    </ConsoleShopProductLayout>
  );
};

interface ProductPageInterface extends PagePropsInterface, ProductDetailsInterface {}

const Product: NextPage<ProductPageInterface> = ({ pageUrls, ...props }) => {
  return (
    <CmsLayout pageUrls={pageUrls}>
      <ProductDetails {...props} />
    </CmsLayout>
  );
};

export const getServerSideProps = async (
  context: GetServerSidePropsContext,
): Promise<GetServerSidePropsResult<ProductPageInterface>> => {
  const { query } = context;
  const { db } = await getDatabase();
  const cardDescriptionsCollection = db.collection<ProductCardDescriptionInterface>(
    COL_PRODUCT_CARD_DESCRIPTIONS,
  );
  const { shopProductId, companyId, shopId } = query;
  const { props } = await getAppInitialData({ context });
  if (!props || !shopProductId || !companyId || !shopId) {
    return {
      notFound: true,
    };
  }

  const shopProductResult = await getConsoleShopProduct({
    shopProductId,
    locale: props.sessionLocale,
  });
  if (!shopProductResult) {
    return {
      notFound: true,
    };
  }

  const companySlug = `${shopProductResult.company?.slug}`;
  const cardDescriptionAggregation = await cardDescriptionsCollection
    .aggregate<ProductCardDescriptionInterface>([
      {
        $match: {
          companySlug,
          productId: shopProductResult.productId,
        },
      },
      {
        $lookup: {
          from: COL_PRODUCT_SEO,
          as: 'seo',
          let: {
            productId: '$productId',
          },
          pipeline: [
            {
              $match: {
                companySlug,
                $expr: {
                  $eq: ['$productId', '$$productId'],
                },
              },
            },
          ],
        },
      },
      {
        $addFields: {
          seo: {
            $arrayElemAt: ['$seo', 0],
          },
        },
      },
    ])
    .toArray();
  const cardDescription = cardDescriptionAggregation[0];

  const shopProduct: ShopProductInterface = {
    ...shopProductResult,
    product: shopProductResult.product
      ? {
          ...shopProductResult.product,
          cardDescription,
        }
      : null,
  };

  return {
    props: {
      ...props,
      shopProduct: castDbData(shopProduct),
    },
  };
};

export default Product;
