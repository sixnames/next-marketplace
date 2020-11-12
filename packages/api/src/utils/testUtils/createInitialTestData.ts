import createInitialData, {
  CreateInitialDataPayloadInterface,
} from '../initialData/createInitialData';
import {
  createTestSecondaryCity,
  CreateTestSecondaryCityInterface,
} from './createTestSecondaryCity';
import {
  createTestSecondaryCountry,
  CreateTestSecondaryCountryPayloadInterface,
} from './createTestSecondaryCountry';
import {
  createTestSecondaryLanguage,
  CreateTestSecondaryLanguageInterface,
} from './createTestSecondaryLanguage';
import { SECONDARY_CURRENCY } from '@yagu/config';

interface CreateInitialTestDataPayloadInterface
  extends CreateInitialDataPayloadInterface,
    CreateTestSecondaryCityInterface,
    CreateTestSecondaryCountryPayloadInterface,
    CreateTestSecondaryLanguageInterface {}

export const createInitialTestData = async (): Promise<CreateInitialTestDataPayloadInterface> => {
  const initialPayload = await createInitialData();

  // Currencies
  const secondaryCurrency = initialPayload.initialCurrenciesPayload.find(({ nameString }) => {
    return nameString === SECONDARY_CURRENCY;
  });
  if (!secondaryCurrency) {
    throw Error('secondaryCurrency not fond on createInitialTestData');
  }

  // Cities
  const citiesPayload = await createTestSecondaryCity();
  const { secondaryCity } = citiesPayload;

  // Countries
  const countriesPayload = await createTestSecondaryCountry({
    citiesIds: [secondaryCity.id],
    currencySlug: secondaryCurrency.nameString,
  });

  // Languages
  const languagesPayload = await createTestSecondaryLanguage();

  return {
    ...initialPayload,
    ...citiesPayload,
    ...countriesPayload,
    ...languagesPayload,
  };
};
