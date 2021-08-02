import { RubricVariantModel } from '../../../../db/dbModels';
import { getObjectId } from 'mongo-seeding';

const rubricVariants: RubricVariantModel[] = [
  {
    _id: getObjectId('rubricVariant alcohol'),
    showCardButtonsBackground: true,
    showSnippetArticle: true,
    showSnippetBackground: true,
    showSnippetButtonsOnHover: false,
    showSnippetRating: true,
    gridCatalogueColumns: 2,
    nameI18n: {
      ru: 'Алкоголь',
    },
  },
];

// @ts-ignore
export = rubricVariants;
