import {
  ASSETS_DIST_PRODUCTS,
  ATTRIBUTE_VARIANT_MULTIPLE_SELECT,
  ATTRIBUTE_VARIANT_SELECT,
  FILTER_SEPARATOR,
  CATEGORY_SLUG_PREFIX,
  ID_COUNTER_DIGITS,
  GENDER_IT,
  ATTRIBUTE_VARIANT_NUMBER,
  ATTRIBUTE_VARIANT_STRING,
  DEFAULT_CURRENCY,
  DEFAULT_LOCALE,
} from '../../../config/common';
import {
  ObjectIdModel,
  OptionModel,
  ProductSummaryModel,
  ProductAttributeModel,
  CategoryModel,
} from '../../../db/dbModels';
import { getObjectId } from 'mongo-seeding';
import { OptionInterface, ProductAttributeInterface } from '../../../db/uiInterfaces';
import { getFieldStringLocale } from '../../../lib/i18n';
import {
  generateCardTitle,
  GenerateCardTitleInterface,
  generateSnippetTitle,
} from '../../../lib/titleUtils';
import { getTreeFromList } from '../../../lib/treeUtils';
const addZero = require('add-zero');
import rubrics from '../rubrics/rubrics';
import rubricVariants from '../rubricVariants/rubricVariants';
import options from '../options/options';
import attributes from '../attributes/attributes';
import manufacturers from '../manufacturers/manufacturers';
import brands from '../brands/brands';
import brandCollections from '../brandCollections/brandCollections';
import categories from '../categories/categories';
import { getAttributeReadableValueLocales } from '../../../lib/productAttributesUtils';

const attributeText = `Lorem ipsum dolor sit amet, consectetur adipisicing elit. Animi debitis eligendi eum, excepturi iure libero molestias quas quis ratione reiciendis sed sequi sint sit! Architecto minus modi officia provident voluptates.`;

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

const maxProductsCount = 70;
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
  rubricCategories.forEach((category) => {
    category.attributesGroupIds.forEach((_id) => {
      const exist = attributesGroupIds.some((groupId) => groupId.equals(_id));
      if (!exist) {
        attributesGroupIds.push(_id);
      }
    });
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

  for (let i = 1; i <= maxProductsCount; i = i + 1) {
    counter = counter + 1;
    const gender = GENDER_IT;
    const selectedAttributesIds: ObjectIdModel[] = [];
    const selectedOptionsSlugs: string[] = [];
    const titleCategoriesSlugs: string[] = [];
    const productAttributes: ProductAttributeModel[] = [];
    const itemId: string = addZero(counter, ID_COUNTER_DIGITS);
    const name = `${rubricSlug.toUpperCase()} ${itemId}`;

    // attributes
    rubricAttributes.forEach((attribute) => {
      if (attribute.showInCatalogueFilter) {
        selectedAttributesIds.push(attribute._id);

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
        const productAttribute: ProductAttributeModel = {
          readableValueI18n: {},
          selectedOptionsIds: [],
          selectedOptionsSlugs: [],
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
              const optionSlug = `${attribute.slug}${FILTER_SEPARATOR}${slug}`;
              productAttribute.selectedOptionsIds.push(_id);
              productAttribute.selectedOptionsSlugs.push(optionSlug);
              selectedOptionsSlugs.push(optionSlug);
            });
          }
          const readableValueI18n = getAttributeReadableValueLocales({
            gender,
            productAttribute: {
              ...productAttribute,
              attribute: {
                ...attribute,
                options,
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
            productAttribute.selectedOptionsIds.push(selectedOption._id);
            productAttribute.selectedOptionsSlugs.push(optionSlug);
            selectedOptionsSlugs.push(optionSlug);
          }
          const readableValueI18n = getAttributeReadableValueLocales({
            gender,
            productAttribute: {
              ...productAttribute,
              attribute: {
                ...attribute,
                options: [selectedOption],
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
            productAttribute.selectedOptionsIds.push(selectedOption._id);
            productAttribute.selectedOptionsSlugs.push(optionSlug);
            selectedOptionsSlugs.push(optionSlug);
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
            productAttribute.selectedOptionsIds.push(nextSelectedOption._id);
            productAttribute.selectedOptionsSlugs.push(optionSlug);
            selectedOptionsSlugs.push(optionSlug);
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
                options,
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
        titleCategoriesSlugs.push(categorySlug);
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

    const titleAttributes = productAttributes.reduce(
      (acc: ProductAttributeInterface[], productAttribute) => {
        const attribute = attributes.find(({ _id }) => _id.equals(productAttribute.attributeId));
        if (!attribute) {
          return acc;
        }
        const attributeOptions = options.filter((option) => {
          return productAttribute.selectedOptionsIds.some((_id) => {
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
      titleCategoriesSlugs: categorySlugs,
      showCategoryInProductTitle: true,
      showRubricNameInProductTitle: true,
    };

    const snippetTitle = generateSnippetTitle(titleConfig);

    const cardTitle = generateCardTitle(titleConfig);

    const summary: ProductSummaryModel = {
      _id: getObjectId(`${rubricSlug} ${itemId}`),
      active: true,
      itemId,
      slug: itemId,
      barcode: [itemId, `${itemId}9999`],
      rubricSlug: rubric.slug,
      rubricId: rubric._id,
      originalName: name,
      categorySlugs,
      brandSlug: brand?.itemId,
      brandCollectionSlug: brandCollection?.itemId,
      manufacturerSlug: manufacturer?.itemId,
      allowDelivery: Boolean(rubricVariant.allowDelivery),
      mainImage: `/assets/${ASSETS_DIST_PRODUCTS}/${itemId}/${itemId}-0.png`,
      assets: [`/assets/${ASSETS_DIST_PRODUCTS}/${itemId}/${itemId}-0.png`],
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
      filterSlugs: selectedOptionsSlugs,
      titleCategoriesSlugs,
      selectedAttributesIds,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    rubricProducts.push(summary);
  }

  return [...acc, ...rubricProducts];
}, []);

// @ts-ignore
export = productSummaries;
