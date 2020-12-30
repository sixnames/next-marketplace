import { RubricVariant, RubricVariantModel } from '../../entities/RubricVariant';
import { createTestAttributes, CreateTestAttributesPayloadInterface } from './createTestAttributes';
import { DEFAULT_LANG, SECONDARY_LANG } from '@yagu/shared';
import { Translation } from '../../entities/Translation';

export interface CreateTestRubricVariantsInterface extends CreateTestAttributesPayloadInterface {
  rubricVariantAlcohol: RubricVariant;
  rubricVariantJuice: RubricVariant;
  rubricVariantAlcoholDefaultName: string;
  rubricVariantAlcoholName: Translation[];
  rubricVariantJuiceDefaultName: string;
  rubricVariantJuiceName: Translation[];
}

export const createTestRubricVariants = async (): Promise<CreateTestRubricVariantsInterface> => {
  const attributes = await createTestAttributes();
  const rubricVariantAlcoholDefaultName = 'Алкоголь';
  const rubricVariantAlcoholName = [
    { key: DEFAULT_LANG, value: rubricVariantAlcoholDefaultName },
    { key: SECONDARY_LANG, value: 'Alcohol' },
  ];
  const rubricVariantAlcohol = await RubricVariantModel.create({
    name: rubricVariantAlcoholName,
  });

  const rubricVariantJuiceDefaultName = 'Соки';
  const rubricVariantJuiceName = [
    { key: DEFAULT_LANG, value: rubricVariantJuiceDefaultName },
    { key: SECONDARY_LANG, value: 'Alcohol' },
  ];
  const rubricVariantJuice = await RubricVariantModel.create({
    name: rubricVariantJuiceName,
  });

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
