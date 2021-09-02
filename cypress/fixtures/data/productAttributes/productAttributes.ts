import {
  ATTRIBUTE_VARIANT_NUMBER,
  ATTRIBUTE_VARIANT_STRING,
  FILTER_SEPARATOR,
  DEFAULT_COUNTERS_OBJECT,
} from '../../../../config/common';
import { ObjectIdModel, ProductAttributeModel } from '../../../../db/dbModels';
import { getObjectId } from 'mongo-seeding';
import rubricAttributes from '../rubricAttributes/rubricAttributes';
import products from '../products/products';
import options from '../options/options';

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
            const slugArray = initialSlug.split(FILTER_SEPARATOR);
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
            selectedOptionsSlugs.push(`${rubricAttribute.slug}${FILTER_SEPARATOR}${option.slug}`);
          }
        });

        return {
          ...rubricAttribute,
          _id: getObjectId(`${product.slug} ${rubricAttribute.slug}`),
          productSlug: product.slug,
          productId: product._id,
          selectedOptionsSlugs,
          selectedOptionsIds,
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
