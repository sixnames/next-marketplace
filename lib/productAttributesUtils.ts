import {
  ATTRIBUTE_VARIANT_MULTIPLE_SELECT,
  ATTRIBUTE_VARIANT_NUMBER,
  ATTRIBUTE_VARIANT_SELECT,
  ATTRIBUTE_VARIANT_STRING,
  DEFAULT_LOCALE,
} from 'config/common';
import { ProductAttributeModel } from 'db/dbModels';

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
  getFieldLocale(i18nField?: Record<string, string> | null | undefined): string;
}

export function getAttributeReadableValue({
  attribute,
  getFieldLocale,
}: GetAttributeReadableValueInterface): string | null {
  const metricName = attribute.attributeMetric
    ? ` ${getFieldLocale(attribute.attributeMetric.nameI18n)}`
    : '';
  if (
    (attribute.attributeVariant === ATTRIBUTE_VARIANT_MULTIPLE_SELECT ||
      attribute.attributeVariant === ATTRIBUTE_VARIANT_SELECT) &&
    attribute.selectedOptions.length > 0
  ) {
    const asString = attribute.selectedOptions
      .map(({ nameI18n }) => {
        return getFieldLocale(nameI18n);
      })
      .join(', ');

    return `${asString}${metricName}`;
  }

  // String
  if (attribute.attributeVariant === ATTRIBUTE_VARIANT_STRING) {
    return attribute.textI18n ? `${getFieldLocale(attribute.textI18n)}${metricName}` : null;
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
  getFieldLocale(i18nField?: Record<string, string> | null | undefined): string;
}

export function getProductCurrentViewCastedAttributes({
  attributes,
  viewVariant,
  getFieldLocale,
}: GetProductCurrentViewCastedAttributes): ProductAttributeModel[] {
  return getProductCurrentViewAttributes({
    attributes,
    viewVariant,
  }).reduce((acc: ProductAttributeModel[], attribute) => {
    const readableValue = getAttributeReadableValue({
      attribute,
      getFieldLocale,
    });

    if (!readableValue) {
      return acc;
    }

    return [
      ...acc,
      {
        ...attribute,
        readableValue,
        attributeName: getFieldLocale(attribute.attributeNameI18n),
        attributeMetric: attribute.attributeMetric
          ? {
              ...attribute.attributeMetric,
              name: getFieldLocale(attribute.attributeMetric.nameI18n),
            }
          : null,
        selectedOptions: attribute.selectedOptions.map((option) => {
          return {
            ...option,
            name: getFieldLocale(option.nameI18n),
          };
        }),
      },
    ];
  }, []);
}
