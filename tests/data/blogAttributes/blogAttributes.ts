import { DEFAULT_COUNTERS_OBJECT, DEFAULT_LOCALE } from '../../../config/common';
import { BlogAttributeModel } from '../../../db/dbModels';
import { getObjectId } from 'mongo-seeding';

require('dotenv').config();

const blogAttributes: BlogAttributeModel[] = [
  {
    _id: getObjectId('blog attribute tag'),
    slug: 'tags',
    optionsGroupId: getObjectId('optionsGroup Теги'),
    nameI18n: {
      [DEFAULT_LOCALE]: 'Tags',
    },
    ...DEFAULT_COUNTERS_OBJECT,
  },
];

// @ts-ignore
export = blogAttributes;
