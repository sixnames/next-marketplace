import { Rubric } from '../../entities/Rubric';
import {
  ATTRIBUTE_VARIANT_MULTIPLE_SELECT,
  ATTRIBUTE_VARIANT_NUMBER,
  ATTRIBUTE_VARIANT_SELECT,
  ATTRIBUTE_VARIANT_STRING,
  ATTRIBUTE_VIEW_VARIANT_LIST,
} from '@yagu/config';

interface GenerateTestProductAttributesInterface {
  rubricLevelTwo: Rubric;
}

export function generateTestProductAttributes({
  rubricLevelTwo,
}: GenerateTestProductAttributesInterface) {
  return {
    attributesGroups: rubricLevelTwo.attributesGroups.map(({ node }: { [key: string]: any }) => {
      const { id, attributes } = node;
      return {
        node: id,
        showInCard: true,
        attributes: attributes.map(({ id, slug, variant, options }: { [key: string]: any }) => {
          let value = [];

          if (variant === ATTRIBUTE_VARIANT_MULTIPLE_SELECT) {
            value = options.options.map(({ id }: { id: string }) => id);
          }

          if (variant === ATTRIBUTE_VARIANT_SELECT) {
            value = options.options[0].id;
          }

          if (variant === ATTRIBUTE_VARIANT_STRING) {
            value = ['string'];
          }

          if (variant === ATTRIBUTE_VARIANT_NUMBER) {
            value = ['123'];
          }

          return {
            node: id,
            showInCard: true,
            viewVariant: ATTRIBUTE_VIEW_VARIANT_LIST,
            key: slug,
            value,
          };
        }),
      };
    }),
  };
}
