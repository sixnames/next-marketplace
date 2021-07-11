import { DEFAULT_COMPANY_SLUG } from '../../../../config/common';
import { PagesGroupTemplateModel } from '../../../../db/dbModels';
import { getObjectId } from 'mongo-seeding';

const pagesGroups: PagesGroupTemplateModel[] = [
  {
    _id: getObjectId('pages group template a'),
    index: 0,
    companySlug: DEFAULT_COMPANY_SLUG,
    showInFooter: true,
    showInHeader: true,
    nameI18n: {
      ru: 'Pages group template A',
    },
  },
  {
    _id: getObjectId('pages group template b'),
    index: 1,
    companySlug: DEFAULT_COMPANY_SLUG,
    showInFooter: true,
    showInHeader: true,
    nameI18n: {
      ru: 'Pages group template B',
    },
  },
  {
    _id: getObjectId('pages group template c'),
    index: 2,
    companySlug: DEFAULT_COMPANY_SLUG,
    showInFooter: true,
    showInHeader: true,
    nameI18n: {
      ru: 'Pages group template C',
    },
  },
];

// @ts-ignore
export = pagesGroups;
