import { EventRubricModel, GenderModel, ObjectIdModel } from 'db/dbModels';
import { DEFAULT_CITY, DEFAULT_COMPANY_SLUG, GENDER_SHE } from 'lib/config/common';
import { getObjectId, getObjectIds } from 'mongo-seeding';
import attributes from '../attributes/attributes';

function getAttributeIds(groupIds: string[]) {
  return attributes.reduce((acc: ObjectIdModel[], attribute) => {
    const exist = groupIds.some((_idString) => {
      return getObjectId(_idString).equals(attribute.attributesGroupId);
    });
    if (exist) {
      return [...acc, attribute._id];
    }
    return acc;
  }, []);
}

const common = {
  companySlug: 'company_a',
  companyId: getObjectId('company Company A'),
  capitalise: true,
  active: true,
  showRubricNameInProductTitle: true,
  gender: GENDER_SHE as GenderModel,
  cmsCardAttributeIds: getAttributeIds(['attributesGroup Общие характеристики']),
  filterVisibleAttributeIds: getAttributeIds(['attributesGroup Общие характеристики']),
  attributesGroupIds: getObjectIds(['attributesGroup Общие характеристики']),
  views: {
    [DEFAULT_COMPANY_SLUG]: {
      [DEFAULT_CITY]: 50,
    },
  },
};

const eventRubricA = 'Лекции';
const eventRubricB = 'Мастер-классы';

const eventRubrics: EventRubricModel[] = [
  {
    _id: getObjectId('event_rubric_a'),
    slug: 'event_rubric_a',
    nameI18n: {
      ru: eventRubricA,
    },
    descriptionI18n: {
      ru: eventRubricA,
    },
    shortDescriptionI18n: {
      ru: eventRubricA,
    },
    defaultTitleI18n: {
      ru: eventRubricA,
    },
    keywordI18n: {
      ru: eventRubricA,
    },
    prefixI18n: {
      ru: '',
    },
    ...common,
  },
  {
    _id: getObjectId('event_rubric_b'),
    slug: 'event_rubric_b',
    nameI18n: {
      ru: eventRubricB,
    },
    descriptionI18n: {
      ru: eventRubricB,
    },
    shortDescriptionI18n: {
      ru: eventRubricB,
    },
    defaultTitleI18n: {
      ru: eventRubricB,
    },
    keywordI18n: {
      ru: eventRubricB,
    },
    prefixI18n: {
      ru: '',
    },
    ...common,
  },
];

// @ts-ignore
export = eventRubrics;
