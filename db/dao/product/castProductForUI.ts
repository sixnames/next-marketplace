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
  product: ProductSummaryInterface;
  attributes?: AttributeInterface[] | null;
  brands?: BrandInterface[] | null;
  categories?: CategoryInterface[] | null;
  locale: string;
}

export function castProductForUI({
  product,
  attributes,
  brands,
  categories,
  locale,
}: CastProductForUI): ProductSummaryInterface {
  // product attributes
  const productAttributes = (product.attributes || []).reduce(
    (acc: ProductAttributeInterface[], attribute) => {
      const existingAttribute = (attributes || []).find(({ _id }) => {
        return _id.equals(attribute.attributeId);
      });
      if (!existingAttribute) {
        return acc;
      }

      const optionSlugs = product.filterSlugs.reduce((acc: string[], selectedSlug) => {
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
    return product.categorySlugs.includes(slug);
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

  // variants
  const variants = product.variants.reduce((acc: ProductVariantInterface[], connection) => {
    const castedConnection = castProductVariantForUI({
      variant: connection,
      locale,
    });

    if (!castedConnection) {
      return acc;
    }

    return [...acc, castedConnection];
  }, []);

  // snippet title
  const snippetTitle = getFieldStringLocale(product.snippetTitleI18n, locale);
  const cardTitle = getFieldStringLocale(product.cardTitleI18n, locale);

  return {
    ...product,
    variants,
    attributes: productAttributes,
    brand: initialProductBrand,
    categories: productCategories,
    snippetTitle,
    cardTitle,
  };
}
