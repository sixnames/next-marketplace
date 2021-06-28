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
    index: 2,
    companySlug: DEFAULT_COMPANY_SLUG,
    showInFooter: true,
    showInHeader: true,
    nameI18n: {
      ru: 'Pages group C',
    },
  },
  {
    _id: getObjectId('company pages group a'),
    index: 0,
    companySlug: 'company_a',
    showInFooter: true,
    showInHeader: true,
    nameI18n: {
      ru: 'Company pages group A',
    },
  },
  {
    _id: getObjectId('company pages group b'),
    index: 1,
    companySlug: 'company_a',
    showInFooter: true,
    showInHeader: true,
    nameI18n: {
      ru: 'Company pages group B',
    },
  },
];

// @ts-ignore
export = pagesGroups;
