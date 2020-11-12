import { City, CityModel } from '../../entities/City';
import { MOCK_CITIES } from '@yagu/mocks';

export interface CreateTestSecondaryCityInterface {
  secondaryCity: City;
}

export const createTestSecondaryCity = async (): Promise<CreateTestSecondaryCityInterface> => {
  const secondaryCity = await CityModel.create(MOCK_CITIES[1]);

  return {
    secondaryCity,
  };
};
