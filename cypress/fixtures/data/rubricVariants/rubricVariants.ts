import {
  CARD_LAYOUT_HALF_COLUMNS,
  CATALOGUE_FILTER_LAYOUT_CHECKBOX_TREE,
  CATALOGUE_HEAD_LAYOUT_WITH_CATEGORIES,
  GRID_SNIPPET_LAYOUT_BIG_IMAGE,
  NAV_DROPDOWN_LAYOUT_WITH_CATEGORIES,
  ROW_SNIPPET_LAYOUT_BIG_IMAGE,
} from '../../../../config/constantSelects';
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
    cardLayout: CARD_LAYOUT_HALF_COLUMNS,
    catalogueFilterLayout: CATALOGUE_FILTER_LAYOUT_CHECKBOX_TREE,
    catalogueHeadLayout: CATALOGUE_HEAD_LAYOUT_WITH_CATEGORIES,
    catalogueNavLayout: NAV_DROPDOWN_LAYOUT_WITH_CATEGORIES,
    gridSnippetLayout: GRID_SNIPPET_LAYOUT_BIG_IMAGE,
    rowSnippetLayout: ROW_SNIPPET_LAYOUT_BIG_IMAGE,
    showCardBrands: true,
    showCardImagesSlider: true,
    showCatalogueFilterBrands: true,
    showCategoriesInNav: true,
    showCategoriesInFilter: true,
    nameI18n: {
      [DEFAULT_LOCALE]: 'Вода',
    },
  },
];

// @ts-ignore
export = rubricVariants;
