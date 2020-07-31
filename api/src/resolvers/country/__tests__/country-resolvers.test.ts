import { getTestClientWithUser } from '../../../utils/testUtils/testHelpers';
import { DEFAULT_LANG, MOCK_COUNTRIES } from '../../../config';

describe('Country', () => {
  it('Should CRUD countries and cities', async () => {
    const { query, mutate } = await getTestClientWithUser({});

    // Should return countries list with cities
    const {
      data: { getAllCountries },
    } = await query(
      `
        query GetAllCountries {
          getAllCountries {
            id
            nameString
            currency
            cities {
              id
              nameString
              key
              name {
                key
                value
              }
            }
          }
        }
      `,
    );
    const currentCountry = getAllCountries[0];
    const currentCountryCity = currentCountry.cities[0];
    expect(getAllCountries).toHaveLength(MOCK_COUNTRIES.length);
    expect(currentCountry.cities).toHaveLength(1);

    // Should return current country
    const {
      data: { getCountry },
    } = await query(
      `
        query GetCountry($id: ID!) {
          getCountry(id: $id) {
            id
            nameString
            currency
            cities {
              id
              nameString
              key
            }
          }
        }
      `,
      {
        variables: {
          id: currentCountry.id,
        },
      },
    );
    expect(getCountry.id).toEqual(currentCountry.id);
    expect(getCountry.nameString).toEqual(currentCountry.nameString);

    // Shouldn't create city on duplicate error
    const {
      data: { addCityToCountry: addCityToCountryDuplicate },
    } = await mutate(
      `
        mutation AddCityToCountry($input: AddCityToCountryInput!) {
          addCityToCountry(input: $input) {
            success
            message
            country {
              id
              nameString
              currency
              cities {
                id
                nameString
              }
            }
          }
        }
      `,
      {
        variables: {
          input: {
            countryId: currentCountry.id,
            key: currentCountryCity.key,
            name: currentCountryCity.name,
          },
        },
      },
    );
    expect(addCityToCountryDuplicate.success).toBeFalsy();

    // Should create city and add it to the country
    const newCityKey = 'key';
    const newCityName = 'City';
    const {
      data: { addCityToCountry },
    } = await mutate(
      `
        mutation AddCityToCountry($input: AddCityToCountryInput!) {
          addCityToCountry(input: $input) {
            success
            message
            country {
              id
              nameString
              currency
              cities {
                id
                nameString
                key
              }
            }
          }
        }
      `,
      {
        variables: {
          input: {
            countryId: currentCountry.id,
            key: newCityKey,
            name: [{ key: DEFAULT_LANG, value: newCityName }],
          },
        },
      },
    );
    const createdCity = addCityToCountry.country.cities.find(({ key }: any) => key === newCityKey);
    expect(addCityToCountry.success).toBeTruthy();
    expect(addCityToCountry.country.cities).toHaveLength(2);
    expect(createdCity.nameString).toEqual(newCityName);
    expect(createdCity.key).toEqual(newCityKey);

    // Should update city in country
    const updatedCityKey = 'updated';
    const updatedCityName = 'updated';
    const {
      data: { updateCityInCountry },
    } = await mutate(
      `
        mutation UpdateCityInCountry($input: UpdateCityInCountryInput!) {
          updateCityInCountry(input: $input) {
            success
            message
            country {
              id
              nameString
              currency
              cities {
                id
                nameString
                key
              }
            }
          }
        }
      `,
      {
        variables: {
          input: {
            countryId: currentCountry.id,
            cityId: createdCity.id,
            key: updatedCityKey,
            name: [{ key: DEFAULT_LANG, value: updatedCityName }],
          },
        },
      },
    );
    const updatedCity = updateCityInCountry.country.cities.find(
      ({ id }: any) => id === createdCity.id,
    );
    expect(addCityToCountry.success).toBeTruthy();
    expect(updatedCity.nameString).toEqual(updatedCityName);
    expect(updatedCity.key).toEqual(updatedCityKey);

    // Should update city in country
    const {
      data: { deleteCityFromCountry },
    } = await mutate(
      `
        mutation DeleteCityFromCountry($input: DeleteCityFromCountryInput!) {
          deleteCityFromCountry(input: $input) {
            success
            message
            country {
              id
              nameString
              currency
              cities {
                id
                nameString
                key
              }
            }
          }
        }
      `,
      {
        variables: {
          input: {
            countryId: currentCountry.id,
            cityId: updatedCity.id,
          },
        },
      },
    );
    expect(deleteCityFromCountry.success).toBeTruthy();
    expect(deleteCityFromCountry.country.cities).toHaveLength(1);
  });
});
