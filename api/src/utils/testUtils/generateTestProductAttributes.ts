import { Rubric } from '../../entities/Rubric';
import {
  ATTRIBUTE_TYPE_MULTIPLE_SELECT,
  ATTRIBUTE_TYPE_NUMBER,
  ATTRIBUTE_TYPE_SELECT,
  ATTRIBUTE_TYPE_STRING,
} from '../../config';

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
        attributes: attributes.map(({ id, itemId, variant, options }: { [key: string]: any }) => {
          let value = [];

          if (variant === ATTRIBUTE_TYPE_MULTIPLE_SELECT) {
            value = options.options.map(({ id }: { id: string }) => id);
          }

          if (variant === ATTRIBUTE_TYPE_SELECT) {
            value = options.options[0].id;
          }

          if (variant === ATTRIBUTE_TYPE_STRING) {
            value = ['string'];
          }

          if (variant === ATTRIBUTE_TYPE_NUMBER) {
            value = ['123'];
          }

          return {
            node: id,
            showInCard: true,
            key: itemId,
            value,
          };
        }),
      };
    }),
  };
}
