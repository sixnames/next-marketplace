import { Language, LanguageModel } from '../../entities/Language';
import { MOCK_LANGUAGES } from '@yagu/shared';

export interface CreateTestSecondaryLanguageInterface {
  secondaryLanguage: Language;
}

export const createTestSecondaryLanguage = async (): Promise<CreateTestSecondaryLanguageInterface> => {
  const secondaryLanguage = await LanguageModel.create(MOCK_LANGUAGES[1]);

  return {
    secondaryLanguage,
  };
};
