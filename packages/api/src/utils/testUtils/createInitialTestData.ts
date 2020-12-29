import createInitialData, {
  CreateInitialDataPayloadInterface,
} from '../initialData/createInitialData';
import {
  DEFAULT_LANG,
  SECONDARY_CITY,
  SECONDARY_COUNTRY,
  SECONDARY_CURRENCY,
  SECONDARY_LANG,
} from '@yagu/shared';
import { CurrencyModel } from '../../entities/Currency';
import { City, CityModel } from '../../entities/City';
import { Country, CountryModel } from '../../entities/Country';
import { Language, LanguageModel } from '../../entities/Language';

export interface CreateInitialTestDataPayloadInterface extends CreateInitialDataPayloadInterface {
  secondaryCity: City;
  secondaryCountry: Country;
  secondaryLanguage: Language;
}

export const createInitialTestData = async (): Promise<CreateInitialTestDataPayloadInterface> => {
  const initialPayload = await createInitialData();

  // Currencies
  const secondaryCurrency = await CurrencyModel.create({ nameString: SECONDARY_CURRENCY });

  // Cities
  const secondaryCity = await CityModel.create({
    name: [
      { key: DEFAULT_LANG, value: 'Нью Йорк' },
      { key: SECONDARY_LANG, value: 'New York' },
    ],
    slug: SECONDARY_CITY,
  });

  // Countries
  const secondaryCountry = await CountryModel.create({
    nameString: SECONDARY_COUNTRY,
    cities: [secondaryCity.id],
    currency: secondaryCurrency.nameString,
  });

  // Languages
  const secondaryLanguage = await LanguageModel.create({
    key: SECONDARY_LANG,
    name: 'English',
    nativeName: 'en',
    isDefault: false,
  });

  return {
    ...initialPayload,
    secondaryCity,
    secondaryCountry,
    secondaryLanguage,
  };
};
