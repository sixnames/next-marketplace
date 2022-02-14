import { DEFAULT_CITY, DEFAULT_COMPANY_SLUG, GENDER_SHE } from 'config/common';
import { EventRubricModel, GenderModel, ObjectIdModel } from 'db/dbModels';
import { getObjectId, getObjectIds } from 'mongo-seeding';
import attributes from '../attributes/attributes';

const booleans = {
  capitalise: true,
  active: true,
  showRubricNameInProductTitle: true,
};

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

const eventRubrics: EventRubricModel[] = [
  {
    _id: getObjectId('event_rubric_a'),
    slug: 'event_rubric_a',
    nameI18n: {
      ru: 'Event rubric A',
    },
    descriptionI18n: {
      ru: 'Event rubric A',
    },
    shortDescriptionI18n: {
      ru: 'Event rubric A',
    },
    defaultTitleI18n: {
      ru: 'Event rubric A',
    },
    keywordI18n: {
      ru: 'Event rubric A',
    },
    prefixI18n: {
      ru: '',
    },
    gender: GENDER_SHE as GenderModel,
    cmsCardAttributeIds: getAttributeIds(['attributesGroup Общие характеристики']),
    filterVisibleAttributeIds: getAttributeIds(['attributesGroup Общие характеристики']),
    attributesGroupIds: getObjectIds(['attributesGroup Общие характеристики']),
    ...booleans,
    views: {
      [DEFAULT_COMPANY_SLUG]: {
        [DEFAULT_CITY]: 50,
      },
    },
  },
  {
    _id: getObjectId('event_rubric_b'),
    slug: 'event_rubric_b',
    nameI18n: {
      ru: 'Event rubric B',
    },
    descriptionI18n: {
      ru: 'Event rubric B',
    },
    shortDescriptionI18n: {
      ru: 'Event rubric B',
    },
    defaultTitleI18n: {
      ru: 'Event rubric B',
    },
    keywordI18n: {
      ru: 'Event rubric B',
    },
    prefixI18n: {
      ru: '',
    },
    gender: GENDER_SHE as GenderModel,
    cmsCardAttributeIds: getAttributeIds(['attributesGroup Общие характеристики']),
    filterVisibleAttributeIds: getAttributeIds(['attributesGroup Общие характеристики']),
    attributesGroupIds: getObjectIds(['attributesGroup Общие характеристики']),
    ...booleans,
    views: {
      [DEFAULT_COMPANY_SLUG]: {
        [DEFAULT_CITY]: 50,
      },
    },
  },
];

// @ts-ignore
export = eventRubrics;
