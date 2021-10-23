import Accordion from 'components/Accordion';
import Button from 'components/Button';
import Inner from 'components/Inner';
import PageEditor from 'components/PageEditor';
import { DEFAULT_CITY, PAGE_EDITOR_DEFAULT_VALUE_STRING, ROUTE_CMS } from 'config/common';
import { useConfigContext } from 'context/configContext';
import { COL_COMPANIES, COL_PRODUCT_CARD_CONTENTS } from 'db/collectionNames';
import { ProductCardContentModel } from 'db/dbModels';
import { getDatabase } from 'db/mongodb';
import { CompanyInterface, ProductInterface, RubricInterface } from 'db/uiInterfaces';
import { Form, Formik } from 'formik';
import {
  UpdateProductCardContentInput,
  useUpdateProductCardContentMutation,
} from 'generated/apolloComponents';
import useMutationCallbacks from 'hooks/useMutationCallbacks';
import { AppContentWrapperBreadCrumbs } from 'layout/AppContentWrapper';
import CmsProductLayout from 'layout/cms/CmsProductLayout';
import { getConstructorDefaultValue } from 'lib/constructorUtils';
import { getCmsProduct } from 'lib/productUtils';
import { get } from 'lodash';
import { ObjectId } from 'mongodb';
import { PagePropsInterface } from 'pages/_app';
import * as React from 'react';
import CmsLayout from 'layout/cms/CmsLayout';
import { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from 'next';
import { castDbData, getAppInitialData } from 'lib/ssrUtils';

interface ProductAttributesInterface {
  product: ProductInterface;
  rubric: RubricInterface;
  cardContent: ProductCardContentModel;
  currentCompany?: CompanyInterface | null;
}

const ProductAttributes: React.FC<ProductAttributesInterface> = ({
  product,
  rubric,
  cardContent,
  currentCompany,
}) => {
  const { cities } = useConfigContext();
  const { onCompleteCallback, onErrorCallback, showLoading } = useMutationCallbacks({
    reload: true,
  });
  const [updateProductCardContentMutation] = useUpdateProductCardContentMutation({
    onCompleted: (data) => onCompleteCallback(data.updateProductCardContent),
    onError: onErrorCallback,
  });

  const basePath = `${ROUTE_CMS}/companies/${currentCompany?._id}`;
  const breadcrumbs: AppContentWrapperBreadCrumbs = {
    currentPageName: 'Контент карточки',
    config: [
      {
        name: 'Компании',
        href: `${ROUTE_CMS}/companies`,
      },
      {
        name: `${currentCompany?.name}`,
        href: basePath,
      },
      {
        name: `Рубрикатор`,
        href: `${basePath}/rubrics`,
      },
      {
        name: `${rubric.name}`,
        href: `${basePath}/rubrics/${rubric._id}`,
      },
      {
        name: `Товары`,
        href: `${basePath}/rubrics/${rubric._id}/products/${rubric._id}`,
      },
      {
        name: `${product.cardTitle}`,
        href: `${basePath}/rubrics/${rubric._id}/products/product/${product._id}`,
      },
    ],
  };

  const initialValues: UpdateProductCardContentInput = cardContent;

  return (
    <CmsProductLayout
      hideAssetsPath
      hideAttributesPath
      hideBrandPath
      hideCategoriesPath
      hideConnectionsPath
      product={product}
      basePath={basePath}
      breadcrumbs={breadcrumbs}
    >
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
    </CmsProductLayout>
  );
};

interface ProductPageInterface extends PagePropsInterface, ProductAttributesInterface {}

const Product: NextPage<ProductPageInterface> = ({ pageUrls, ...props }) => {
  return (
    <CmsLayout pageUrls={pageUrls}>
      <ProductAttributes {...props} />
    </CmsLayout>
  );
};

export const getServerSideProps = async (
  context: GetServerSidePropsContext,
): Promise<GetServerSidePropsResult<ProductPageInterface>> => {
  const { query } = context;
  const { productId, rubricId } = query;
  const { db } = await getDatabase();
  const productCardContentsCollection =
    db.collection<ProductCardContentModel>(COL_PRODUCT_CARD_CONTENTS);
  const companiesCollection = db.collection<CompanyInterface>(COL_COMPANIES);
  const { props } = await getAppInitialData({ context });
  if (!props || !productId || !rubricId || !query.companyId) {
    return {
      notFound: true,
    };
  }

  // get company
  const companyId = new ObjectId(`${query.companyId}`);
  const companyAggregationResult = await companiesCollection
    .aggregate([
      {
        $match: {
          _id: companyId,
        },
      },
    ])
    .toArray();
  const companyResult = companyAggregationResult[0];
  if (!companyResult) {
    return {
      notFound: true,
    };
  }
  const companySlug = companyResult.slug;

  const payload = await getCmsProduct({
    locale: props.sessionLocale,
    productId: `${productId}`,
    companySlug,
  });

  if (!payload) {
    return {
      notFound: true,
    };
  }

  const { product, rubric } = payload;

  let cardContent = await productCardContentsCollection.findOne({
    productId: product._id,
    companySlug,
  });

  if (!cardContent) {
    cardContent = {
      _id: new ObjectId(),
      productId: product._id,
      productSlug: product.slug,
      companySlug,
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
      rubric: castDbData(rubric),
      cardContent: castDbData(cardContent),
      currentCompany: castDbData(companyResult),
    },
  };
};

export default Product;
