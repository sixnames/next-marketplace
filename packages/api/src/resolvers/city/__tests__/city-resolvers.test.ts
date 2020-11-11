import { authenticatedTestClient } from '../../../utils/testUtils/testHelpers';
import { MOCK_CITIES } from '@yagu/mocks';
import { gql } from 'apollo-server-express';
import createTestData from '../../../utils/testUtils/createTestData';
import clearTestData from '../../../utils/testUtils/clearTestData';

describe('City', () => {
  beforeEach(async () => {
    await createTestData();
  });

  afterEach(async () => {
    await clearTestData();
  });

  it('Should return cities', async () => {
    const { query } = await authenticatedTestClient();

    // Should return cities list
    const {
      data: { getAllCities },
    } = await query<any>(
      gql`
        query GetAllCities {
          getAllCities {
            id
            nameString
            slug
          }
        }
      `,
    );
    const currentCity = getAllCities[0];
    expect(getAllCities).toHaveLength(MOCK_CITIES.length);

    // Should return current city
    const {
      data: { getCity },
    } = await query<any>(
      gql`
        query GetCity($id: ID!) {
          getCity(id: $id) {
            id
            nameString
            slug
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

    // Should return current city
    const {
      data: { getCityBySlug },
    } = await query<any>(
      gql`
        query GetCityBySlug($slug: String!) {
          getCityBySlug(slug: $slug) {
            id
            nameString
            slug
          }
        }
      `,
      {
        variables: {
          slug: currentCity.slug,
        },
      },
    );
    expect(getCityBySlug.id).toEqual(currentCity.id);
    expect(getCityBySlug.nameString).toEqual(currentCity.nameString);
  });
});
