import {
  ATTRIBUTE_VARIANT_NUMBER,
  ATTRIBUTE_VARIANT_STRING,
  FILTER_SEPARATOR,
  DEFAULT_COUNTERS_OBJECT,
} from '../../../../config/common';
import { ObjectIdModel, ProductAttributeModel } from '../../../../db/dbModels';
import { getObjectId } from 'mongo-seeding';
import attributes from '../attributes/attributes';
import products from '../products/products';
import rubrics from '../rubrics/rubrics';
import options from '../options/options';
import categories from '../categories/categories';

const attributeText = `
Lorem ipsum dolor sit amet, consectetur adipisicing elit. Animi debitis eligendi eum, excepturi iure libero molestias quas quis ratione reiciendis sed sequi sint sit! Architecto minus modi officia provident voluptates.
      Lorem ipsum dolor sit amet, consectetur adipisicing elit. Animi debitis eligendi eum, excepturi iure libero molestias quas quis ratione reiciendis sed sequi sint sit! Architecto minus modi officia provident voluptates.
`;

const productAttributes: ProductAttributeModel[] = products.reduce(
  (acc: ProductAttributeModel[], product) => {
    const rubric = rubrics.find(({ _id }) => {
      return _id.equals(product.rubricId);
    });
    if (!rubric) {
      return acc;
    }

    const rubricAttributes = attributes.filter(({ attributesGroupId }) => {
      return rubric.attributesGroupIds.some((_id) => _id.equals(attributesGroupId));
    });

    const productCategories = categories.filter(({ slug }) => {
      return product.selectedOptionsSlugs.some((optionSlug) => slug === optionSlug);
    });

    productCategories.forEach((category) => {
      const currentCategoryAttributes = attributes.filter(({ attributesGroupId }) => {
        return category.attributesGroupIds.some((_id) => _id.equals(attributesGroupId));
      });
      currentCategoryAttributes.forEach((attribute) => {
        const exist = rubricAttributes.some(({ _id }) => attribute._id.equals(_id));
        if (!exist) {
          rubricAttributes.push(attribute);
        }
      });
    });

    const currentProductAttributes: ProductAttributeModel[] = rubricAttributes.map(
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

        const payload: ProductAttributeModel = {
          ...rubricAttribute,
          _id: getObjectId(`${product.slug} ${rubricAttribute.slug}`),
          rubricSlug: rubric.slug,
          rubricId: rubric._id,
          attributeId: rubricAttribute._id,
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

        return payload;
      },
    );

    return [...acc, ...currentProductAttributes];
  },
  [],
);

// @ts-ignore
export = productAttributes;
