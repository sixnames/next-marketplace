import { PagesGroupModel } from '../../../../db/dbModels';
import { getObjectId } from 'mongo-seeding';

const pagesGroups: PagesGroupModel[] = [
  {
    _id: getObjectId('pages group a'),
    index: 0,
    nameI18n: {
      ru: 'Group A',
    },
  },
  {
    _id: getObjectId('pages group b'),
    index: 1,
    nameI18n: {
      ru: 'Group B',
    },
  },
];

// @ts-ignore
export = pagesGroups;
