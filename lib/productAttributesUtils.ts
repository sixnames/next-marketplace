import { ObjectId } from 'mongodb';
import {
  ATTRIBUTE_VARIANT_MULTIPLE_SELECT,
  ATTRIBUTE_VARIANT_NUMBER,
  ATTRIBUTE_VARIANT_SELECT,
  ATTRIBUTE_VARIANT_STRING,
  DEFAULT_LOCALE,
  LOCALES,
} from '../config/common';
import { COL_CATEGORIES, COL_RUBRICS } from '../db/collectionNames';
import { rubricAttributeGroupsPipeline } from '../db/dao/constantPipelines';
import { ObjectIdModel, TranslationModel } from '../db/dbModels';
import { getDatabase } from '../db/mongodb';
import {
  AttributeInterface,
  CategoryInterface,
  ProductAttributeInterface,
  RubricInterface,
} from '../db/uiInterfaces';
import { sortObjectsByField } from './arrayUtils';
import { getFieldStringLocale } from './i18n';
import { getStringValueFromOptionsList } from './optionUtils';

export async function getRubricAllAttributes(
  rubricId: ObjectIdModel,
): Promise<AttributeInterface[]> {
  const { db } = await getDatabase();
  const rubricsCollection = db.collection<RubricInterface>(COL_RUBRICS);
  const rubricAggregationResult = await rubricsCollection
    .aggregate<RubricInterface>([
      {
        $match: {
          _id: new ObjectId(rubricId),
        },
      },
      ...rubricAttributeGroupsPipeline,
    ])
    .toArray();
  const rubric = rubricAggregationResult[0];
  if (!rubric) {
    return [];
  }

  const rubricAttributes: AttributeInterface[] = [];
  (rubric.attributesGroups || []).forEach((group) => {
    (group.attributes || []).forEach((attribute) => {
      const exist = rubricAttributes.some(({ _id }) => _id.equals(attribute._id));
      if (!exist) {
        rubricAttributes.push(attribute);
      }
    });
  });
  return rubricAttributes;
}

export async function getCategoryAllAttributes(
  categorySlugs: string[],
): Promise<AttributeInterface[]> {
  const { db } = await getDatabase();
  const categoriesCollection = db.collection<CategoryInterface>(COL_CATEGORIES);
  const categories = await categoriesCollection
    .aggregate<CategoryInterface>([
      {
        $match: {
          slug: {
            $in: categorySlugs,
          },
        },
      },
      ...rubricAttributeGroupsPipeline,
    ])
    .toArray();

  const categoryAttributes: AttributeInterface[] = [];
  categories.forEach((category) => {
    (category.attributesGroups || []).forEach((group) => {
      (group.attributes || []).forEach((attribute) => {
        const exist = categoryAttributes.some(({ _id }) => _id.equals(attribute._id));
        if (!exist) {
          categoryAttributes.push(attribute);
        }
      });
    });
  });
  return categoryAttributes;
}

export interface GetProductCurrentViewAttributesInterface {
  attributes: ProductAttributeInterface[];
  viewVariant: string;
}
export function getProductCurrentViewAttributes({
  attributes,
  viewVariant,
}: GetProductCurrentViewAttributesInterface): ProductAttributeInterface[] {
  return attributes.filter((productAttribute) => {
    const { attribute } = productAttribute;
    if (!attribute) {
      return false;
    }
    const { variant } = attribute;
    const { optionSlugs, textI18n, number } = productAttribute;
    const isSelect =
      variant === ATTRIBUTE_VARIANT_MULTIPLE_SELECT || variant === ATTRIBUTE_VARIANT_SELECT;
    const isText = variant === ATTRIBUTE_VARIANT_STRING;
    const isNumber = variant === ATTRIBUTE_VARIANT_NUMBER;
    const isExactViewVariant = attribute.viewVariant === viewVariant;
    if (!isExactViewVariant) {
      return false;
    }

    if (isSelect && optionSlugs.length > 0) {
      return true;
    }

    if (isText && textI18n && textI18n[DEFAULT_LOCALE]) {
      return true;
    }

    if (isNumber && number) {
      return true;
    }

    return false;
  });
}

export interface GetAttributeReadableValueInterface {
  productAttribute: ProductAttributeInterface;
  locale: string;
  gender?: string;
}

export function getAttributeReadableValue({
  productAttribute,
  locale,
  gender,
}: GetAttributeReadableValueInterface): string | null {
  const { attribute } = productAttribute;
  if (!attribute) {
    return null;
  }

  const metricName = attribute.metric
    ? ` ${getFieldStringLocale(attribute.metric.nameI18n, locale)}`
    : '';

  if (
    (attribute.variant === ATTRIBUTE_VARIANT_MULTIPLE_SELECT ||
      attribute.variant === ATTRIBUTE_VARIANT_SELECT) &&
    productAttribute.optionSlugs.length > 0 &&
    attribute.options &&
    attribute.options.length > 0
  ) {
    return getStringValueFromOptionsList({
      options: attribute.options,
      locale,
      metricName,
      gender,
    });
  }

  // String
  if (attribute.variant === ATTRIBUTE_VARIANT_STRING) {
    const text = getFieldStringLocale(productAttribute.textI18n, locale);
    if (text) {
      return `${text}${metricName}`;
    }
  }

  // Number
  if (attribute.variant === ATTRIBUTE_VARIANT_NUMBER) {
    return productAttribute.number ? `${productAttribute.number}${metricName}` : null;
  }

  return null;
}

export interface GetAttributeReadableValueLocalesInterface {
  productAttribute: ProductAttributeInterface;
  gender?: string;
}

export function getAttributeReadableValueLocales({
  productAttribute,
  gender,
}: GetAttributeReadableValueLocalesInterface): TranslationModel {
  let payload: TranslationModel = {};
  LOCALES.forEach((locale) => {
    const readableValue = getAttributeReadableValue({
      gender,
      locale,
      productAttribute,
    });
    payload[locale] = readableValue;
  });
  return payload;
}

export interface CastProductAttributeForUiInterface {
  productAttribute: ProductAttributeInterface;
  locale: string;
  gender?: string;
}

export function castProductAttributeForUi({
  productAttribute,
  locale,
  gender,
}: CastProductAttributeForUiInterface): ProductAttributeInterface | null {
  if (!productAttribute.attribute) {
    return null;
  }
  const { attribute } = productAttribute;
  const readableValue = getAttributeReadableValue({
    productAttribute,
    locale,
    gender,
  });

  if (!readableValue) {
    return null;
  }

  const metric = attribute.metric
    ? {
        ...attribute.metric,
        name: getFieldStringLocale(attribute.metric.nameI18n, locale),
      }
    : null;

  const castedAttribute: ProductAttributeInterface = {
    ...productAttribute,
    attribute: {
      ...attribute,
      name: getFieldStringLocale(attribute.nameI18n, locale),
      metric,
      options: (attribute.options || []).map((option) => {
        return {
          ...option,
          name: `${getFieldStringLocale(option.nameI18n, locale)}${
            metric ? ` ${metric.name}` : ''
          }`,
        };
      }),
    },
    readableValue,
  };

  return castedAttribute;
}

export interface GetProductCurrentViewCastedAttributes {
  excludedAttributesIds?: ObjectIdModel[];
  attributes: ProductAttributeInterface[];
  viewVariant: string;
  locale: string;
  gender?: string;
}

export function getProductCurrentViewCastedAttributes({
  excludedAttributesIds,
  attributes,
  viewVariant,
  locale,
  gender,
}: GetProductCurrentViewCastedAttributes): ProductAttributeInterface[] {
  const currentViewAttributes = getProductCurrentViewAttributes({
    attributes,
    viewVariant,
  });

  const castedAttributes = currentViewAttributes.reduce(
    (acc: ProductAttributeInterface[], productAttribute) => {
      if ((excludedAttributesIds || []).some((_id) => _id.equals(productAttribute.attributeId))) {
        return acc;
      }

      const castedAttribute = castProductAttributeForUi({
        productAttribute,
        locale,
        gender,
      });

      if (!castedAttribute) {
        return acc;
      }

      return [...acc, castedAttribute];
    },
    [],
  );

  return sortObjectsByField(castedAttributes);
}

export function countProductAttributes(attributes?: ProductAttributeInterface[] | null): number {
  let counter = 0;
  (attributes || []).forEach(({ attribute, number, textI18n, optionIds }) => {
    const variant = attribute?.variant;
    if (variant === ATTRIBUTE_VARIANT_NUMBER && number) {
      counter += 1;
    }

    if (
      (variant === ATTRIBUTE_VARIANT_SELECT || variant === ATTRIBUTE_VARIANT_MULTIPLE_SELECT) &&
      optionIds.length > 0
    ) {
      counter += 1;
    }

    if (variant === ATTRIBUTE_VARIANT_STRING && textI18n) {
      const localesCounter = LOCALES.reduce((acc: number, locale) => {
        const text = textI18n[locale];
        if (text && text.length > 0) {
          return acc + 1;
        }
        return acc;
      }, 0);

      if (localesCounter > 0) {
        counter += 1;
      }
    }
  });
  return counter;
}
