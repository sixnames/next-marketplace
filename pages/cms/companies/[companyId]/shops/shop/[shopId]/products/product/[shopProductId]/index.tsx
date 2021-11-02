import Accordion from 'components/Accordion';
import Button from 'components/Button';
import Inner from 'components/Inner';
import PageEditor from 'components/PageEditor';
import RequestError from 'components/RequestError';
import WpImage from 'components/WpImage';
import { DEFAULT_CITY, PAGE_EDITOR_DEFAULT_VALUE_STRING, ROUTE_CMS } from 'config/common';
import { useConfigContext } from 'context/configContext';
import {
  COL_COMPANIES,
  COL_PRODUCT_CARD_CONTENTS,
  COL_SHOP_PRODUCTS,
  COL_SHOPS,
} from 'db/collectionNames';
import {
  shopProductFieldsPipeline,
  shopProductSupplierProductsPipeline,
} from 'db/dao/constantPipelines';
import { ProductCardContentModel } from 'db/dbModels';
import { getDatabase } from 'db/mongodb';
import { CompanyInterface, ShopInterface, ShopProductInterface } from 'db/uiInterfaces';
import { Form, Formik } from 'formik';
import {
  UpdateProductCardContentInput,
  useUpdateProductCardContentMutation,
} from 'generated/apolloComponents';
import useMutationCallbacks from 'hooks/useMutationCallbacks';
import { AppContentWrapperBreadCrumbs } from 'layout/AppContentWrapper';
import CmsLayout from 'layout/cms/CmsLayout';
import ConsoleShopProductLayout from 'layout/console/ConsoleShopProductLayout';
import { getConstructorDefaultValue } from 'lib/constructorUtils';
import { castShopProduct } from 'lib/productUtils';
import { get } from 'lodash';
import { ObjectId } from 'mongodb';
import { PagePropsInterface } from 'pages/_app';
import * as React from 'react';
import { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from 'next';
import { castDbData, getAppInitialData } from 'lib/ssrUtils';

interface ProductDetailsInterface {
  shop: ShopInterface;
  shopProduct: ShopProductInterface;
  cardContent: ProductCardContentModel;
}

const ProductDetails: React.FC<ProductDetailsInterface> = ({ shopProduct, shop, cardContent }) => {
  const { cities } = useConfigContext();
  const { onCompleteCallback, onErrorCallback, showLoading } = useMutationCallbacks({
    reload: true,
  });
  const [updateProductCardContentMutation] = useUpdateProductCardContentMutation({
    onCompleted: (data) => onCompleteCallback(data.updateProductCardContent),
    onError: onErrorCallback,
  });

  const { product } = shopProduct;
  if (!product) {
    return <RequestError />;
  }

  const { originalName, mainImage, rubric, snippetTitle } = product;

  const companyBasePath = `${ROUTE_CMS}/companies/${shopProduct.companyId}`;
  const breadcrumbs: AppContentWrapperBreadCrumbs = {
    currentPageName: `${snippetTitle}`,
    config: [
      {
        name: 'Компании',
        href: `${ROUTE_CMS}/companies`,
      },
      {
        name: `${shop.company?.name}`,
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

  const initialValues: UpdateProductCardContentInput = cardContent;

  return (
    <ConsoleShopProductLayout
      breadcrumbs={breadcrumbs}
      shopProduct={shopProduct}
      basePath={`${companyBasePath}/shops/shop/${shopProduct.shopId}/products/product`}
    >
      <Inner testId={'product-details'}>
        <div className='relative w-[15rem] h-[15rem] mb-8'>
          <WpImage
            url={mainImage}
            alt={originalName}
            title={originalName}
            width={240}
            className='absolute inset-0 w-full h-full object-contain'
          />
        </div>

        <Formik<UpdateProductCardContentInput>
          initialValues={initialValues}
          onSubmit={(values) => {
            showLoading();
            updateProductCardContentMutation({
              variables: {
                input: values,
              },
            }).catch(console.log);
          }}
        >
          {({ values, setFieldValue }) => {
            return (
              <Form>
                {cities.map(({ name, slug }) => {
                  const cityTestId = `${product.slug}-${slug}`;
                  const fieldName = `content.${slug}`;
                  const fieldValue = get(values, fieldName);
                  const constructorValue = getConstructorDefaultValue(fieldValue);

                  return (
                    <Accordion
                      isOpen={slug === DEFAULT_CITY}
                      testId={cityTestId}
                      title={`${name}`}
                      key={slug}
                    >
                      <div className='ml-8 pt-[var(--lineGap-200)]'>
                        <PageEditor
                          value={constructorValue}
                          setValue={(value) => {
                            setFieldValue(fieldName, JSON.stringify(value));
                          }}
                          imageUpload={async (file) => {
                            try {
                              const formData = new FormData();
                              formData.append('assets', file);
                              formData.append('productId', `${shopProduct._id}`);
                              formData.append('productCardContentId', `${cardContent._id}`);

                              const responseFetch = await fetch(
                                '/api/product/add-card-content-asset',
                                {
                                  method: 'POST',
                                  body: formData,
                                },
                              );
                              const responseJson = await responseFetch.json();

                              return {
                                url: responseJson.url,
                              };
                            } catch (e) {
                              console.log(e);
                              return {
                                url: '',
                              };
                            }
                          }}
                        />
                      </div>
                    </Accordion>
                  );
                })}
                <div className='flex mb-12 mt-4'>
                  <Button
                    theme={'secondary'}
                    size={'small'}
                    type={'submit'}
                    testId={`card-content-submit`}
                  >
                    Сохранить
                  </Button>
                </div>
              </Form>
            );
          }}
        </Formik>
      </Inner>
    </ConsoleShopProductLayout>
  );
};

interface ProductPageInterface extends PagePropsInterface, ProductDetailsInterface {}

const Product: NextPage<ProductPageInterface> = ({ pageUrls, cardContent, shop, shopProduct }) => {
  return (
    <CmsLayout pageUrls={pageUrls}>
      <ProductDetails shopProduct={shopProduct} cardContent={cardContent} shop={shop} />
    </CmsLayout>
  );
};

export const getServerSideProps = async (
  context: GetServerSidePropsContext,
): Promise<GetServerSidePropsResult<ProductPageInterface>> => {
  const { query } = context;
  const { shopProductId, companyId, shopId } = query;
  const { db } = await getDatabase();
  const shopsCollection = db.collection<ShopInterface>(COL_SHOPS);
  const companiesCollection = db.collection<CompanyInterface>(COL_COMPANIES);
  const shopProductsCollection = db.collection<ShopProductInterface>(COL_SHOP_PRODUCTS);
  const productCardContentsCollection =
    db.collection<ProductCardContentModel>(COL_PRODUCT_CARD_CONTENTS);
  const { props } = await getAppInitialData({ context });
  if (!props || !shopProductId || !companyId || !shopId) {
    return {
      notFound: true,
    };
  }

  const company = await companiesCollection.findOne({
    _id: new ObjectId(`${companyId}`),
  });
  if (!company) {
    return {
      notFound: true,
    };
  }

  const shopResult = await shopsCollection.findOne({
    _id: new ObjectId(`${shopId}`),
  });
  if (!shopResult) {
    return {
      notFound: true,
    };
  }
  const shop: ShopInterface = {
    ...shopResult,
    company,
  };

  const shopProductsAggregation = await shopProductsCollection
    .aggregate<ShopProductInterface>([
      {
        $match: {
          _id: new ObjectId(`${shopProductId}`),
        },
      },

      // get shop product fields
      ...shopProductFieldsPipeline('$productId'),

      // get supplier products
      ...shopProductSupplierProductsPipeline,
    ])
    .toArray();
  const shopProductResult = shopProductsAggregation[0];
  if (!shopProductResult) {
    return {
      notFound: true,
    };
  }

  const shopProduct = castShopProduct({
    shopProduct: shopProductResult,
    locale: props.sessionLocale,
  });
  if (!shopProduct || !shopProduct.product) {
    return {
      notFound: true,
    };
  }

  let cardContent = await productCardContentsCollection.findOne({
    productId: shopProduct.productId,
    companySlug: company.slug,
  });

  if (!cardContent) {
    cardContent = {
      _id: new ObjectId(),
      productId: shopProduct.productId,
      productSlug: shopProduct.product.slug,
      companySlug: company.slug,
      assetKeys: [],
      content: {
        [DEFAULT_CITY]: PAGE_EDITOR_DEFAULT_VALUE_STRING,
      },
    };
  }

  return {
    props: {
      ...props,
      shopProduct: castDbData(shopProduct),
      cardContent: castDbData(cardContent),
      shop: castDbData(shop),
    },
  };
};

export default Product;
