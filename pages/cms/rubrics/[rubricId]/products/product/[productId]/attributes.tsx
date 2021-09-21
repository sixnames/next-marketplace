import Button from 'components/Button';
import FixedButtons from 'components/FixedButtons';
import FakeInput from 'components/FormElements/Input/FakeInput';
import FormikInput from 'components/FormElements/Input/FormikInput';
import FormikTranslationsInput from 'components/FormElements/Input/FormikTranslationsInput';
import Inner from 'components/Inner';
import { AttributeOptionsModalInterface } from 'components/Modal/AttributeOptionsModal';
import { OptionsModalOptionInterface } from 'components/Modal/OptionsModal';
import {
  ATTRIBUTE_VARIANT_MULTIPLE_SELECT,
  ATTRIBUTE_VARIANT_NUMBER,
  ATTRIBUTE_VARIANT_SELECT,
  ATTRIBUTE_VARIANT_STRING,
  ROUTE_CMS,
  SORT_ASC,
  SORT_DESC,
} from 'config/common';
import { getConstantTranslation } from 'config/constantTranslations';
import { ATTRIBUTE_OPTIONS_MODAL } from 'config/modalVariants';
import { COL_RUBRIC_ATTRIBUTES } from 'db/collectionNames';
import { getDatabase } from 'db/mongodb';
import {
  OptionInterface,
  ProductAttributeInterface,
  ProductAttributesGroupASTInterface,
  ProductInterface,
  RubricAttributeInterface,
  RubricAttributesGroupASTInterface,
  RubricInterface,
} from 'db/uiInterfaces';
import {
  useUpdateProductNumberAttributeMutation,
  useUpdateProductSelectAttributeMutation,
  useUpdateProductTextAttributeMutation,
} from 'generated/apolloComponents';
import useMutationCallbacks from 'hooks/useMutationCallbacks';
import { AppContentWrapperBreadCrumbs } from 'layout/AppContentWrapper';
import CmsProductLayout from 'layout/CmsLayout/CmsProductLayout';
import { getFieldStringLocale } from 'lib/i18n';
import { noNaN } from 'lib/numbers';
import { sortByName } from 'lib/optionsUtils';
import { getAttributeReadableValue } from 'lib/productAttributesUtils';
import { getCmsProduct } from 'lib/productUtils';
import { ObjectId } from 'mongodb';
import { useRouter } from 'next/router';
import { PagePropsInterface } from 'pages/_app';
import * as React from 'react';
import CmsLayout from 'layout/CmsLayout/CmsLayout';
import { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from 'next';
import { castDbData, getAppInitialData } from 'lib/ssrUtils';
import { Form, Formik } from 'formik';

function castSelectedOptions(option: OptionInterface): OptionsModalOptionInterface {
  return {
    _id: option._id,
    slug: option.slug,
    name: `${option.name}`,
    options: (option.options || []).map(castSelectedOptions),
  };
}

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
                            notShowAsAlphabet: attribute.notShowAsAlphabet,
                            initiallySelectedOptions: (attribute.options || []).map(
                              castSelectedOptions,
                            ),
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
                            notShowAsAlphabet: attribute.notShowAsAlphabet,
                            initiallySelectedOptions: (attribute.options || []).map(
                              castSelectedOptions,
                            ),
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
  const rubricAttributesCollection = db.collection<RubricAttributeInterface>(COL_RUBRIC_ATTRIBUTES);
  const { props } = await getAppInitialData({ context });
  if (!props || !productId || !rubricId) {
    return {
      notFound: true,
    };
  }

  const payload = await getCmsProduct({
    locale: props.sessionLocale,
    productId: `${productId}`,
  });

  if (!payload) {
    return {
      notFound: true,
    };
  }

  const { product, rubric } = payload;

  // Get rubric and categories attributes
  const rubricAttributesCommonPipeline = [
    {
      $sort: {
        variant: SORT_DESC,
        [`nameI18n.${props.sessionLocale}`]: SORT_ASC,
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
  ];

  const rubricAttributesAST = await rubricAttributesCollection
    .aggregate<RubricAttributesGroupASTInterface>([
      {
        $match: {
          rubricId: rubric._id,
          categoryId: null,
        },
      },
      ...rubricAttributesCommonPipeline,
    ])
    .toArray();

  const categoryAttributesAST = await rubricAttributesCollection
    .aggregate<RubricAttributesGroupASTInterface>([
      {
        $match: {
          rubricId: rubric._id,
          categorySlug: {
            $in: product.selectedOptionsSlugs,
          },
        },
      },
      ...rubricAttributesCommonPipeline,
    ])
    .toArray();

  // Cast rubric attributes to product attributes
  const { attributes, ...restProduct } = product;
  let stringAttributesAST: ProductAttributesGroupASTInterface | null = null;
  let numberAttributesAST: ProductAttributesGroupASTInterface | null = null;
  let multipleSelectAttributesAST: ProductAttributesGroupASTInterface | null = null;
  let selectAttributesAST: ProductAttributesGroupASTInterface | null = null;

  const initialAttributesAST = [...rubricAttributesAST, ...categoryAttributesAST];
  const allAttributesAST = initialAttributesAST.reduce(
    (acc: RubricAttributesGroupASTInterface[], group) => {
      const existingGroup = acc.find(({ _id }) => {
        return _id === group._id;
      });

      if (existingGroup) {
        return [
          ...acc,
          {
            ...existingGroup,
            attributes: [...existingGroup.attributes, ...group.attributes],
          },
        ];
      }

      return [...acc, group];
    },
    [],
  );

  for await (const rubricAttributesASTGroup of allAttributesAST) {
    const variant = rubricAttributesASTGroup._id;
    const astGroup: ProductAttributesGroupASTInterface = {
      _id: variant,
      attributes: [],
    };

    for await (const attributeAST of rubricAttributesASTGroup.attributes) {
      const productAttributes = attributes || [];
      const currentProductAttribute = productAttributes.find(({ attributeId }) => {
        return attributeId.equals(attributeAST.attributeId);
      });
      if (currentProductAttribute) {
        const readableValue = getAttributeReadableValue({
          productAttribute: currentProductAttribute,
          locale: props.sessionLocale,
        });

        astGroup.attributes.push({
          ...currentProductAttribute,
          readableValue: readableValue || '',
          name: getFieldStringLocale(currentProductAttribute.nameI18n, props.sessionLocale),
        });
        continue;
      }

      const newProductAttribute: ProductAttributeInterface = {
        ...attributeAST,
        _id: new ObjectId(),
        name: getFieldStringLocale(attributeAST.nameI18n, props.sessionLocale),
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

    const finalAstGroup = {
      ...astGroup,
      attributes: sortByName(astGroup.attributes),
    };

    if (variant === ATTRIBUTE_VARIANT_STRING) {
      stringAttributesAST = finalAstGroup;
    }

    if (variant === ATTRIBUTE_VARIANT_NUMBER) {
      numberAttributesAST = finalAstGroup;
    }

    if (variant === ATTRIBUTE_VARIANT_MULTIPLE_SELECT) {
      multipleSelectAttributesAST = finalAstGroup;
    }

    if (variant === ATTRIBUTE_VARIANT_SELECT) {
      selectAttributesAST = finalAstGroup;
    }
  }

  const finalProduct: ProductInterface = {
    ...restProduct,
    stringAttributesAST,
    numberAttributesAST,
    multipleSelectAttributesAST,
    selectAttributesAST,
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
