import {
  AttributeInterface,
  AttributesGroupInterface,
  CategoryInterface,
  OptionInterface,
  ProductConnectionInterface,
  ProductConnectionItemInterface,
  RubricInterface,
} from 'db/uiInterfaces';
import { getFieldStringLocale } from 'lib/i18n';
import { sortByName } from 'lib/optionsUtils';

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
    return {
      ...attribute,
      name: getFieldStringLocale(attribute.nameI18n, locale),
      metric: attribute.metric
        ? {
            ...attribute.metric,
            name: getFieldStringLocale(attribute.metric.nameI18n, locale),
          }
        : null,
    };
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
