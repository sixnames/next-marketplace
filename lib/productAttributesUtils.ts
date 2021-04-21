import {
  ATTRIBUTE_VARIANT_MULTIPLE_SELECT,
  ATTRIBUTE_VARIANT_NUMBER,
  ATTRIBUTE_VARIANT_SELECT,
  ATTRIBUTE_VARIANT_STRING,
  DEFAULT_LOCALE,
} from 'config/common';
import { ProductAttributeInterface } from 'db/uiInterfaces';
import { getFieldStringLocale } from 'lib/i18n';

export interface GetProductCurrentViewAttributesInterface {
  attributes: ProductAttributeInterface[];
  viewVariant: string;
}
export function getProductCurrentViewAttributes({
  attributes,
  viewVariant,
}: GetProductCurrentViewAttributesInterface): ProductAttributeInterface[] {
  return attributes.filter(
    ({ attributeViewVariant, selectedOptionsSlugs, textI18n, number, attributeVariant }) => {
      const isSelect =
        attributeVariant === ATTRIBUTE_VARIANT_MULTIPLE_SELECT ||
        attributeVariant === ATTRIBUTE_VARIANT_SELECT;
      const isText = attributeVariant === ATTRIBUTE_VARIANT_STRING;
      const isNumber = attributeVariant === ATTRIBUTE_VARIANT_NUMBER;
      const isExactViewVariant = attributeViewVariant === viewVariant;
      if (!isExactViewVariant) {
        return false;
      }

      if (isSelect && selectedOptionsSlugs.length > 0) {
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
  attribute: ProductAttributeInterface;
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
    attribute.selectedOptionsSlugs.length > 0
  ) {
    const asString = getFieldStringLocale(attribute.optionsValueI18n, locale);

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
  attributes: ProductAttributeInterface[];
  viewVariant: string;
  locale: string;
}

export function getProductCurrentViewCastedAttributes({
  attributes,
  viewVariant,
  locale,
}: GetProductCurrentViewCastedAttributes): ProductAttributeInterface[] {
  return getProductCurrentViewAttributes({
    attributes,
    viewVariant,
  }).reduce((acc: ProductAttributeInterface[], attribute) => {
    const readableValue = getAttributeReadableValue({
      attribute,
      locale,
    });

    if (!readableValue) {
      return acc;
    }

    const attributeMetric = attribute.attributeMetric
      ? {
          ...attribute.attributeMetric,
          name: getFieldStringLocale(attribute.attributeMetric.nameI18n, locale),
        }
      : null;

    return [
      ...acc,
      {
        ...attribute,
        attributeName: getFieldStringLocale(attribute.attributeNameI18n, locale),
        attributeMetric,
        selectedOptions: (attribute.selectedOptions || []).map((option) => {
          // console.log(attribute.attributeNameI18n.ru, option.nameI18n.ru);
          return {
            ...option,
            name: `${getFieldStringLocale(option.nameI18n, locale)}${
              attributeMetric ? ` ${attributeMetric.name}` : ''
            }`,
          };
        }),
        readableValue,
      },
    ];
  }, []);
}
