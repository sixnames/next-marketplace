import { RubricVariantModel, TranslationModel } from 'db/dbModels';
import { getDatabase } from 'db/mongodb';
import { ObjectId } from 'mongodb';
import {
  createTestAttributes,
  CreateTestAttributesPayloadInterface,
} from 'tests/createTestAttributes';
import { DEFAULT_LOCALE, SECONDARY_LOCALE } from 'config/common';
import { COL_RUBRIC_VARIANTS } from 'db/collectionNames';

export interface CreateTestRubricVariantsInterface extends CreateTestAttributesPayloadInterface {
  rubricVariantAlcohol: RubricVariantModel;
  rubricVariantJuice: RubricVariantModel;
  rubricVariantAlcoholDefaultName: string;
  rubricVariantAlcoholName: TranslationModel;
  rubricVariantJuiceDefaultName: string;
  rubricVariantJuiceName: TranslationModel;
}

export const createTestRubricVariants = async (): Promise<CreateTestRubricVariantsInterface> => {
  const db = await getDatabase();
  const rubricVariantsCollection = db.collection<RubricVariantModel>(COL_RUBRIC_VARIANTS);

  const attributes = await createTestAttributes();

  const rubricVariantAlcoholDefaultName = 'Алкоголь';
  const rubricVariantAlcoholName = {
    [DEFAULT_LOCALE]: rubricVariantAlcoholDefaultName,
    [SECONDARY_LOCALE]: 'Alcohol',
  };
  const rubricVariantAlcohol: RubricVariantModel = {
    _id: new ObjectId(),
    nameI18n: rubricVariantAlcoholName,
  };

  const rubricVariantJuiceDefaultName = 'Соки';
  const rubricVariantJuiceName = {
    [DEFAULT_LOCALE]: rubricVariantJuiceDefaultName,
    [SECONDARY_LOCALE]: 'Juice',
  };
  const rubricVariantJuice: RubricVariantModel = {
    _id: new ObjectId(),
    nameI18n: rubricVariantJuiceName,
  };

  await rubricVariantsCollection.insertMany([rubricVariantAlcohol, rubricVariantJuice]);

  return {
    ...attributes,
    rubricVariantAlcohol,
    rubricVariantJuice,
    rubricVariantAlcoholDefaultName,
    rubricVariantAlcoholName,
    rubricVariantJuiceDefaultName,
    rubricVariantJuiceName,
  };
};
