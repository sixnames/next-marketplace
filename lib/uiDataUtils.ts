import {
  AttributeInterface,
  AttributesGroupInterface,
  BrandInterface,
  CategoryInterface,
  OptionInterface,
  ProductAttributeInterface,
  ProductConnectionInterface,
  ProductConnectionItemInterface,
  ProductInterface,
  RubricInterface,
} from 'db/uiInterfaces';
import { getFieldStringLocale } from 'lib/i18n';
import { castCatalogueFilter, getTreeFromList, sortByName } from 'lib/optionUtils';
import { generateCardTitle, generateSnippetTitle } from 'lib/titleUtils';

interface CastProductConnectionForUI {
  connection: ProductConnectionInterface;
  locale: string;
}

export function castProductConnectionForUI({
  connection,
  locale,
}: CastProductConnectionForUI): ProductConnectionInterface | null {
  const connectionProducts = (connection.connectionProducts || []).reduce(
    (acc: ProductConnectionItemInterface[], connectionProduct) => {
      if (!connectionProduct.option) {
        return acc;
      }

      return [
        ...acc,
        {
          ...connectionProduct,
          option: castOptionForUI({
            option: connectionProduct.option,
            locale,
          }),
        },
      ];
    },
    [],
  );

  if (!connection.attribute) {
    return null;
  }

  return {
    ...connection,
    connectionProducts,
    attribute: castAttributeForUI({
      attribute: connection.attribute,
      locale,
    }),
  };
}

interface CastOptionForUI {
  option: OptionInterface;
  locale: string;
}

export function castOptionForUI({ option, locale }: CastOptionForUI): OptionInterface {
  return {
    ...option,
    name: getFieldStringLocale(option.nameI18n, locale),
    options: (option.options || []).map((nestedOption) => {
      return castOptionForUI({
        option: nestedOption,
        locale,
      });
    }),
  };
}

interface CastAttributeForUI {
  attribute: AttributeInterface;
  locale: string;
}

export function castAttributeForUI({ attribute, locale }: CastAttributeForUI): AttributeInterface {
  return {
    ...attribute,
    name: getFieldStringLocale(attribute.nameI18n, locale),
    options: (attribute.options || []).map((option) => {
      return castOptionForUI({
        option,
        locale,
      });
    }),
    metric: attribute.metric
      ? {
          ...attribute.metric,
          name: getFieldStringLocale(attribute.metric.nameI18n, locale),
        }
      : null,
  };
}

interface CastAttributesGroupForUI {
  attributesGroup: AttributesGroupInterface;
  locale: string;
}

export function castAttributesGroupForUI({
  attributesGroup,
  locale,
}: CastAttributesGroupForUI): AttributesGroupInterface {
  const attributes = (attributesGroup.attributes || []).map((attribute) => {
    return castAttributeForUI({ attribute, locale });
  });

  return {
    ...attributesGroup,
    name: getFieldStringLocale(attributesGroup.nameI18n, locale),
    attributes: sortByName(attributes),
  };
}

interface CastRubricForUI {
  rubric: RubricInterface;
  locale: string;
}

export function castRubricForUI({ rubric, locale }: CastRubricForUI): RubricInterface {
  const categories = (rubric.categories || []).map((child) => {
    return castCategoryForUI({
      category: child,
      locale,
    });
  });

  const attributesGroups = (rubric.attributesGroups || []).map((attributesGroup) => {
    return castAttributesGroupForUI({
      attributesGroup,
      locale,
    });
  });

  return {
    ...rubric,
    name: getFieldStringLocale(rubric.nameI18n, locale),
    categories: sortByName(categories),
    attributesGroups: sortByName(attributesGroups),
  };
}

interface CastCategoryForUI {
  category: CategoryInterface;
  locale: string;
}

export function castCategoryForUI({ category, locale }: CastCategoryForUI): CategoryInterface {
  const parents = (category.parents || []).map((parent) => {
    return castCategoryForUI({
      category: parent,
      locale,
    });
  });

  const categories = (category.categories || []).map((child) => {
    return castCategoryForUI({
      category: child,
      locale,
    });
  });

  const attributesGroups = (category.attributesGroups || []).map((attributesGroup) => {
    return castAttributesGroupForUI({
      attributesGroup,
      locale,
    });
  });

  return {
    ...category,
    name: getFieldStringLocale(category.nameI18n, locale),
    rubric: category.rubric
      ? castRubricForUI({
          rubric: category.rubric,
          locale,
        })
      : null,
    parents: sortByName(parents),
    categories: sortByName(categories),
    attributesGroups: sortByName(attributesGroups),
  };
}

interface CastProductForUI {
  product: ProductInterface;
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
}: CastProductForUI): ProductInterface {
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
        const { attributeSlug, optionSlug } = castCatalogueFilter(selectedSlug);
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
    (acc: ProductConnectionInterface[], connection) => {
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
      titleCategoriesSlugs: product.titleCategoriesSlugs,
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
      titleCategoriesSlugs: product.titleCategoriesSlugs,
      originalName: product.originalName,
      defaultGender: product.gender,
    });
  }

  return {
    ...product,
    connections,
    attributes: productAttributes,
    brand: initialProductBrand,
    categories: productCategories,
    snippetTitle,
    cardTitle,
  };
}
