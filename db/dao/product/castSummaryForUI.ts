import { FILTER_SEPARATOR } from '../../../config/common';
import { getFieldStringLocale } from '../../../lib/i18n';
import { getTreeFromList } from '../../../lib/treeUtils';
import {
  AttributeInterface,
  BrandInterface,
  CategoryInterface,
  ProductAttributeInterface,
  ProductVariantInterface,
  ProductSummaryInterface,
} from '../../uiInterfaces';
import { castProductVariantForUI } from './castProductVariantForUI';

interface CastProductForUI {
  summary: ProductSummaryInterface;
  attributes?: AttributeInterface[] | null;
  brands?: BrandInterface[] | null;
  categories?: CategoryInterface[] | null;
  locale: string;
}

export function castSummaryForUI({
  summary,
  attributes,
  brands,
  categories,
  locale,
}: CastProductForUI): ProductSummaryInterface {
  // product attributes
  const productAttributes = (summary.attributes || []).reduce(
    (acc: ProductAttributeInterface[], attribute) => {
      const existingAttribute = (attributes || []).find(({ _id }) => {
        return _id.equals(attribute.attributeId);
      });
      if (!existingAttribute) {
        return acc;
      }

      const optionSlugs = summary.filterSlugs.reduce((acc: string[], selectedSlug) => {
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
            gender: summary.gender,
          }),
        },
      };
      return [...acc, productAttribute];
    },
    [],
  );

  // product categories
  const initialProductCategories = (categories || []).filter(({ slug }) => {
    return summary.categorySlugs.includes(slug);
  });
  const productCategories = getTreeFromList({
    list: initialProductCategories,
    childrenFieldName: 'categories',
    locale,
  });

  // product brand
  const initialProductBrand = summary.brandSlug
    ? (brands || []).find(({ itemId }) => {
        return itemId === summary.brandSlug;
      })
    : null;

  // variants
  const variants = summary.variants.reduce((acc: ProductVariantInterface[], connection) => {
    const castedConnection = castProductVariantForUI({
      variant: connection,
      locale,
    });

    if (!castedConnection) {
      return acc;
    }

    return [...acc, castedConnection];
  }, []);

  // shop products
  const prices: number[] = [];
  (summary.shopProducts || []).forEach(({ price }) => {
    prices.push(price);
  });
  const sortedPrices = prices.sort((a, b) => {
    return a - b;
  });
  const minPrice = sortedPrices[0];
  const maxPrice = sortedPrices[sortedPrices.length - 1];

  // snippet title
  const snippetTitle = getFieldStringLocale(summary.snippetTitleI18n, locale);
  const cardTitle = getFieldStringLocale(summary.cardTitleI18n, locale);

  return {
    ...summary,
    variants,
    minPrice,
    maxPrice,
    attributes: productAttributes,
    brand: initialProductBrand,
    categories: productCategories,
    snippetTitle,
    cardTitle,
  };
}
