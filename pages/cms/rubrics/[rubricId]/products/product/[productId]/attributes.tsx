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
} from 'config/common';
import { ATTRIBUTE_OPTIONS_MODAL } from 'config/modalVariants';
import { COL_ATTRIBUTES_GROUPS } from 'db/collectionNames';
import { rubricAttributesGroupAttributesPipeline } from 'db/dao/constantPipelines';
import { ObjectIdModel } from 'db/dbModels';
import { getDatabase } from 'db/mongodb';
import {
  OptionInterface,
  ProductAttributeInterface,
  ProductInterface,
  RubricInterface,
  AttributesGroupInterface,
  ProductAttributesGroupInterface,
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

const attributesGroupClassName = 'relative mb-16';
const attributesGroupTitleClassName = 'mb-4 font-medium text-xl';
const selectsListClassName = 'grid sm:grid-cols-2 md:grid-cols-3 gap-x-8';

const ProductAttributes: React.FC<ProductAttributesInterface> = ({ product, rubric }) => {
  const { showModal, onCompleteCallback, onErrorCallback, showLoading } = useMutationCallbacks({
    // withModal: true,
    reload: true,
  });
  const { attributesGroups } = product;

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
        name: `${product.cardTitle}`,
        href: `${ROUTE_CMS}/rubrics/${rubric._id}/products/product/${product._id}`,
      },
    ],
  };

  return (
    <CmsProductLayout product={product} breadcrumbs={breadcrumbs}>
      <Inner testId={'product-attributes-list'}>
        {(attributesGroups || []).map((attributesGroup) => {
          const {
            stringAttributesAST,
            numberAttributesAST,
            selectAttributesAST,
            multipleSelectAttributesAST,
          } = attributesGroup;
          return (
            <div className={attributesGroupClassName} key={`${attributesGroup._id}`}>
              <div className={attributesGroupTitleClassName}>{attributesGroup.name}</div>
              {selectAttributesAST && selectAttributesAST.length > 0 ? (
                <div>
                  <div className={selectsListClassName}>
                    {(selectAttributesAST || []).map((attribute) => {
                      return (
                        <FakeInput
                          value={`${attribute.readableValue || ''}`}
                          label={`${attribute.name}`}
                          key={`${attribute.attributeId}`}
                          testId={`${attribute.name}-attribute`}
                          onClear={
                            attribute.readableValue
                              ? () => clearSelectFieldHandler(attribute)
                              : undefined
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

              {multipleSelectAttributesAST && multipleSelectAttributesAST.length > 0 ? (
                <div>
                  <div className={selectsListClassName}>
                    {(multipleSelectAttributesAST || []).map((attribute) => {
                      return (
                        <FakeInput
                          value={`${attribute.readableValue || ''}`}
                          label={`${attribute.name}`}
                          key={`${attribute.attributeId}`}
                          testId={`${attribute.name}-attribute`}
                          onClear={
                            attribute.readableValue
                              ? () => clearSelectFieldHandler(attribute)
                              : undefined
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

              {numberAttributesAST && numberAttributesAST.length > 0 ? (
                <Formik
                  initialValues={{ attributes: numberAttributesAST }}
                  onSubmit={(values) => {
                    showLoading();
                    updateProductNumberAttributeMutation({
                      variables: {
                        input: {
                          productId: product._id,
                          attributes: (values.attributes || []).map((attribute) => {
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
                        <div>
                          <div className='relative'>
                            <div className={selectsListClassName}>
                              {(numberAttributesAST || []).map((attribute, index) => {
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

              {stringAttributesAST && stringAttributesAST.length > 0 ? (
                <Formik
                  initialValues={{ attributes: stringAttributesAST }}
                  onSubmit={(values) => {
                    showLoading();
                    updateProductTextAttributeMutation({
                      variables: {
                        input: {
                          productId: product._id,
                          attributes: (values.attributes || []).map((attribute) => {
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
                        <div>
                          <div className='relative'>
                            {(stringAttributesAST || []).map((attribute, index) => {
                              return (
                                <FormikTranslationsInput
                                  variant={'textarea'}
                                  className='h-[15rem]'
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
            </div>
          );
        })}
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
  const attributesGroupsCollection = db.collection<AttributesGroupInterface>(COL_ATTRIBUTES_GROUPS);
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

  const { product, rubric, categoriesList } = payload;
  const attributesGroupIds: ObjectIdModel[] = rubric.attributesGroupIds;
  categoriesList.forEach((category) => {
    category.attributesGroupIds.forEach((_id) => {
      attributesGroupIds.push(_id);
    });
  });

  const rubricAttributes = await attributesGroupsCollection
    .aggregate<AttributesGroupInterface>([
      {
        $match: {
          _id: {
            $in: attributesGroupIds,
          },
        },
      },
      // get attributes
      ...rubricAttributesGroupAttributesPipeline,
    ])
    .toArray();

  // Cast rubric attributes to product attributes
  const { attributes, ...restProduct } = product;

  const productAttributesGroups: ProductAttributesGroupInterface[] = [];
  rubricAttributes.forEach((group) => {
    const groupAttributes: ProductAttributeInterface[] = [];

    const stringAttributesAST: ProductAttributeInterface[] = [];
    const numberAttributesAST: ProductAttributeInterface[] = [];
    const multipleSelectAttributesAST: ProductAttributeInterface[] = [];
    const selectAttributesAST: ProductAttributeInterface[] = [];

    (group.attributes || []).forEach((attribute) => {
      const currentProductAttribute = (attributes || []).find(({ attributeId }) => {
        return attributeId.equals(attribute._id);
      });

      if (currentProductAttribute) {
        const readableValue = getAttributeReadableValue({
          productAttribute: currentProductAttribute,
          locale: props.sessionLocale,
        });

        groupAttributes.push({
          ...currentProductAttribute,
          readableValue: readableValue || '',
          name: getFieldStringLocale(currentProductAttribute.nameI18n, props.sessionLocale),
        });
      } else {
        const newProductAttribute: ProductAttributeInterface = {
          ...attribute,
          _id: new ObjectId(),
          name: getFieldStringLocale(attribute.nameI18n, props.sessionLocale),
          rubricId: rubric._id,
          rubricSlug: rubric.slug,
          attributeId: attribute._id,
          productId: product._id,
          productSlug: product.slug,
          selectedOptionsIds: [],
          selectedOptionsSlugs: [],
          number: undefined,
          textI18n: {},
          showAsBreadcrumb: false,
          showInCard: true,
        };

        groupAttributes.push(newProductAttribute);
      }
    });

    groupAttributes.forEach((productAttribute) => {
      const variant = productAttribute.variant;

      if (variant === ATTRIBUTE_VARIANT_STRING) {
        stringAttributesAST.push(productAttribute);
      }

      if (variant === ATTRIBUTE_VARIANT_NUMBER) {
        numberAttributesAST.push(productAttribute);
      }

      if (variant === ATTRIBUTE_VARIANT_MULTIPLE_SELECT) {
        multipleSelectAttributesAST.push(productAttribute);
      }

      if (variant === ATTRIBUTE_VARIANT_SELECT) {
        selectAttributesAST.push(productAttribute);
      }
    });

    const productAttributesGroup: ProductAttributesGroupInterface = {
      ...group,
      name: getFieldStringLocale(group.nameI18n),
      attributes: [],
      stringAttributesAST: sortByName(stringAttributesAST),
      numberAttributesAST: sortByName(numberAttributesAST),
      multipleSelectAttributesAST: sortByName(multipleSelectAttributesAST),
      selectAttributesAST: sortByName(selectAttributesAST),
    };

    productAttributesGroups.push(productAttributesGroup);
  });

  const finalProduct: ProductInterface = {
    ...restProduct,
    attributesGroups: sortByName(productAttributesGroups),
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
