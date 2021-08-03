import { DEFAULT_COMPANY_SLUG, DEFAULT_LOCALE, SECONDARY_LOCALE } from '../../../../config/common';
import { RubricVariantModel } from '../../../../db/dbModels';
import { getObjectId } from 'mongo-seeding';

const rubricVariants: RubricVariantModel[] = [
  {
    _id: getObjectId('rubricVariant standard'),
    slug: DEFAULT_COMPANY_SLUG,
    companySlug: DEFAULT_COMPANY_SLUG,
    showCardButtonsBackground: true,
    showSnippetArticle: true,
    showSnippetBackground: true,
    showSnippetButtonsOnHover: false,
    showSnippetRating: true,
    gridCatalogueColumns: 2,
    nameI18n: {
      [DEFAULT_LOCALE]: 'Стандартная',
      [SECONDARY_LOCALE]: 'Standard',
    },
  },
  {
    _id: getObjectId('rubricVariant alcohol'),
    slug: 'alcohol',
    companySlug: DEFAULT_COMPANY_SLUG,
    showCardButtonsBackground: true,
    showSnippetArticle: true,
    showSnippetBackground: true,
    showSnippetButtonsOnHover: false,
    showSnippetRating: true,
    gridCatalogueColumns: 2,
    nameI18n: {
      [DEFAULT_LOCALE]: 'Алкоголь',
    },
  },
];

// @ts-ignore
export = rubricVariants;
