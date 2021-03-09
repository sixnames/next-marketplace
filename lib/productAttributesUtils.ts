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
  if (
    (attribute.attributeVariant === ATTRIBUTE_VARIANT_MULTIPLE_SELECT ||
      attribute.attributeVariant === ATTRIBUTE_VARIANT_SELECT) &&
    attribute.selectedOptions.length > 0
  ) {
    return attribute.selectedOptions
      .map(({ nameI18n }) => {
        return getFieldLocale(nameI18n);
      })
      .join(', ');
  }

  // String
  if (attribute.attributeVariant === ATTRIBUTE_VARIANT_STRING) {
    return attribute.textI18n ? getFieldLocale(attribute.textI18n) : null;
  }

  // Number
  if (attribute.attributeVariant === ATTRIBUTE_VARIANT_NUMBER) {
    return attribute.number ? `${attribute.number}` : null;
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
      },
    ];
  }, []);
}
