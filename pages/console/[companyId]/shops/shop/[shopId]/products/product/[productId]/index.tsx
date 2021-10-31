import Accordion from 'components/Accordion';
import Button from 'components/Button';
import Inner from 'components/Inner';
import PageEditor from 'components/PageEditor';
import Title from 'components/Title';
import WpImage from 'components/WpImage';
import { DEFAULT_CITY, PAGE_EDITOR_DEFAULT_VALUE_STRING } from 'config/common';
import { useConfigContext } from 'context/configContext';
import { COL_COMPANIES, COL_PRODUCT_CARD_CONTENTS, COL_PRODUCTS } from 'db/collectionNames';
import { ProductCardContentModel, ProductModel } from 'db/dbModels';
import { getDatabase } from 'db/mongodb';
import { CompanyInterface, ProductInterface } from 'db/uiInterfaces';
import { Form, Formik } from 'formik';
import {
  UpdateProductCardContentInput,
  useUpdateProductCardContentMutation,
} from 'generated/apolloComponents';
import useMutationCallbacks from 'hooks/useMutationCallbacks';
import AppContentWrapper from 'layout/AppContentWrapper';
import ConsoleLayout from 'layout/console/ConsoleLayout';
import { getConstructorDefaultValue } from 'lib/constructorUtils';
import { get } from 'lodash';
import { ObjectId } from 'mongodb';
import Head from 'next/head';
import { PagePropsInterface } from 'pages/_app';
import * as React from 'react';
import { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from 'next';
import { castDbData, getConsoleInitialData } from 'lib/ssrUtils';

interface ProductDetailsInterface {
  product: ProductInterface;
  cardContent: ProductCardContentModel;
}

const ProductDetails: React.FC<ProductDetailsInterface> = ({ product, cardContent }) => {
  const { cities } = useConfigContext();
  const { onCompleteCallback, onErrorCallback, showLoading } = useMutationCallbacks({
    reload: true,
  });
  const [updateProductCardContentMutation] = useUpdateProductCardContentMutation({
    onCompleted: (data) => onCompleteCallback(data.updateProductCardContent),
    onError: onErrorCallback,
  });

  const { originalName, mainImage } = product;

  const initialValues: UpdateProductCardContentInput = cardContent;

  return (
    <AppContentWrapper>
      <Head>
        <title>{product.originalName}</title>
      </Head>

      <Inner testId={'product-details'}>
        <Title subtitle={`Арт. ${product.itemId}`} testId={`${product.originalName}-product-title`}>
          {product.originalName}
        </Title>

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
                              formData.append('productId', `${product._id}`);
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

const Product: NextPage<ProductPageInterface> = ({
  pageUrls,
  currentCompany,
  cardContent,
  product,
}) => {
  return (
    <ConsoleLayout pageUrls={pageUrls} company={currentCompany}>
      <ProductDetails product={product} cardContent={cardContent} />
    </ConsoleLayout>
  );
};

export const getServerSideProps = async (
  context: GetServerSidePropsContext,
): Promise<GetServerSidePropsResult<ProductPageInterface>> => {
  const { query } = context;
  const { productId, companyId } = query;
  const { db } = await getDatabase();
  const companiesCollection = db.collection<CompanyInterface>(COL_COMPANIES);
  const productsCollection = db.collection<ProductModel>(COL_PRODUCTS);
  const productCardContentsCollection =
    db.collection<ProductCardContentModel>(COL_PRODUCT_CARD_CONTENTS);
  const { props } = await getConsoleInitialData({ context });

  if (!props || !productId || !companyId || !props.initialData.configs.useUniqueConstructor) {
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

  const productAggregation = await productsCollection
    .aggregate([
      {
        $match: {
          _id: new ObjectId(`${productId}`),
        },
      },
      {
        $project: {
          attributes: false,
        },
      },
    ])
    .toArray();
  const product = productAggregation[0];

  if (!product) {
    return {
      notFound: true,
    };
  }

  let cardContent = await productCardContentsCollection.findOne({
    productId: product._id,
    companySlug: company.slug,
  });

  if (!cardContent) {
    cardContent = {
      _id: new ObjectId(),
      productId: product._id,
      productSlug: product.slug,
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
      product: castDbData(product),
      cardContent: castDbData(cardContent),
    },
  };
};

export default Product;
