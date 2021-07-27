import Accordion from 'components/Accordion';
import Button from 'components/Button';
import Inner from 'components/Inner';
import PageEditor from 'components/PageEditor';
import { DEFAULT_CITY, PAGE_EDITOR_DEFAULT_VALUE_STRING, ROUTE_CMS } from 'config/common';
import { useConfigContext } from 'context/configContext';
import { COL_PRODUCT_CARD_CONTENTS, COL_PRODUCTS, COL_RUBRICS } from 'db/collectionNames';
import { ProductCardContentModel, ProductModel, RubricModel } from 'db/dbModels';
import { getDatabase } from 'db/mongodb';
import { ProductInterface, RubricInterface } from 'db/uiInterfaces';
import { Form, Formik } from 'formik';
import {
  UpdateProductCardContentInput,
  useUpdateProductCardContentMutation,
} from 'generated/apolloComponents';
import useMutationCallbacks from 'hooks/useMutationCallbacks';
import { AppContentWrapperBreadCrumbs } from 'layout/AppContentWrapper';
import CmsProductLayout from 'layout/CmsLayout/CmsProductLayout';
import { getConstructorDefaultValue } from 'lib/constructorUtils';
import { getFieldStringLocale } from 'lib/i18n';
import { get } from 'lodash';
import { ObjectId } from 'mongodb';
import { PagePropsInterface } from 'pages/_app';
import * as React from 'react';
import CmsLayout from 'layout/CmsLayout/CmsLayout';
import { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from 'next';
import { castDbData, getAppInitialData } from 'lib/ssrUtils';

interface ProductAttributesInterface {
  product: ProductInterface;
  rubric: RubricInterface;
  cardContent: ProductCardContentModel;
}

const ProductAttributes: React.FC<ProductAttributesInterface> = ({
  product,
  rubric,
  cardContent,
}) => {
  const { cities } = useConfigContext();
  const { onCompleteCallback, onErrorCallback, showLoading } = useMutationCallbacks({
    reload: true,
  });
  const [updateProductCardContentMutation] = useUpdateProductCardContentMutation({
    onCompleted: (data) => onCompleteCallback(data.updateProductCardContent),
    onError: onErrorCallback,
  });

  const breadcrumbs: AppContentWrapperBreadCrumbs = {
    currentPageName: 'Контент карточки',
    config: [
      {
        name: 'Рубрикатор',
        href: `${ROUTE_CMS}/rubrics`,
      },
      {
        name: `${rubric.name}`,
        href: `${ROUTE_CMS}/rubrics/${rubric._id}`,
      },
      {
        name: `Товары`,
        href: `${ROUTE_CMS}/rubrics/${rubric._id}/products/${rubric._id}`,
      },
      {
        name: product.originalName,
        href: `${ROUTE_CMS}/rubrics/${rubric._id}/products/product/${product._id}`,
      },
    ],
  };

  const initialValues: UpdateProductCardContentInput = cardContent;

  return (
    <CmsProductLayout product={product} breadcrumbs={breadcrumbs}>
      <Inner testId={'product-card-constructor'}>
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
                              formData.append('productSlug', product.slug);

                              const responseFetch = await fetch('/api/add-card-content-asset', {
                                method: 'POST',
                                body: formData,
                              });
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
    </CmsProductLayout>
  );
};

interface ProductPageInterface extends PagePropsInterface, ProductAttributesInterface {}

const Product: NextPage<ProductPageInterface> = ({ pageUrls, cardContent, product, rubric }) => {
  return (
    <CmsLayout pageUrls={pageUrls}>
      <ProductAttributes product={product} rubric={rubric} cardContent={cardContent} />
    </CmsLayout>
  );
};

export const getServerSideProps = async (
  context: GetServerSidePropsContext,
): Promise<GetServerSidePropsResult<ProductPageInterface>> => {
  const { query } = context;
  const { productId, rubricId } = query;
  const { db } = await getDatabase();
  const productsCollection = db.collection<ProductModel>(COL_PRODUCTS);
  const rubricsCollection = db.collection<RubricModel>(COL_RUBRICS);
  const productCardContentsCollection =
    db.collection<ProductCardContentModel>(COL_PRODUCT_CARD_CONTENTS);
  const { props } = await getAppInitialData({ context });
  if (!props || !productId || !rubricId) {
    return {
      notFound: true,
    };
  }

  const product = await productsCollection.findOne({
    _id: new ObjectId(`${productId}`),
  });
  const initialRubric = await rubricsCollection.findOne({
    _id: new ObjectId(`${rubricId}`),
  });

  if (!product || !initialRubric) {
    return {
      notFound: true,
    };
  }

  const rubric: RubricInterface = {
    ...initialRubric,
    name: getFieldStringLocale(initialRubric.nameI18n, props.sessionLocale),
  };

  let cardContent = await productCardContentsCollection.findOne({
    productId: product._id,
  });

  if (!cardContent) {
    cardContent = {
      _id: new ObjectId(),
      productId: product._id,
      productSlug: product.slug,
      content: {
        [DEFAULT_CITY]: PAGE_EDITOR_DEFAULT_VALUE_STRING,
      },
    };
  }

  return {
    props: {
      ...props,
      product: castDbData(product),
      rubric: castDbData(rubric),
      cardContent: castDbData(cardContent),
    },
  };
};

export default Product;
