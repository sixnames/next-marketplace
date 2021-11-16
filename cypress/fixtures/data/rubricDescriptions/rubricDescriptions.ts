import { getConstructorContentFromText } from '../../../../lib/stringUtils';
import { DEFAULT_CITY, DEFAULT_COMPANY_SLUG } from '../../../../config/common';
import { RubricDescriptionModel } from '../../../../db/dbModels';
import { getObjectId } from 'mongo-seeding';

const rubricDescriptions: RubricDescriptionModel[] = [
  {
    _id: getObjectId('description A'),
    rubricId: getObjectId('rubric Виски'),
    rubricSlug: 'viski',
    companySlug: DEFAULT_COMPANY_SLUG,
    position: 'top',
    assetKeys: [],
    content: {
      [DEFAULT_CITY]: getConstructorContentFromText(
        'Rubric top Lorem ipsum dolor sit amet, consectetur adipisicing elit. Alias, doloribus laborum maxime non nulla pariatur repellendus tenetur vel. Alias doloremque dolores earum ipsa magnam maxime nemo quos repellendus suscipit veritatis.',
      ),
    },
  },
  {
    _id: getObjectId('description B'),
    rubricId: getObjectId('rubric Виски'),
    rubricSlug: 'viski',
    companySlug: DEFAULT_COMPANY_SLUG,
    position: 'bottom',
    assetKeys: [],
    content: {
      [DEFAULT_CITY]: getConstructorContentFromText(
        'Rubric bottom Lorem ipsum dolor sit amet, consectetur adipisicing elit. Alias, doloribus laborum maxime non nulla pariatur repellendus tenetur vel. Alias doloremque dolores earum ipsa magnam maxime nemo quos repellendus suscipit veritatis.',
      ),
    },
  },
];

// @ts-ignore
export = rubricDescriptions;
