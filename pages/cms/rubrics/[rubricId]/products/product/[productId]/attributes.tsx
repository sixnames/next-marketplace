import Button from 'components/Button';
import FixedButtons from 'components/FixedButtons';
import FakeInput from 'components/FormElements/Input/FakeInput';
import FormikInput from 'components/FormElements/Input/FormikInput';
import FormikTranslationsInput from 'components/FormElements/Input/FormikTranslationsInput';
import Inner from 'components/Inner';
import { AttributeOptionsModalInterface } from 'components/Modal/AttributeOptionsModal';
import {
  ATTRIBUTE_VARIANT_MULTIPLE_SELECT,
  ATTRIBUTE_VARIANT_NUMBER,
  ATTRIBUTE_VARIANT_SELECT,
  ATTRIBUTE_VARIANT_STRING,
  LOCALE_NOT_FOUND_FIELD_MESSAGE,
  ROUTE_CMS,
  SORT_DESC,
} from 'config/common';
import { getConstantTranslation } from 'config/constantTranslations';
import { ATTRIBUTE_OPTIONS_MODAL } from 'config/modalVariants';
import {
  COL_OPTIONS,
  COL_PRODUCT_ATTRIBUTES,
  COL_PRODUCTS,
  COL_RUBRIC_ATTRIBUTES,
  COL_RUBRICS,
} from 'db/collectionNames';
import { ProductModel, RubricModel } from 'db/dbModels';
import { getDatabase } from 'db/mongodb';
import {
  ProductAttributeInterface,
  ProductAttributesGroupASTInterface,
  ProductInterface,
  RubricInterface,
} from 'db/uiInterfaces';
import {
  useUpdateProductNumberAttributeMutation,
  useUpdateProductSelectAttributeMutation,
  useUpdateProductTextAttributeMutation,
} from 'generated/apolloComponents';
import useMutationCallbacks from 'hooks/useMutationCallbacks';
import { AppContentWrapperBreadCrumbs } from 'layout/AppLayout/AppContentWrapper';
import CmsProductLayout from 'layout/CmsLayout/CmsProductLayout';
import { getFieldStringLocale } from 'lib/i18n';
import { noNaN } from 'lib/numbers';
import { getAttributeReadableValue } from 'lib/productAttributesUtils';
import { ObjectId } from 'mongodb';
import { useRouter } from 'next/router';
import { PagePropsInterface } from 'pages/_app';
import * as React from 'react';
import CmsLayout from 'layout/CmsLayout/CmsLayout';
import { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from 'next';
import { castDbData, getAppInitialData } from 'lib/ssrUtils';
import { Form, Formik } from 'formik';

interface ProductAttributesInterface {
  product: ProductInterface;
  rubric: RubricInterface;
}

const attributesGroupClassName = 'relative mb-24';
const attributesGroupTitleClassName = 'mb-4 font-medium text-xl';
const selectsListClassName = 'grid sm:grid-cols-2 md:grid-cols-3 gap-x-8';

const ProductAttributes: React.FC<ProductAttributesInterface> = ({ product, rubric }) => {
  const { showModal, onCompleteCallback, onErrorCallback, showLoading } = useMutationCallbacks({
    // withModal: true,
    reload: true,
  });
  const { locale } = useRouter();
  const {
    stringAttributesAST,
    numberAttributesAST,
    selectAttributesAST,
    multipleSelectAttributesAST,
  } = product;

  const [updateProductSelectAttributeMutation] = useUpdateProductSelectAttributeMutation({
    onError: onErrorCallback,
    onCompleted: (data) => onCompleteCallback(data.updateProductSelectAttribute),
  });

  const [updateProductNumberAttributeMutation] = useUpdateProductNumberAttributeMutation({
    onError: onErrorCallback,
    onCompleted: (data) => onCompleteCallback(data.updateProductNumberAttribute),
  });

  const [updateProductTextAttributeMutation] = useUpdateProductTextAttributeMutation({
    onError: onErrorCallback,
    onCompleted: (data) => onCompleteCallback(data.updateProductTextAttribute),
  });

  const clearSelectFieldHandler = React.useCallback(
    (attribute: ProductAttributeInterface) => {
      if (attribute.optionsGroupId) {
        showLoading();
        updateProductSelectAttributeMutation({
          variables: {
            input: {
              productId: product._id,
              attributeId: attribute.attributeId,
              productAttributeId: attribute._id,
              selectedOptionsIds: [],
            },
          },
        }).catch((e) => console.log(e));
      }
    },
    [product._id, showLoading, updateProductSelectAttributeMutation],
  );

  const breadcrumbs: AppContentWrapperBreadCrumbs = {
    currentPageName: 'Атрибуты',
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

  return (
    <CmsProductLayout product={product} breadcrumbs={breadcrumbs}>
      <Inner testId={'product-attributes-list'}>
        {selectAttributesAST ? (
          <div className={attributesGroupClassName}>
            <div className={attributesGroupTitleClassName}>
              {getConstantTranslation(
                `selectsOptions.attributeVariantsPlural.${ATTRIBUTE_VARIANT_SELECT}.${locale}`,
              )}
            </div>

            <div className={selectsListClassName}>
              {selectAttributesAST.attributes.map((attribute) => {
                return (
                  <FakeInput
                    value={`${attribute.readableValue || ''}`}
                    label={`${attribute.name}`}
                    key={`${attribute.attributeId}`}
                    testId={`${attribute.name}-attribute`}
                    onClear={
                      attribute.readableValue ? () => clearSelectFieldHandler(attribute) : undefined
                    }
                    onClick={() => {
                      if (attribute.optionsGroupId) {
                        showModal<AttributeOptionsModalInterface>({
                          variant: ATTRIBUTE_OPTIONS_MODAL,
                          props: {
                            testId: 'select-attribute-options-modal',
                            optionsGroupId: `${attribute.optionsGroupId}`,
                            optionVariant: 'radio',
                            title: `${attribute.name}`,
                            onSubmit: (value) => {
                              showLoading();
                              updateProductSelectAttributeMutation({
                                variables: {
                                  input: {
                                    productId: product._id,
                                    attributeId: attribute.attributeId,
                                    productAttributeId: attribute._id,
                                    selectedOptionsIds: value.map(({ _id }) => _id),
                                  },
                                },
                              }).catch((e) => console.log(e));
                            },
                          },
                        });
                      }
                    }}
                  />
                );
              })}
            </div>
          </div>
        ) : null}

        {multipleSelectAttributesAST ? (
          <div className={attributesGroupClassName}>
            <div className={attributesGroupTitleClassName}>
              {getConstantTranslation(
                `selectsOptions.attributeVariantsPlural.${ATTRIBUTE_VARIANT_MULTIPLE_SELECT}.${locale}`,
              )}
            </div>

            <div className={selectsListClassName}>
              {multipleSelectAttributesAST.attributes.map((attribute) => {
                return (
                  <FakeInput
                    value={`${attribute.readableValue || ''}`}
                    label={`${attribute.name}`}
                    key={`${attribute.attributeId}`}
                    testId={`${attribute.name}-attribute`}
                    onClear={
                      attribute.readableValue ? () => clearSelectFieldHandler(attribute) : undefined
                    }
                    onClick={() => {
                      if (attribute.optionsGroupId) {
                        showModal<AttributeOptionsModalInterface>({
                          variant: ATTRIBUTE_OPTIONS_MODAL,
                          props: {
                            testId: 'multi-select-attribute-options-modal',
                            optionsGroupId: `${attribute.optionsGroupId}`,
                            title: `${attribute.name}`,
                            onSubmit: (value) => {
                              showLoading();
                              updateProductSelectAttributeMutation({
                                variables: {
                                  input: {
                                    productId: product._id,
                                    attributeId: attribute.attributeId,
                                    productAttributeId: attribute._id,
                                    selectedOptionsIds: value.map(({ _id }) => _id),
                                  },
                                },
                              }).catch((e) => console.log(e));
                            },
                          },
                        });
                      }
                    }}
                  />
                );
              })}
            </div>
          </div>
        ) : null}

        {numberAttributesAST ? (
          <Formik
            initialValues={numberAttributesAST}
            onSubmit={(values) => {
              showLoading();
              updateProductNumberAttributeMutation({
                variables: {
                  input: {
                    productId: product._id,
                    attributes: values.attributes.map((attribute) => {
                      return {
                        attributeId: attribute.attributeId,
                        productAttributeId: attribute._id,
                        number:
                          attribute.number && `${attribute.number}`.length > 0
                            ? noNaN(attribute.number)
                            : null,
                      };
                    }),
                  },
                },
              }).catch((e) => console.log(e));
            }}
          >
            {() => {
              return (
                <Form>
                  <div className={attributesGroupClassName}>
                    <div className={attributesGroupTitleClassName}>
                      {getConstantTranslation(
                        `selectsOptions.attributeVariantsPlural.${ATTRIBUTE_VARIANT_NUMBER}.${locale}`,
                      )}
                    </div>

                    <div className='relative'>
                      <div className={selectsListClassName}>
                        {numberAttributesAST.attributes.map((attribute, index) => {
                          return (
                            <FormikInput
                              type={'number'}
                              label={`${attribute.name}`}
                              name={`attributes[${index}].number`}
                              key={`${attribute.attributeId}`}
                              testId={`${attribute.name}-attribute`}
                            />
                          );
                        })}
                      </div>

                      <FixedButtons>
                        <Button testId={'submit-number-attributes'} type={'submit'}>
                          Сохранить
                        </Button>
                      </FixedButtons>
                    </div>
                  </div>
                </Form>
              );
            }}
          </Formik>
        ) : null}

        {stringAttributesAST ? (
          <Formik
            initialValues={stringAttributesAST}
            onSubmit={(values) => {
              showLoading();
              updateProductTextAttributeMutation({
                variables: {
                  input: {
                    productId: product._id,
                    attributes: values.attributes.map((attribute) => {
                      return {
                        attributeId: attribute.attributeId,
                        productAttributeId: attribute._id,
                        textI18n: attribute.textI18n || null,
                      };
                    }),
                  },
                },
              }).catch((e) => console.log(e));
            }}
          >
            {() => {
              return (
                <Form>
                  <div className={attributesGroupClassName}>
                    <div className={attributesGroupTitleClassName}>
                      {getConstantTranslation(
                        `selectsOptions.attributeVariantsPlural.${ATTRIBUTE_VARIANT_STRING}.${locale}`,
                      )}
                    </div>

                    <div className='relative'>
                      {stringAttributesAST.attributes.map((attribute, index) => {
                        return (
                          <FormikTranslationsInput
                            variant={'textarea'}
                            label={`${attribute.name}`}
                            name={`attributes[${index}].textI18n`}
                            key={`${attribute.attributeId}`}
                            testId={`${attribute.name}-attribute`}
                          />
                        );
                      })}

                      <FixedButtons>
                        <Button testId={'submit-text-attributes'} type={'submit'}>
                          Сохранить
                        </Button>
                      </FixedButtons>
                    </div>
                  </div>
                </Form>
              );
            }}
          </Formik>
        ) : null}
      </Inner>
    </CmsProductLayout>
  );
};

interface ProductPageInterface extends PagePropsInterface, ProductAttributesInterface {}

const Product: NextPage<ProductPageInterface> = ({ pageUrls, product, rubric }) => {
  return (
    <CmsLayout pageUrls={pageUrls}>
      <ProductAttributes product={product} rubric={rubric} />
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
  const { props } = await getAppInitialData({ context });
  if (!props || !productId || !rubricId) {
    return {
      notFound: true,
    };
  }

  const productAggregation = await productsCollection
    .aggregate<ProductInterface>([
      {
        $match: {
          _id: new ObjectId(`${productId}`),
        },
      },
      {
        $lookup: {
          from: COL_PRODUCT_ATTRIBUTES,
          as: 'attributes',
          let: { productId: '$_id' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ['$$productId', '$productId'],
                },
              },
            },
            {
              $sort: {
                variant: SORT_DESC,
                _id: SORT_DESC,
              },
            },
            {
              $lookup: {
                from: COL_OPTIONS,
                as: 'options',
                let: {
                  optionsGroupId: '$optionsGroupId',
                  selectedOptionsIds: '$selectedOptionsIds',
                },
                pipeline: [
                  {
                    $match: {
                      $expr: {
                        $and: [
                          {
                            $eq: ['$optionsGroupId', '$$optionsGroupId'],
                          },
                          {
                            $in: ['$_id', '$$selectedOptionsIds'],
                          },
                        ],
                      },
                    },
                  },
                ],
              },
            },
          ],
        },
      },
      {
        $lookup: {
          from: COL_RUBRIC_ATTRIBUTES,
          as: 'rubricAttributesAST',
          let: { rubricId: '$rubricId' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ['$$rubricId', '$rubricId'],
                },
              },
            },
            {
              $sort: {
                variant: SORT_DESC,
                _id: SORT_DESC,
              },
            },
            {
              $group: {
                _id: '$variant',
                attributes: {
                  $push: '$$ROOT',
                },
              },
            },
          ],
        },
      },
    ])
    .toArray();
  const product = productAggregation[0];

  const initialRubric = await rubricsCollection.findOne({
    _id: new ObjectId(`${rubricId}`),
  });

  if (!product || !initialRubric) {
    return {
      notFound: true,
    };
  }

  // Cast rubric attributes to product attributes
  const { attributes, rubricAttributesAST, ...restProduct } = product;
  let stringAttributesAST: ProductAttributesGroupASTInterface | null = null;
  let numberAttributesAST: ProductAttributesGroupASTInterface | null = null;
  let multipleSelectAttributesAST: ProductAttributesGroupASTInterface | null = null;
  let selectAttributesAST: ProductAttributesGroupASTInterface | null = null;

  for await (const rubricAttributesASTGroup of rubricAttributesAST || []) {
    const variant = rubricAttributesASTGroup._id;
    const astGroup: ProductAttributesGroupASTInterface = {
      _id: variant,
      attributes: [],
    };

    for await (const rubricAttributeAST of rubricAttributesASTGroup.attributes) {
      const productAttributes = attributes || [];
      const currentProductAttribute = productAttributes.find(({ attributeId }) => {
        return attributeId.equals(rubricAttributeAST.attributeId);
      });
      if (currentProductAttribute) {
        const readableValue = getAttributeReadableValue({
          productAttribute: currentProductAttribute,
          locale: props.sessionLocale,
        });

        const finalReadableValue =
          readableValue === LOCALE_NOT_FOUND_FIELD_MESSAGE ? '' : readableValue;

        astGroup.attributes.push({
          ...currentProductAttribute,
          readableValue: finalReadableValue,
          name: getFieldStringLocale(currentProductAttribute.nameI18n, props.sessionLocale),
        });
        continue;
      }

      const newProductAttribute: ProductAttributeInterface = {
        ...rubricAttributeAST,
        _id: new ObjectId(),
        name: getFieldStringLocale(rubricAttributeAST.nameI18n, props.sessionLocale),
        productId: product._id,
        productSlug: product.slug,
        selectedOptionsIds: [],
        selectedOptionsSlugs: [],
        number: undefined,
        textI18n: {},
        showAsBreadcrumb: false,
        showInCard: true,
      };

      astGroup.attributes.push(newProductAttribute);
    }

    if (variant === ATTRIBUTE_VARIANT_STRING) {
      stringAttributesAST = astGroup;
    }

    if (variant === ATTRIBUTE_VARIANT_NUMBER) {
      numberAttributesAST = astGroup;
    }

    if (variant === ATTRIBUTE_VARIANT_MULTIPLE_SELECT) {
      multipleSelectAttributesAST = astGroup;
    }

    if (variant === ATTRIBUTE_VARIANT_SELECT) {
      selectAttributesAST = astGroup;
    }
  }

  const finalProduct: ProductInterface = {
    ...restProduct,
    stringAttributesAST,
    numberAttributesAST,
    multipleSelectAttributesAST,
    selectAttributesAST,
  };

  const rubric: RubricInterface = {
    ...initialRubric,
    name: getFieldStringLocale(initialRubric.nameI18n, props.sessionLocale),
  };

  return {
    props: {
      ...props,
      product: castDbData(finalProduct),
      rubric: castDbData(rubric),
    },
  };
};

export default Product;
