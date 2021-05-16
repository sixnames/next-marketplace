import { RubricVariantModel } from '../../../../db/dbModels';
import { getObjectId } from 'mongo-seeding';

const rubricVariants: RubricVariantModel[] = [
  {
    _id: getObjectId('rubricVariant alcohol'),
    nameI18n: {
      ru: 'Алкоголь',
    },
  },
];

// @ts-ignore
export = rubricVariants;
