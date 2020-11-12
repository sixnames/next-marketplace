import { RubricVariant, RubricVariantModel } from '../../entities/RubricVariant';
import { MOCK_RUBRIC_VARIANT_ALCOHOL, MOCK_RUBRIC_VARIANT_JUICE } from '@yagu/mocks';
import { createTestAttributes, CreateTestAttributesPayloadInterface } from './createTestAttributes';

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
