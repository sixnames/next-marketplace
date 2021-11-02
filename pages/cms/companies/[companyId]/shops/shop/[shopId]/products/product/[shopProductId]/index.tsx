import Accordion from 'components/Accordion';
import Button from 'components/Button';
import Inner from 'components/Inner';
import PageEditor from 'components/PageEditor';
import RequestError from 'components/RequestError';
import Title from 'components/Title';
import WpImage from 'components/WpImage';
import { DEFAULT_CITY, PAGE_EDITOR_DEFAULT_VALUE_STRING } from 'config/common';
import { useConfigContext } from 'context/configContext';
import { COL_COMPANIES, COL_PRODUCT_CARD_CONTENTS, COL_SHOP_PRODUCTS } from 'db/collectionNames';
import {
  shopProductFieldsPipeline,
  shopProductSupplierProductsPipeline,
} from 'db/dao/constantPipelines';
import { ProductCardContentModel } from 'db/dbModels';
import { getDatabase } from 'db/mongodb';
import { CompanyInterface, ShopProductInterface } from 'db/uiInterfaces';
import { Form, Formik } from 'formik';
import {
  UpdateProductCardContentInput,
  useUpdateProductCardContentMutation,
} from 'generated/apolloComponents';
import useMutationCallbacks from 'hooks/useMutationCallbacks';
import AppContentWrapper from 'layout/AppContentWrapper';
import CmsLayout from 'layout/cms/CmsLayout';
import { getConstructorDefaultValue } from 'lib/constructorUtils';
import { castShopProduct } from 'lib/productUtils';
import { get } from 'lodash';
import { ObjectId } from 'mongodb';
import Head from 'next/head';
import { PagePropsInterface } from 'pages/_app';
import * as React from 'react';
import { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from 'next';
import { castDbData, getAppInitialData } from 'lib/ssrUtils';

interface ProductDetailsInterface {
  shopProduct: ShopProductInterface;
  cardContent: ProductCardContentModel;
}

const ProductDetails: React.FC<ProductDetailsInterface> = ({ shopProduct, cardContent }) => {
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

  const { originalName, mainImage, snippetTitle } = product;

  const initialValues: UpdateProductCardContentInput = cardContent;

  return (
    <AppContentWrapper>
      <Head>
        <title>{snippetTitle}</title>
      </Head>

      <Inner testId={'product-details'}>
        <Title subtitle={`Арт. ${shopProduct.itemId}`}>{snippetTitle}</Title>

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
    </AppContentWrapper>
  );
};

interface ProductPageInterface extends PagePropsInterface, ProductDetailsInterface {}

const Product: NextPage<ProductPageInterface> = ({ pageUrls, cardContent, shopProduct }) => {
  return (
    <CmsLayout pageUrls={pageUrls}>
      <ProductDetails shopProduct={shopProduct} cardContent={cardContent} />
    </CmsLayout>
  );
};

export const getServerSideProps = async (
  context: GetServerSidePropsContext,
): Promise<GetServerSidePropsResult<ProductPageInterface>> => {
  const { query } = context;
  const { shopProductId, companyId } = query;
  const { db } = await getDatabase();
  const companiesCollection = db.collection<CompanyInterface>(COL_COMPANIES);
  const shopProductsCollection = db.collection<ShopProductInterface>(COL_SHOP_PRODUCTS);
  const productCardContentsCollection =
    db.collection<ProductCardContentModel>(COL_PRODUCT_CARD_CONTENTS);
  const { props } = await getAppInitialData({ context });
  if (!props || !shopProductId || !companyId) {
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
    },
  };
};

export default Product;
