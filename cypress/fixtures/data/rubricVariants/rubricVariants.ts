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
  {
    _id: getObjectId('rubricVariant water'),
    slug: 'water',
    companySlug: 'default',
    showCardButtonsBackground: true,
    showSnippetArticle: true,
    showSnippetBackground: true,
    showSnippetButtonsOnHover: false,
    showSnippetRating: true,
    gridCatalogueColumns: 3,
    cardBrandsLabelI18n: {
      [DEFAULT_LOCALE]: 'Дополнительно',
    },
    cardLayout: 'half-columns',
    catalogueFilterLayout: 'checkbox-tree',
    catalogueNavLayout: 'options-only',
    gridSnippetLayout: 'big-image',
    rowSnippetLayout: 'big-image',
    showCardBrands: true,
    showCardImagesSlider: true,
    showCatalogueFilterBrands: true,
    nameI18n: {
      [DEFAULT_LOCALE]: 'Вода',
    },
  },
];

// @ts-ignore
export = rubricVariants;
