import createInitialData, {
  CreateInitialDataPayloadInterface,
} from '../initialData/createInitialData';
import {
  CreateSecondaryCurrencyInterface,
  createTestSecondaryCurrency,
} from './createTestSecondaryCurrency';
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

interface CreateInitialTestDataPayloadInterface
  extends CreateInitialDataPayloadInterface,
    CreateSecondaryCurrencyInterface,
    CreateTestSecondaryCityInterface,
    CreateTestSecondaryCountryPayloadInterface,
    CreateTestSecondaryLanguageInterface {}

export const createInitialTestData = async (): Promise<CreateInitialTestDataPayloadInterface> => {
  const initialPayload = await createInitialData();

  // Currencies
  const currencyPayload = await createTestSecondaryCurrency();
  const { secondaryCurrency } = currencyPayload;

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
    ...currencyPayload,
    ...citiesPayload,
    ...countriesPayload,
    ...languagesPayload,
  };
};
