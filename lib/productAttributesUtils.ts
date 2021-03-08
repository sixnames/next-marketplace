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
