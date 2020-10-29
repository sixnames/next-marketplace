import { authenticatedTestClient } from '../../../utils/testUtils/testHelpers';
import { DEFAULT_LANG } from '@yagu/config';
import { MOCK_COUNTRIES } from '@yagu/mocks';
import { gql } from 'apollo-server-express';

describe('Country', () => {
  it('Should CRUD countries and cities', async () => {
    const { query, mutate } = await authenticatedTestClient();

    // Should return countries list with cities
    const {
      data: { getAllCountries },
    } = await query<any>(gql`
      query GetAllCountries {
        getAllCountries {
          id
          nameString
          currency
          cities {
            id
            nameString
            slug
            name {
              key
              value
            }
          }
        }
      }
    `);
    const currentCountry = getAllCountries[0];
    const countryForDelete = getAllCountries[1];
    const currentCountryCity = currentCountry.cities[0];
    const countryForDeleteCity = countryForDelete.cities[0];
    expect(getAllCountries).toHaveLength(MOCK_COUNTRIES.length);
    expect(currentCountry.cities).toHaveLength(1);

    // Should return current country
    const {
      data: { getCountry },
    } = await query<any>(
      gql`
        query GetCountry($id: ID!) {
          getCountry(id: $id) {
            id
            nameString
            currency
            cities {
              id
              nameString
              slug
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

    // Shouldn't create country on validation error
    const { errors: createCountryErrors } = await mutate<any>(
      gql`
        mutation CreateCountry($input: CreateCountryInput!) {
          createCountry(input: $input) {
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
            nameString: 'f',
            currency: 'b',
          },
        },
      },
    );
    expect(createCountryErrors).toBeDefined();

    // Shouldn't create country on duplicate error
    const {
      data: { createCountry: createCountryDuplicateError },
    } = await mutate<any>(
      gql`
        mutation CreateCountry($input: CreateCountryInput!) {
          createCountry(input: $input) {
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
            nameString: currentCountry.nameString,
            currency: currentCountry.currency,
          },
        },
      },
    );
    expect(createCountryDuplicateError.success).toBeFalsy();

    // Should create country
    const newCountryName = 'country';
    const newCountryCurrency = 'currency';
    const {
      data: { createCountry },
    } = await mutate<any>(
      gql`
        mutation CreateCountry($input: CreateCountryInput!) {
          createCountry(input: $input) {
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
            nameString: newCountryName,
            currency: newCountryCurrency,
          },
        },
      },
    );
    expect(createCountry.success).toBeTruthy();
    expect(createCountry.country.nameString).toEqual(newCountryName);
    expect(createCountry.country.currency).toEqual(newCountryCurrency);

    // Shouldn't update country on validation error
    const { errors: updateCountryErrors } = await mutate<any>(
      gql`
        mutation UpdateCountry($input: UpdateCountryInput!) {
          updateCountry(input: $input) {
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
            id: getCountry.id,
            nameString: 'f',
            currency: 'b',
          },
        },
      },
    );
    expect(updateCountryErrors).toBeDefined();

    // Should update country
    const updatedCountryName = 'new country';
    const updatedCountryCurrency = 'new currency';
    const {
      data: { updateCountry },
    } = await mutate<any>(
      gql`
        mutation UpdateCountry($input: UpdateCountryInput!) {
          updateCountry(input: $input) {
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
            id: getCountry.id,
            nameString: updatedCountryName,
            currency: updatedCountryCurrency,
          },
        },
      },
    );
    expect(updateCountry.success).toBeTruthy();
    expect(updateCountry.country.nameString).toEqual(updatedCountryName);
    expect(updateCountry.country.currency).toEqual(updatedCountryCurrency);

    // Should delete country
    const {
      data: { deleteCountry },
    } = await mutate<any>(
      gql`
        mutation deleteCountry($id: ID!) {
          deleteCountry(id: $id) {
            success
            message
          }
        }
      `,
      {
        variables: {
          id: countryForDelete.id,
        },
      },
    );
    const { errors } = await mutate<any>(
      gql`
        query GetCity($id: ID!) {
          getCity(id: $id) {
            id
          }
        }
      `,
      {
        variables: {
          id: countryForDeleteCity.id,
        },
      },
    );
    expect(deleteCountry.success).toBeTruthy();
    expect(errors).toBeDefined();

    // Shouldn't create city on validation error
    const { errors: addCityToCountryErrors } = await mutate<any>(
      gql`
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
            slug: 'f',
            name: [{ key: DEFAULT_LANG, value: 'b' }],
          },
        },
      },
    );
    expect(addCityToCountryErrors).toBeDefined();

    // Shouldn't create city on duplicate error
    const {
      data: { addCityToCountry: addCityToCountryDuplicate },
    } = await mutate<any>(
      gql`
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
            slug: currentCountryCity.slug,
            name: currentCountryCity.name,
          },
        },
      },
    );
    expect(addCityToCountryDuplicate.success).toBeFalsy();

    // Should create city and add it to the country
    const newCitySlug = 'slug';
    const newCityName = 'City';
    const {
      data: { addCityToCountry },
    } = await mutate<any>(
      gql`
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
                slug
              }
            }
          }
        }
      `,
      {
        variables: {
          input: {
            countryId: currentCountry.id,
            slug: newCitySlug,
            name: [{ key: DEFAULT_LANG, value: newCityName }],
          },
        },
      },
    );
    const createdCity = addCityToCountry.country.cities.find(
      ({ slug }: any) => slug === newCitySlug,
    );
    expect(addCityToCountry.success).toBeTruthy();
    expect(addCityToCountry.country.cities).toHaveLength(2);
    expect(createdCity.nameString).toEqual(newCityName);
    expect(createdCity.slug).toEqual(newCitySlug);

    // Shouldn't update city in country on validation error
    const { errors: updateCityInCountryErrors } = await mutate<any>(
      gql`
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
                slug
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
            slug: 'f',
            name: [{ key: DEFAULT_LANG, value: 'f' }],
          },
        },
      },
    );
    expect(updateCityInCountryErrors).toBeDefined();

    // Should update city in country
    const updatedCitySlug = 'updated';
    const updatedCityName = 'updated';
    const {
      data: { updateCityInCountry },
    } = await mutate<any>(
      gql`
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
                slug
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
            slug: updatedCitySlug,
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
    expect(updatedCity.slug).toEqual(updatedCitySlug);

    // Shouldn't delete city from country on validation error
    const { errors: deleteCityFromCountryErrors } = await mutate<any>(
      gql`
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
                slug
              }
            }
          }
        }
      `,
      {
        variables: {
          input: {
            countryId: '',
            cityId: '',
          },
        },
      },
    );
    expect(deleteCityFromCountryErrors).toBeDefined();

    // Should delete city from country
    const {
      data: { deleteCityFromCountry },
    } = await mutate<any>(
      gql`
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
                slug
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