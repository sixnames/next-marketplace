import { Country, CountryModel } from '../../entities/Country';
import { MOCK_COUNTRIES } from '@yagu/shared';

interface CreateTestSecondaryCountryInterface {
  citiesIds: string[];
  currencySlug: string;
}

export interface CreateTestSecondaryCountryPayloadInterface {
  secondaryCountry: Country;
}

export const createTestSecondaryCountry = async ({
  citiesIds,
  currencySlug,
}: CreateTestSecondaryCountryInterface): Promise<CreateTestSecondaryCountryPayloadInterface> => {
  const secondaryCountry = await CountryModel.create({
    ...MOCK_COUNTRIES[1],
    cities: citiesIds,
    currency: currencySlug,
  });

  return {
    secondaryCountry,
  };
};
