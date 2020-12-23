import { RubricVariant, RubricVariantModel } from '../../entities/RubricVariant';
import { createTestAttributes, CreateTestAttributesPayloadInterface } from './createTestAttributes';
import { MOCK_RUBRIC_VARIANT_ALCOHOL, MOCK_RUBRIC_VARIANT_JUICE } from '@yagu/shared';

export interface CreateTestRubricVariantsInterface extends CreateTestAttributesPayloadInterface {
  rubricVariantAlcohol: RubricVariant;
  rubricVariantJuice: RubricVariant;
}

export const createTestRubricVariants = async (): Promise<CreateTestRubricVariantsInterface> => {
  const attributes = await createTestAttributes();
  const rubricVariantAlcohol = await RubricVariantModel.create(MOCK_RUBRIC_VARIANT_ALCOHOL);
  const rubricVariantJuice = await RubricVariantModel.create(MOCK_RUBRIC_VARIANT_JUICE);

  return {
    ...attributes,
    rubricVariantAlcohol,
    rubricVariantJuice,
  };
};
