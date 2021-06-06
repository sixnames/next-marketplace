import {
  ATTRIBUTE_VARIANT_NUMBER,
  ATTRIBUTE_VARIANT_STRING,
  CATALOGUE_OPTION_SEPARATOR,
  DEFAULT_COUNTERS_OBJECT,
} from '../../../../config/common';
import { ObjectIdModel, ProductAttributeModel } from '../../../../db/dbModels';
import { getObjectId } from 'mongo-seeding';
import * as rubricAttributes from '../rubricAttributes/rubricAttributes';
import * as products from '../products/products';
import * as options from '../options/options';

const attributeText = `
Lorem ipsum dolor sit amet, consectetur adipisicing elit. Animi debitis eligendi eum, excepturi iure libero molestias quas quis ratione reiciendis sed sequi sint sit! Architecto minus modi officia provident voluptates.
      Lorem ipsum dolor sit amet, consectetur adipisicing elit. Animi debitis eligendi eum, excepturi iure libero molestias quas quis ratione reiciendis sed sequi sint sit! Architecto minus modi officia provident voluptates.
`;

const productAttributes: ProductAttributeModel[] = products.reduce(
  (acc: ProductAttributeModel[], product) => {
    const currentProductInitialAttributes = rubricAttributes.filter((rubricAttribute) => {
      return product.rubricSlug === rubricAttribute.rubricSlug;
    });

    const currentProductAttributes: ProductAttributeModel[] = currentProductInitialAttributes.map(
      (rubricAttribute) => {
        const rubricAttributeOptions = options.filter((option) => {
          return rubricAttribute.optionsGroupId?.equals(option.optionsGroupId);
        });

        const cleanOptionSlugs = product.selectedOptionsSlugs.reduce(
          (acc: string[], initialSlug) => {
            const slugArray = initialSlug.split(CATALOGUE_OPTION_SEPARATOR);
            const cleanSlug = slugArray[1];
            if (cleanSlug) {
              return [...acc, cleanSlug];
            }
            return acc;
          },
          [],
        );

        const selectedOptionsIds: ObjectIdModel[] = [];
        const selectedOptionsSlugs: string[] = [];
        rubricAttributeOptions.forEach((option) => {
          if (cleanOptionSlugs.includes(option.slug)) {
            selectedOptionsIds.push(option._id);
            selectedOptionsSlugs.push(
              `${rubricAttribute.slug}${CATALOGUE_OPTION_SEPARATOR}${option.slug}`,
            );
          }
        });

        return {
          _id: getObjectId(`${product.slug} ${rubricAttribute.slug}`),
          productSlug: product.slug,
          productId: product._id,
          attributeId: rubricAttribute.attributeId,
          selectedOptionsSlugs,
          selectedOptionsIds,
          rubricId: rubricAttribute.rubricId,
          rubricSlug: rubricAttribute.rubricSlug,
          optionsGroupId: rubricAttribute.optionsGroupId,
          slug: rubricAttribute.slug,
          variant: rubricAttribute.variant,
          attributesGroupId: rubricAttribute.attributesGroupId,
          viewVariant: rubricAttribute.viewVariant,
          nameI18n: rubricAttribute.nameI18n,
          capitalise: rubricAttribute.capitalise,
          metric: rubricAttribute.metric,
          notShowAsAlphabet: rubricAttribute.notShowAsAlphabet,
          positioningInTitle: rubricAttribute.positioningInTitle,
          showInCard: true,
          showAsBreadcrumb: true,
          textI18n:
            rubricAttribute.variant === ATTRIBUTE_VARIANT_STRING
              ? {
                  ru: attributeText,
                }
              : undefined,
          number:
            rubricAttribute.variant === ATTRIBUTE_VARIANT_NUMBER
              ? Math.round(Math.random() * 10)
              : undefined,
          ...DEFAULT_COUNTERS_OBJECT,
        };
      },
    );

    return [...acc, ...currentProductAttributes];
  },
  [],
);

// @ts-ignore
export = productAttributes;
