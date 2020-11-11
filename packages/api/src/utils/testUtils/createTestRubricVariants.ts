import { RubricVariant, RubricVariantModel } from '../../entities/RubricVariant';
import { MOCK_RUBRIC_VARIANT_ALCOHOL, MOCK_RUBRIC_VARIANT_JUICE } from '@yagu/mocks';

interface CreateTestRubricVariantsInterface {
  rubricVariantAlcohol: RubricVariant;
  rubricVariantJuice: RubricVariant;
}

export const createTestRubricVariants = async (): Promise<CreateTestRubricVariantsInterface> => {
  const rubricVariantAlcohol = await RubricVariantModel.create(MOCK_RUBRIC_VARIANT_ALCOHOL);
  const rubricVariantJuice = await RubricVariantModel.create(MOCK_RUBRIC_VARIANT_JUICE);

  return {
    rubricVariantAlcohol,
    rubricVariantJuice,
  };
};
