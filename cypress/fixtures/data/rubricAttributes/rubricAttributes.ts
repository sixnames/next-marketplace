import {
  ATTRIBUTE_VARIANT_MULTIPLE_SELECT,
  ATTRIBUTE_VARIANT_SELECT,
  CATEGORY_SLUG_PREFIX,
  DEFAULT_COUNTERS_OBJECT,
} from '../../../../config/common';
import {
  RubricModel,
  RubricAttributeModel,
  ObjectIdModel,
  AttributeModel,
} from '../../../../db/dbModels';
import { getObjectId } from 'mongo-seeding';
import attributes from '../attributes/attributes';
import rubrics from '../rubrics/rubrics';

interface GetRubricAttributesInterface {
  rubric: RubricModel;
  categoryId?: ObjectIdModel | null;
  categorySlug?: string | null;
  attributes: AttributeModel[];
}

function getRubricAttributes({
  rubric,
  categoryId,
  categorySlug,
  attributes,
}: GetRubricAttributesInterface): RubricAttributeModel[] {
  return attributes.map((attribute) => {
    const visible =
      attribute.variant === ATTRIBUTE_VARIANT_SELECT ||
      attribute.variant === ATTRIBUTE_VARIANT_MULTIPLE_SELECT;

    return {
      ...attribute,
      ...DEFAULT_COUNTERS_OBJECT,
      _id: getObjectId(`${rubric.slug} ${attribute.slug}${categorySlug ? ` ${categorySlug}` : ''}`),
      showInCatalogueFilter: visible,
      showInCatalogueNav: visible,
      rubricSlug: rubric.slug,
      rubricId: rubric._id,
      categoryId,
      categorySlug,
      attributeId: attribute._id,
      attributesGroupId: attribute.attributesGroupId,
      showInCategoryFilter: true,
    };
  });
}

function getCurrentGroupAttributes(_id: ObjectIdModel): AttributeModel[] {
  return attributes.filter(({ attributesGroupId }) => {
    return attributesGroupId && attributesGroupId.equals(_id);
  });
}

const commonAttributes = getCurrentGroupAttributes(
  getObjectId('attributesGroup Общие характеристики'),
);

const rubricAttributes = rubrics.reduce((acc: RubricAttributeModel[], rubric) => {
  let rubricAttributes: RubricAttributeModel[] = [];

  if (rubric.nameI18n.ru === 'Шампанское') {
    const rubricRawAttributes = getCurrentGroupAttributes(
      getObjectId('attributesGroup Характеристики шампанского'),
    );
    rubricAttributes = getRubricAttributes({
      rubric,
      attributes: [...commonAttributes, ...rubricRawAttributes],
    });
  }

  if (rubric.nameI18n.ru === 'Виски') {
    const rubricRawAttributes = getCurrentGroupAttributes(
      getObjectId('attributesGroup Характеристики виски'),
    );
    rubricAttributes = getRubricAttributes({
      rubric,
      attributes: [...commonAttributes, ...rubricRawAttributes],
      categoryId: getObjectId('category Односолодовый'),
      categorySlug: `${CATEGORY_SLUG_PREFIX}1`,
    });
  }

  if (rubric.nameI18n.ru === 'Вино') {
    const rubricRawAttributes = getCurrentGroupAttributes(
      getObjectId('attributesGroup Характеристики вина'),
    );
    rubricAttributes = getRubricAttributes({
      rubric,
      attributes: [...commonAttributes, ...rubricRawAttributes],
    });
  }

  return [...acc, ...rubricAttributes];
}, []);

// @ts-ignore
export = rubricAttributes;
