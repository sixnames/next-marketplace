import {
  ATTRIBUTE_VARIANT_MULTIPLE_SELECT,
  ATTRIBUTE_VARIANT_SELECT,
  DEFAULT_COUNTERS_OBJECT,
} from '../../../../config/common';
import { RubricModel, RubricAttributeModel, ObjectIdModel } from '../../../../db/dbModels';
import { getObjectId } from 'mongo-seeding';
import attributes from '../attributes/attributes';
import rubrics from '../rubrics/rubrics';

interface GetRubricAttributesInterface {
  rubric: RubricModel;
  categoryId?: ObjectIdModel | null;
  categorySlug?: string | null;
}

function getRubricAttributes({
  rubric,
  categoryId,
  categorySlug,
}: GetRubricAttributesInterface): RubricAttributeModel[] {
  return attributes.map((attribute) => {
    const visible =
      attribute.variant === ATTRIBUTE_VARIANT_SELECT ||
      attribute.variant === ATTRIBUTE_VARIANT_MULTIPLE_SELECT;

    return {
      ...attribute,
      ...DEFAULT_COUNTERS_OBJECT,
      _id: getObjectId(`${rubric.slug} ${attribute.slug}`),
      showInCatalogueFilter: visible,
      showInCatalogueNav: visible,
      rubricSlug: rubric.slug,
      rubricId: rubric._id,
      categoryId,
      categorySlug,
      attributeId: attribute._id,
      attributesGroupId: attribute.attributesGroupId,
      showInProductAttributes: true,
    };
  });
}

const rubricAttributes = rubrics.reduce((acc: RubricAttributeModel[], rubric) => {
  let rubricAttributes: RubricAttributeModel[];

  if (rubric.nameI18n.ru === 'Виски') {
    rubricAttributes = getRubricAttributes({
      rubric,
      categoryId: getObjectId('category Односолодовый A'),
      categorySlug: 'odnosolodovyy_a',
    });
  } else {
    rubricAttributes = getRubricAttributes({ rubric });
  }

  return [...acc, ...rubricAttributes];
}, []);

// @ts-ignore
export = rubricAttributes;
