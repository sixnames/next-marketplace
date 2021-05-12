import {
  ATTRIBUTE_VARIANT_MULTIPLE_SELECT,
  ATTRIBUTE_VARIANT_SELECT,
  DEFAULT_COUNTERS_OBJECT,
} from '../../../../config/common';
import { RubricModel, RubricAttributeModel } from '../../../../db/dbModels';
import { getObjectId } from 'mongo-seeding';
import * as attributes from '../attributes/attributes';
import * as rubrics from '../rubrics/rubrics';

function getRubricAttributes(rubric: RubricModel): RubricAttributeModel[] {
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
      attributeId: attribute._id,
      attributesGroupId: attribute.attributesGroupId,
    };
  });
}

const rubricAttributes = rubrics.reduce((acc: RubricAttributeModel[], rubric) => {
  return [...acc, ...getRubricAttributes(rubric)];
}, []);

export = rubricAttributes;
