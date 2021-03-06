import {
  CategoryModel,
  ObjectIdModel,
  OptionModel,
  ProductSummaryAttributeModel,
  ProductSummaryModel,
  ProductVariantModel,
} from 'db/dbModels';
import { OptionInterface, ProductAttributeInterface } from 'db/uiInterfaces';
import {
  ASSETS_DIST_PRODUCTS,
  ATTRIBUTE_VARIANT_MULTIPLE_SELECT,
  ATTRIBUTE_VARIANT_NUMBER,
  ATTRIBUTE_VARIANT_SELECT,
  ATTRIBUTE_VARIANT_STRING,
  CATEGORY_SLUG_PREFIX,
  DEFAULT_CURRENCY,
  DEFAULT_LOCALE,
  FILTER_SEPARATOR,
  GENDER_IT,
  ID_COUNTER_DIGITS,
} from 'lib/config/common';
import { getFieldStringLocale } from 'lib/i18n';
import { getAttributeReadableValueLocales } from 'lib/productAttributesUtils';
import {
  generateCardTitle,
  GenerateCardTitleInterface,
  generateSnippetTitle,
} from 'lib/titleUtils';
import { getTreeFromList } from 'lib/treeUtils';
import { getObjectId } from 'mongo-seeding';
import { ObjectId } from 'mongodb';
import attributes from '../attributes/attributes';
import brandCollections from '../brandCollections/brandCollections';
import brands from '../brands/brands';
import categories from '../categories/categories';
import manufacturers from '../manufacturers/manufacturers';
import options from '../options/options';
import rubrics from '../rubrics/rubrics';
import rubricVariants from '../rubricVariants/rubricVariants';

const addZero = require('add-zero');

const attributeText = `Lorem ipsum dolor sit amet, consectetur adipisicing elit. Animi debitis eligendi eum, excepturi iure libero molestias quas quis ratione reiciendis sed sequi sint sit! Architecto minus modi officia provident voluptates.`;

function getVariantObjectId(attributeSlug: string, rubricSlug: string) {
  return getObjectId(`variant ${attributeSlug} ${rubricSlug}`);
}

const variantAttributesConfig = [
  {
    attributeId: getObjectId(`attribute Объем`),
    attributeSlug: '000007',
  },
  {
    attributeId: getObjectId(`attribute Тип ёмкости`),
    attributeSlug: '000008',
  },
  {
    attributeId: getObjectId(`attribute Год`),
    attributeSlug: '000009',
  },
  {
    attributeId: getObjectId(`attribute Винтаж`),
    attributeSlug: '000011',
  },
  {
    attributeId: getObjectId(`attribute Сахар`),
    attributeSlug: '000012',
  },
  {
    attributeId: getObjectId(`attribute Тип вина`),
    attributeSlug: '000015',
  },
];

function getOptionsTree(option: OptionModel, acc: OptionModel[]): OptionModel[] {
  const resultOptions: OptionModel[] = acc;
  if (option.parentId) {
    const parent = options.find(({ _id }) => {
      return option.parentId && _id.equals(option.parentId);
    });
    if (parent) {
      resultOptions.push(parent);

      if (parent.parentId) {
        return getOptionsTree(parent, resultOptions);
      }
    }
  }

  return resultOptions;
}

const maxSummariesCount = 70;
const manufacturersAttributeSlug = 'manufacturers';
const brandsAttributeSlug = 'brands';
const brandCollectionsAttributeSlug = 'brandCollections';

let counter = 0;

const productSummaries = rubrics.reduce((acc: ProductSummaryModel[], rubric) => {
  const attributesGroupIds = rubric.attributesGroupIds;
  const rubricSlug = rubric.slug;
  const isForCategory = rubric.nameI18n.ru === 'Виски';
  const rubricVariant = rubricVariants.find(({ _id }) => {
    return _id.equals(rubric.variantId);
  });

  if (!rubricVariant) {
    return acc;
  }

  const rubricCategories = categories.filter(({ rubricId }) => {
    return rubricId.equals(rubric._id);
  });

  const rubricAttributes = attributes.filter(({ attributesGroupId }) => {
    return attributesGroupIds.some((_id) => _id.equals(attributesGroupId));
  });

  interface AddedAttributeInterface {
    attributeSlug: string;
    optionIndex: number;
  }

  let addedAttributes: AddedAttributeInterface[] = [];
  const rubricProducts: ProductSummaryModel[] = [];
  const allVariants: ProductVariantModel[] = [];

  interface GetAddedAttributeInterface {
    attributeSlug: string;
  }

  function getAddedAttributeOptionIndex({ attributeSlug }: GetAddedAttributeInterface): number {
    const addedAttribute = addedAttributes.find((addedAttributeItem) => {
      return addedAttributeItem.attributeSlug === attributeSlug;
    });

    if (addedAttribute) {
      return addedAttribute.optionIndex + 1;
    }
    return 0;
  }

  interface GetNextOptionIndexInterface extends GetAddedAttributeInterface {
    optionsLength: number;
  }

  function getNextOptionIndex({ optionsLength, ...props }: GetNextOptionIndexInterface): number {
    const currentIndex = getAddedAttributeOptionIndex(props);
    if (optionsLength === currentIndex) {
      return 0;
    }

    return currentIndex;
  }

  function setAddedOptionIndex({ attributeSlug, optionIndex }: AddedAttributeInterface) {
    const addedAttributeIndex = addedAttributes.findIndex((addedAttribute) => {
      return addedAttribute.attributeSlug === attributeSlug;
    });

    if (addedAttributeIndex > -1) {
      addedAttributes[addedAttributeIndex] = {
        attributeSlug,
        optionIndex,
      };
    } else {
      addedAttributes.push({
        attributeSlug,
        optionIndex,
      });
    }
  }

  for (let i = 1; i <= maxSummariesCount; i = i + 1) {
    counter = counter + 1;
    const gender = GENDER_IT;
    const attributeIds: ObjectIdModel[] = [];
    const filterSlugs: string[] = [];
    const titleCategorySlugs: string[] = [];
    const productAttributes: ProductSummaryAttributeModel[] = [];
    const itemId: string = addZero(counter, ID_COUNTER_DIGITS);
    const name = `${rubricSlug.toUpperCase()} ${itemId}`;

    // attributes
    rubricAttributes.forEach((attribute) => {
      if (attribute.showInCatalogueFilter) {
        attributeIds.push(attribute._id);

        const attributeOptions = options.filter(({ optionsGroupId }) => {
          return attribute.optionsGroupId && optionsGroupId.equals(attribute.optionsGroupId);
        });

        const textI18n =
          attribute.variant === ATTRIBUTE_VARIANT_STRING
            ? {
                ru: attributeText,
              }
            : undefined;
        const number =
          attribute.variant === ATTRIBUTE_VARIANT_NUMBER
            ? Math.round(Math.random() * 10)
            : undefined;
        const productAttribute: ProductSummaryAttributeModel = {
          _id: new ObjectId(),
          readableValueI18n: {},
          optionIds: [],
          filterSlugs: [],
          attributeId: attribute._id,
          number,
          textI18n,
        };

        // region
        if (attribute.slug === '000006') {
          const randomOptionIndex = getNextOptionIndex({
            optionsLength: attributeOptions.length,
            attributeSlug: attribute.slug,
          });
          setAddedOptionIndex({
            attributeSlug: attribute.slug,
            optionIndex: randomOptionIndex,
          });
          const selectedOption = attributeOptions[randomOptionIndex];
          let options: OptionInterface[] = [];
          if (selectedOption) {
            const regionOptionsTree = getOptionsTree(selectedOption, [selectedOption]);
            options = getTreeFromList({
              list: regionOptionsTree,
              locale: DEFAULT_LOCALE,
              childrenFieldName: 'options',
              gender,
            });
            regionOptionsTree.forEach(({ slug, _id }) => {
              const filterSlug = `${attribute.slug}${FILTER_SEPARATOR}${slug}`;
              productAttribute.optionIds.push(_id);
              productAttribute.filterSlugs.push(filterSlug);
              filterSlugs.push(filterSlug);
            });
          }
          const readableValueI18n = getAttributeReadableValueLocales({
            gender,
            productAttribute: {
              ...productAttribute,
              attribute: {
                ...attribute,
                options: options.filter((option) => option),
              },
            },
          });
          productAttributes.push({ ...productAttribute, readableValueI18n });
          return;
        }

        if (attribute.variant === ATTRIBUTE_VARIANT_SELECT) {
          const randomOptionIndex = getNextOptionIndex({
            optionsLength: attributeOptions.length,
            attributeSlug: attribute.slug,
          });

          setAddedOptionIndex({
            attributeSlug: attribute.slug,
            optionIndex: randomOptionIndex,
          });
          const selectedOption = attributeOptions[randomOptionIndex];
          if (selectedOption) {
            const optionSlug = `${attribute.slug}${FILTER_SEPARATOR}${selectedOption.slug}`;
            productAttribute.optionIds.push(selectedOption._id);
            productAttribute.filterSlugs.push(optionSlug);
            filterSlugs.push(optionSlug);
          }
          const readableValueI18n = getAttributeReadableValueLocales({
            gender,
            productAttribute: {
              ...productAttribute,
              attribute: {
                ...attribute,
                options: selectedOption ? [selectedOption] : [],
              },
            },
          });
          productAttributes.push({ ...productAttribute, readableValueI18n });
          return;
        }

        if (attribute.variant === ATTRIBUTE_VARIANT_MULTIPLE_SELECT) {
          const randomOptionIndex = getNextOptionIndex({
            optionsLength: attributeOptions.length,
            attributeSlug: attribute.slug,
          });
          setAddedOptionIndex({
            attributeSlug: attribute.slug,
            optionIndex: randomOptionIndex,
          });
          const selectedOptions: OptionInterface[] = [];
          const selectedOption = attributeOptions[randomOptionIndex];
          if (selectedOption) {
            selectedOptions.push(selectedOption);
            const optionSlug = `${attribute.slug}${FILTER_SEPARATOR}${selectedOption.slug}`;
            productAttribute.optionIds.push(selectedOption._id);
            productAttribute.filterSlugs.push(optionSlug);
            filterSlugs.push(optionSlug);
          }

          const randomOptionIndexB = getNextOptionIndex({
            optionsLength: attributeOptions.length,
            attributeSlug: attribute.slug,
          });
          setAddedOptionIndex({
            attributeSlug: attribute.slug,
            optionIndex: randomOptionIndexB,
          });
          const nextSelectedOption = attributeOptions[randomOptionIndexB];
          if (nextSelectedOption) {
            selectedOptions.push(nextSelectedOption);
            const optionSlug = `${attribute.slug}${FILTER_SEPARATOR}${nextSelectedOption.slug}`;
            productAttribute.optionIds.push(nextSelectedOption._id);
            productAttribute.filterSlugs.push(optionSlug);
            filterSlugs.push(optionSlug);
          }

          const options = getTreeFromList({
            list: selectedOptions,
            locale: DEFAULT_LOCALE,
            childrenFieldName: 'options',
            gender,
          });
          const readableValueI18n = getAttributeReadableValueLocales({
            gender,
            productAttribute: {
              ...productAttribute,
              attribute: {
                ...attribute,
                options: options.filter((option) => option),
              },
            },
          });
          productAttributes.push({ ...productAttribute, readableValueI18n });
          return;
        }

        const readableValueI18n = getAttributeReadableValueLocales({
          gender,
          productAttribute: {
            ...productAttribute,
            attribute,
          },
        });
        productAttributes.push({ ...productAttribute, readableValueI18n });
      }
    });

    // manufacturer
    const manufacturerIndex = getNextOptionIndex({
      optionsLength: manufacturers.length,
      attributeSlug: manufacturersAttributeSlug,
    });
    setAddedOptionIndex({
      attributeSlug: manufacturersAttributeSlug,
      optionIndex: manufacturerIndex,
    });
    const manufacturer = manufacturers[manufacturerIndex];

    // brand
    const brandIndex = getNextOptionIndex({
      optionsLength: brands.length,
      attributeSlug: brandsAttributeSlug,
    });
    setAddedOptionIndex({
      attributeSlug: brandsAttributeSlug,
      optionIndex: brandIndex,
    });
    const brand = brands[brandIndex];

    // brand collection
    const currentBrandCollections = brandCollections.filter(({ brandSlug }) => {
      return brand && brand.itemId === brandSlug;
    });
    const brandCollectionIndex = getNextOptionIndex({
      optionsLength: currentBrandCollections.length,
      attributeSlug: brandCollectionsAttributeSlug,
    });
    setAddedOptionIndex({
      attributeSlug: brandCollectionsAttributeSlug,
      optionIndex: brandCollectionIndex,
    });
    const brandCollection = currentBrandCollections[brandCollectionIndex];

    // categories
    const titleCategories: CategoryModel[] = [];
    const categorySlugs: string[] = [];
    if (isForCategory) {
      const categoriesSlugsForTitle = [
        `${CATEGORY_SLUG_PREFIX}1`,
        `${CATEGORY_SLUG_PREFIX}2`,
        `${CATEGORY_SLUG_PREFIX}3`,
      ];
      categoriesSlugsForTitle.forEach((categorySlug) => {
        titleCategorySlugs.push(categorySlug);
      });

      const addedCategorySlugs = [
        ...categoriesSlugsForTitle,
        `${CATEGORY_SLUG_PREFIX}5`,
        `${CATEGORY_SLUG_PREFIX}6`,
        `${CATEGORY_SLUG_PREFIX}7`,
        `${CATEGORY_SLUG_PREFIX}8`,
        `${CATEGORY_SLUG_PREFIX}9`,
        `${CATEGORY_SLUG_PREFIX}10`,
      ];
      addedCategorySlugs.forEach((categorySlug) => {
        const category = rubricCategories.find(({ slug }) => {
          return slug === categorySlug;
        });
        if (category) {
          categorySlugs.push(categorySlug);
          titleCategories.push(category);
        }
      });
    }

    // titles
    const titleAttributes = productAttributes.reduce(
      (acc: ProductAttributeInterface[], productAttribute) => {
        const attribute = attributes.find(({ _id }) => _id.equals(productAttribute.attributeId));
        if (!attribute) {
          return acc;
        }
        const attributeOptions = options.filter((option) => {
          return productAttribute.optionIds.some((_id) => {
            return _id.equals(option._id);
          });
        });
        const titleAttribute: ProductAttributeInterface = {
          ...productAttribute,
          attribute: {
            ...attribute,
            options: getTreeFromList({
              list: attributeOptions,
              childrenFieldName: 'options',
              locale: DEFAULT_LOCALE,
              gender,
            }),
          },
        };
        return [...acc, titleAttribute];
      },
      [],
    );

    const titleConfig: GenerateCardTitleInterface = {
      attributes: titleAttributes,
      brand,
      rubricName: getFieldStringLocale(rubric.nameI18n, DEFAULT_LOCALE),
      categories: getTreeFromList({
        list: titleCategories,
        childrenFieldName: 'categories',
        locale: DEFAULT_LOCALE,
        gender,
      }),
      currency: DEFAULT_CURRENCY,
      defaultGender: gender,
      locale: DEFAULT_LOCALE,
      originalName: name,
      titleCategorySlugs: categorySlugs,
      showCategoryInProductTitle: true,
      showRubricNameInProductTitle: true,
    };
    const snippetTitle = generateSnippetTitle(titleConfig);
    const cardTitle = generateCardTitle(titleConfig);
    const summaryId = getObjectId(itemId);

    // variants
    variantAttributesConfig.forEach(({ attributeSlug, attributeId }) => {
      const variantId = getVariantObjectId(attributeSlug, rubric.slug);
      const productAttribute = productAttributes.find((productAttribute) => {
        return productAttribute.attributeId.equals(attributeId);
      });
      if (!productAttribute) {
        return;
      }

      const existingVariantIndex = allVariants.findIndex(({ _id }) => {
        return _id.equals(variantId);
      });

      const filterSlug = productAttribute.filterSlugs[0];
      const optionsSlugArray = `${filterSlug}`.split(FILTER_SEPARATOR);
      const optionsSlug = `${optionsSlugArray[1]}`;
      const option = options.find(({ slug }) => slug === optionsSlug);

      if (option) {
        const variantProductId = getObjectId(`${option.slug}`);

        if (existingVariantIndex < 0) {
          allVariants.push({
            _id: getVariantObjectId(attributeSlug, rubric.slug),
            attributeId,
            attributeSlug,
            products: [
              {
                _id: variantProductId,
                optionId: option._id,
                productSlug: itemId,
                productId: summaryId,
              },
            ],
          });
        } else {
          const existingVariant = allVariants[existingVariantIndex];
          const variantProductAlreadyExist = existingVariant.products.some(({ _id }) => {
            return _id.equals(variantProductId);
          });
          if (variantProductAlreadyExist) {
            return;
          }
          allVariants[existingVariantIndex].products.push({
            _id: variantProductId,
            optionId: option._id,
            productSlug: itemId,
            productId: summaryId,
          });
        }
      }
    });

    const summary: ProductSummaryModel = {
      _id: summaryId,
      active: true,
      itemId,
      slug: itemId,
      barcode: [itemId, `${itemId}9999`],
      rubricSlug: rubric.slug,
      rubricId: rubric._id,
      originalName: name,
      brandSlug: brand?.itemId,
      brandCollectionSlug: brandCollection?.itemId,
      manufacturerSlug: manufacturer?.itemId,
      allowDelivery: Boolean(rubricVariant.allowDelivery),
      mainImage: `/assets/${ASSETS_DIST_PRODUCTS}/${itemId}/${itemId}.png`,
      assets: [`/assets/${ASSETS_DIST_PRODUCTS}/${itemId}/${itemId}.png`],
      gender,
      nameI18n: {
        ru: `${name} RU`,
      },
      descriptionI18n: {
        ru: `Description ${name} RU`,
      },
      attributes: productAttributes,
      snippetTitleI18n: {
        [DEFAULT_LOCALE]: snippetTitle,
      },
      cardTitleI18n: {
        [DEFAULT_LOCALE]: cardTitle,
      },
      filterSlugs: [...filterSlugs, ...categorySlugs],
      titleCategorySlugs,
      attributeIds,
      variants: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    rubricProducts.push(summary);
  }

  // get variant products
  const rubricProductsWithVariants = rubricProducts.map((summary) => {
    const summaryVariants = allVariants.filter((variant) => {
      const exist = variant.products.some(({ productId }) => {
        return productId.equals(summary._id);
      });
      return exist;
    });

    return {
      ...summary,
      variants: summaryVariants,
    };
  });

  return [...acc, ...rubricProductsWithVariants];
}, []);

// @ts-ignore
export = productSummaries;
