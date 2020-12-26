import { Rubric } from '../../entities/Rubric';
import {
  ATTRIBUTE_VARIANT_MULTIPLE_SELECT,
  ATTRIBUTE_VARIANT_NUMBER,
  ATTRIBUTE_VARIANT_SELECT,
  ATTRIBUTE_VARIANT_STRING,
  ATTRIBUTE_VIEW_VARIANT_LIST,
} from '@yagu/shared';

interface GenerateTestProductAttributesInterface {
  rubric: Rubric;
  viewVariant?: string;
}

export function generateTestProductAttributes({
  rubric,
  viewVariant,
}: GenerateTestProductAttributesInterface) {
  return {
    attributesGroups: rubric.attributesGroups.map(({ node }: { [key: string]: any }) => {
      const { id, attributes } = node;
      return {
        node: id,
        showInCard: true,
        attributes: attributes.map(
          ({ id, slug, variant, optionsGroup }: { [key: string]: any }) => {
            let value = [];

            if (variant === ATTRIBUTE_VARIANT_MULTIPLE_SELECT) {
              value = optionsGroup.options.map(({ id }: { id: string }) => id);
            }

            if (variant === ATTRIBUTE_VARIANT_SELECT) {
              value = optionsGroup.options[0].id;
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
              viewVariant: viewVariant || ATTRIBUTE_VIEW_VARIANT_LIST,
              key: slug,
              value,
            };
          },
        ),
      };
    }),
  };
}
