import {
  ATTRIBUTE_VARIANT_MULTIPLE_SELECT,
  ATTRIBUTE_VARIANT_NUMBER,
  ATTRIBUTE_VARIANT_SELECT,
  ATTRIBUTE_VARIANT_STRING,
  DEFAULT_LOCALE,
} from 'config/common';
import { ObjectIdModel } from 'db/dbModels';
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
  return attributes.filter((attribute) => {
    const { variant, selectedOptionsSlugs, textI18n, number } = attribute;
    const isSelect =
      variant === ATTRIBUTE_VARIANT_MULTIPLE_SELECT || variant === ATTRIBUTE_VARIANT_SELECT;
    const isText = variant === ATTRIBUTE_VARIANT_STRING;
    const isNumber = variant === ATTRIBUTE_VARIANT_NUMBER;
    const isExactViewVariant = attribute.viewVariant === viewVariant;
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
  const metricName = productAttribute.metric
    ? ` ${getFieldStringLocale(productAttribute.metric.nameI18n, locale)}`
    : '';
  if (
    (productAttribute.variant === ATTRIBUTE_VARIANT_MULTIPLE_SELECT ||
      productAttribute.variant === ATTRIBUTE_VARIANT_SELECT) &&
    productAttribute.selectedOptionsSlugs.length > 0
  ) {
    return getStringValueFromOptionsList({
      options: productAttribute.options || [],
      locale,
      metricName,
    });
  }

  // String
  if (productAttribute.variant === ATTRIBUTE_VARIANT_STRING) {
    return productAttribute.textI18n
      ? `${getFieldStringLocale(productAttribute.textI18n, locale)}${metricName}`
      : null;
  }

  // Number
  if (productAttribute.variant === ATTRIBUTE_VARIANT_NUMBER) {
    return productAttribute.number ? `${productAttribute.number}${metricName}` : null;
  }

  return null;
}

export interface GetProductCurrentViewCastedAttributes {
  excludedAttributesIds?: ObjectIdModel[];
  attributes: ProductAttributeInterface[];
  viewVariant: string;
  locale: string;
}

export function getProductCurrentViewCastedAttributes({
  excludedAttributesIds,
  attributes,
  viewVariant,
  locale,
}: GetProductCurrentViewCastedAttributes): ProductAttributeInterface[] {
  return getProductCurrentViewAttributes({
    attributes,
    viewVariant,
  }).reduce((acc: ProductAttributeInterface[], productAttribute) => {
    if ((excludedAttributesIds || []).some((_id) => _id.equals(productAttribute.attributeId))) {
      return acc;
    }

    const readableValue = getAttributeReadableValue({
      productAttribute,
      locale,
    });

    if (!readableValue) {
      return acc;
    }

    const metric = productAttribute.metric
      ? {
          ...productAttribute.metric,
          name: getFieldStringLocale(productAttribute.metric.nameI18n, locale),
        }
      : null;

    const castedAttribute: ProductAttributeInterface = {
      ...productAttribute,
      name: getFieldStringLocale(productAttribute.nameI18n, locale),
      metric,
      options: (productAttribute.options || []).map((option) => {
        // console.log(attribute.attributeNameI18n.ru, option.nameI18n.ru);
        return {
          ...option,
          name: `${getFieldStringLocale(option.nameI18n, locale)}${
            metric ? ` ${metric.name}` : ''
          }`,
        };
      }),
      readableValue,
    };

    return [...acc, castedAttribute];
  }, []);
}
