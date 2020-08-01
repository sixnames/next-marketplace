import { getTestClientWithUser } from '../../../utils/testUtils/testHelpers';
import { MOCK_CITIES } from '../../../config';

describe('City', () => {
  it('Should return cities', async () => {
    const { query } = await getTestClientWithUser({});

    // Should return cities list
    const {
      data: { getAllCities },
    } = await query(
      `
      query GetAllCities {
        getAllCities {
          id
          nameString
        }
      }
      `,
    );
    const currentCity = getAllCities[0];
    expect(getAllCities).toHaveLength(MOCK_CITIES.length);

    // Should return current city
    const {
      data: { getCity },
    } = await query(
      `
      query GetCity($id: ID!) {
        getCity(id: $id) {
          id
          nameString
        }
      }
      `,
      {
        variables: {
          id: currentCity.id,
        },
      },
    );
    expect(getCity.id).toEqual(currentCity.id);
    expect(getCity.nameString).toEqual(currentCity.nameString);
  });
});
