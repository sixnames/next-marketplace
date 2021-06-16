import { DEFAULT_COMPANY_SLUG } from '../../../../config/common';
import { PagesGroupModel } from '../../../../db/dbModels';
import { getObjectId } from 'mongo-seeding';

const pagesGroups: PagesGroupModel[] = [
  {
    _id: getObjectId('pages group a'),
    index: 0,
    companySlug: DEFAULT_COMPANY_SLUG,
    showInFooter: true,
    showInHeader: true,
    nameI18n: {
      ru: 'Pages group A',
    },
  },
  {
    _id: getObjectId('pages group b'),
    index: 1,
    companySlug: DEFAULT_COMPANY_SLUG,
    showInFooter: true,
    showInHeader: true,
    nameI18n: {
      ru: 'Pages group B',
    },
  },
  {
    _id: getObjectId('pages group c'),
    index: 1,
    companySlug: DEFAULT_COMPANY_SLUG,
    showInFooter: true,
    showInHeader: true,
    nameI18n: {
      ru: 'Pages group C',
    },
  },
];

// @ts-ignore
export = pagesGroups;
