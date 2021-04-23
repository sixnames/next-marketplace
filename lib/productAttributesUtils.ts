import {
  ATTRIBUTE_VARIANT_MULTIPLE_SELECT,
  ATTRIBUTE_VARIANT_NUMBER,
  ATTRIBUTE_VARIANT_SELECT,
  ATTRIBUTE_VARIANT_STRING,
  DEFAULT_LOCALE,
} from 'config/common';
import { ProductAttributeInterface } from 'db/uiInterfaces';
import { getFieldStringLocale } from 'lib/i18n';
import { getStringValueFromOptionsList } from 'lib/optionsUtils';

export interface GetProductCurrentViewAttributesInterface {
  attributes: ProductAttributeInterface[];
  viewVariant: string;
}
export function getProductCurrentViewAttributes({
  attributes,
  viewVariant,
}: GetProductCurrentViewAttributesInterface): ProductAttributeInterface[] {
  return attributes.filter(({ attribute, selectedOptionsSlugs, textI18n, number }) => {
    const isSelect =
      attribute?.variant === ATTRIBUTE_VARIANT_MULTIPLE_SELECT ||
      attribute?.variant === ATTRIBUTE_VARIANT_SELECT;
    const isText = attribute?.variant === ATTRIBUTE_VARIANT_STRING;
    const isNumber = attribute?.variant === ATTRIBUTE_VARIANT_NUMBER;
    const isExactViewVariant = attribute?.viewVariant === viewVariant;
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
}: GetAttributeReadableValueInterface): string | null {
  const metricName = productAttribute.attribute?.metric
    ? ` ${getFieldStringLocale(productAttribute.attribute?.metric.nameI18n, locale)}`
    : '';
  if (
    (productAttribute.attribute?.variant === ATTRIBUTE_VARIANT_MULTIPLE_SELECT ||
      productAttribute.attribute?.variant === ATTRIBUTE_VARIANT_SELECT) &&
    productAttribute.selectedOptionsSlugs.length > 0
  ) {
    return getStringValueFromOptionsList({
      options: productAttribute.selectedOptions || [],
      locale,
      metricName,
    });
  }

  // String
  if (productAttribute.attribute?.variant === ATTRIBUTE_VARIANT_STRING) {
    return productAttribute.textI18n
      ? `${getFieldStringLocale(productAttribute.textI18n, locale)}${metricName}`
      : null;
  }

  // Number
  if (productAttribute.attribute?.variant === ATTRIBUTE_VARIANT_NUMBER) {
    return productAttribute.number ? `${productAttribute.number}${metricName}` : null;
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
      productAttribute: attribute,
      locale,
    });

    if (!readableValue) {
      return acc;
    }

    const attributeMetric = attribute.attribute?.metric
      ? {
          ...attribute.attribute?.metric,
          name: getFieldStringLocale(attribute.attribute?.metric.nameI18n, locale),
        }
      : null;

    return [
      ...acc,
      {
        ...attribute,
        attributeName: getFieldStringLocale(attribute.attribute?.nameI18n, locale),
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
