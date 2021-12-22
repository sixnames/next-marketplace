import { FILTER_SEPARATOR } from '../../../config/common';
import { getFieldStringLocale } from '../../../lib/i18n';
import { generateCardTitle, generateSnippetTitle } from '../../../lib/titleUtils';
import { getTreeFromList } from '../../../lib/treeUtils';
import {
  AttributeInterface,
  BrandInterface,
  CategoryInterface,
  ProductAttributeInterface,
  ProductVariantInterface,
  ProductFacetInterface,
  RubricInterface,
} from '../../uiInterfaces';
import { castProductConnectionForUI } from './castProductConnectionForUI';

interface CastProductForUI {
  product: ProductFacetInterface;
  attributes?: AttributeInterface[] | null;
  brands?: BrandInterface[] | null;
  categories?: CategoryInterface[] | null;
  rubric?: RubricInterface | null;
  getSnippetTitle?: boolean;
  getCardTitle?: boolean;
  locale: string;
}

export function castProductForUI({
  product,
  attributes,
  brands,
  categories,
  getCardTitle,
  rubric,
  getSnippetTitle,
  locale,
}: CastProductForUI): ProductFacetInterface {
  const productRubric = product.rubric || rubric;

  // product attributes
  const productAttributes = (product.attributes || []).reduce(
    (acc: ProductAttributeInterface[], attribute) => {
      const existingAttribute = (attributes || []).find(({ _id }) => {
        return _id.equals(attribute.attributeId);
      });
      if (!existingAttribute) {
        return acc;
      }

      const optionSlugs = product.selectedOptionsSlugs.reduce((acc: string[], selectedSlug) => {
        const splittedOption = selectedSlug.split(FILTER_SEPARATOR);
        const attributeSlug = splittedOption[0];
        const optionSlug = splittedOption[1];
        if (!optionSlug || attributeSlug !== existingAttribute.slug) {
          return acc;
        }
        return [...acc, optionSlug];
      }, []);

      const options = (existingAttribute.options || []).filter(({ slug }) => {
        return optionSlugs.includes(slug);
      });

      const metric = existingAttribute.metric
        ? {
            ...existingAttribute.metric,
            name: getFieldStringLocale(existingAttribute.metric.nameI18n, locale),
          }
        : null;

      const productAttribute: ProductAttributeInterface = {
        ...attribute,
        attribute: {
          ...existingAttribute,
          name: getFieldStringLocale(existingAttribute.nameI18n, locale),
          metric,
          options: getTreeFromList({
            list: options,
            childrenFieldName: 'options',
            locale,
            gender: product.gender,
          }),
        },
      };
      return [...acc, productAttribute];
    },
    [],
  );

  // product categories
  const initialProductCategories = (categories || []).filter(({ slug }) => {
    return product.selectedOptionsSlugs.includes(slug);
  });
  const productCategories = getTreeFromList({
    list: initialProductCategories,
    childrenFieldName: 'categories',
    locale,
  });

  // product brand
  const initialProductBrand = product.brandSlug
    ? (brands || []).find(({ itemId }) => {
        return itemId === product.brandSlug;
      })
    : null;
  const productBrand = initialProductBrand
    ? {
        ...initialProductBrand,
        collections: (initialProductBrand.collections || []).filter((collection) => {
          return collection.itemId === product.brandCollectionSlug;
        }),
      }
    : null;

  // connections
  const connections = (product.connections || []).reduce(
    (acc: ProductVariantInterface[], connection) => {
      const castedConnection = castProductConnectionForUI({
        connection,
        locale,
      });

      if (!castedConnection) {
        return acc;
      }

      return [...acc, castedConnection];
    },
    [],
  );

  // snippet title
  let snippetTitle: string | null = null;
  if (getSnippetTitle) {
    snippetTitle = generateSnippetTitle({
      locale,
      brand: productBrand,
      rubricName: getFieldStringLocale(productRubric?.nameI18n, locale),
      showRubricNameInProductTitle: productRubric?.showRubricNameInProductTitle,
      showCategoryInProductTitle: productRubric?.showCategoryInProductTitle,
      attributes: productAttributes,
      categories: productCategories,
      titleCategorySlugs: product.titleCategoriesSlugs,
      originalName: product.originalName,
      defaultGender: product.gender,
    });
  }

  // card title
  let cardTitle: string | null = null;
  if (getCardTitle) {
    cardTitle = generateCardTitle({
      locale,
      brand: productBrand,
      rubricName: getFieldStringLocale(productRubric?.nameI18n, locale),
      showRubricNameInProductTitle: productRubric?.showRubricNameInProductTitle,
      showCategoryInProductTitle: productRubric?.showCategoryInProductTitle,
      attributes: productAttributes,
      categories: productCategories,
      titleCategorySlugs: product.titleCategoriesSlugs,
      originalName: product.originalName,
      defaultGender: product.gender,
    });
  }

  return {
    ...product,
    name: getFieldStringLocale(product?.nameI18n, locale),
    connections,
    attributes: productAttributes,
    brand: initialProductBrand,
    categories: productCategories,
    snippetTitle,
    cardTitle,
  };
}
