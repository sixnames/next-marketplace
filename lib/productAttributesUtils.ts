import {
  ATTRIBUTE_VARIANT_MULTIPLE_SELECT,
  ATTRIBUTE_VARIANT_NUMBER,
  ATTRIBUTE_VARIANT_SELECT,
  ATTRIBUTE_VARIANT_STRING,
  DEFAULT_LOCALE,
} from 'config/common';
import { ProductAttributeModel } from 'db/dbModels';
import { getFieldStringLocale } from 'lib/i18n';

export interface GetProductCurrentViewAttributesInterface {
  attributes: ProductAttributeModel[];
  viewVariant: string;
}
export function getProductCurrentViewAttributes({
  attributes,
  viewVariant,
}: GetProductCurrentViewAttributesInterface): ProductAttributeModel[] {
  return attributes.filter(
    ({ attributeViewVariant, selectedOptions, textI18n, number, attributeVariant }) => {
      const isSelect =
        attributeVariant === ATTRIBUTE_VARIANT_MULTIPLE_SELECT ||
        attributeVariant === ATTRIBUTE_VARIANT_SELECT;
      const isText = attributeVariant === ATTRIBUTE_VARIANT_STRING;
      const isNumber = attributeVariant === ATTRIBUTE_VARIANT_NUMBER;
      const isExactViewVariant = attributeViewVariant === viewVariant;
      if (!isExactViewVariant) {
        return false;
      }

      if (isSelect && selectedOptions.length > 0) {
        return true;
      }

      if (isText && textI18n && textI18n[DEFAULT_LOCALE]) {
        return true;
      }

      if (isNumber && number) {
        return true;
      }

      return false;
    },
  );
}

export interface GetAttributeReadableValueInterface {
  attribute: ProductAttributeModel;
  locale: string;
}

export function getAttributeReadableValue({
  attribute,
  locale,
}: GetAttributeReadableValueInterface): string | null {
  const metricName = attribute.attributeMetric
    ? ` ${getFieldStringLocale(attribute.attributeMetric.nameI18n, locale)}`
    : '';
  if (
    (attribute.attributeVariant === ATTRIBUTE_VARIANT_MULTIPLE_SELECT ||
      attribute.attributeVariant === ATTRIBUTE_VARIANT_SELECT) &&
    attribute.selectedOptions.length > 0
  ) {
    const asString = attribute.selectedOptions
      .map(({ nameI18n }) => {
        return getFieldStringLocale(nameI18n);
      })
      .join(', ');

    return `${asString}${metricName}`;
  }

  // String
  if (attribute.attributeVariant === ATTRIBUTE_VARIANT_STRING) {
    return attribute.textI18n
      ? `${getFieldStringLocale(attribute.textI18n, locale)}${metricName}`
      : null;
  }

  // Number
  if (attribute.attributeVariant === ATTRIBUTE_VARIANT_NUMBER) {
    return attribute.number ? `${attribute.number}${metricName}` : null;
  }

  return null;
}

export interface GetProductCurrentViewCastedAttributes {
  attributes: ProductAttributeModel[];
  viewVariant: string;
  locale: string;
}

export function getProductCurrentViewCastedAttributes({
  attributes,
  viewVariant,
  locale,
}: GetProductCurrentViewCastedAttributes): ProductAttributeModel[] {
  return getProductCurrentViewAttributes({
    attributes,
    viewVariant,
  }).reduce((acc: ProductAttributeModel[], attribute) => {
    const readableValue = getAttributeReadableValue({
      attribute,
      locale,
    });

    if (!readableValue) {
      return acc;
    }

    return [
      ...acc,
      {
        ...attribute,
        readableValue,
        attributeName: getFieldStringLocale(attribute.attributeNameI18n, locale),
        attributeMetric: attribute.attributeMetric
          ? {
              ...attribute.attributeMetric,
              name: getFieldStringLocale(attribute.attributeMetric.nameI18n, locale),
            }
          : null,
        selectedOptions: attribute.selectedOptions.map((option) => {
          return {
            ...option,
            name: getFieldStringLocale(option.nameI18n, locale),
          };
        }),
      },
    ];
  }, []);
}
