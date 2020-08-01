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
    const countryForDelete = getAllCountries[1];
    const currentCountryCity = currentCountry.cities[0];
    const countryForDeleteCity = countryForDelete.cities[0];
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

    // Shouldn't create country on validation error
    const {
      data: { createCountry: createCountryValidationError },
    } = await mutate(
      `
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
    expect(createCountryValidationError.success).toBeFalsy();

    // Shouldn't create country on duplicate error
    const {
      data: { createCountry: createCountryDuplicateError },
    } = await mutate(
      `
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
    } = await mutate(
      `
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
    const {
      data: { updateCountry: updateCountryValidationError },
    } = await mutate(
      `
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
    expect(updateCountryValidationError.success).toBeFalsy();

    // Should update country
    const updatedCountryName = 'new country';
    const updatedCountryCurrency = 'new currency';
    const {
      data: { updateCountry },
    } = await mutate(
      `
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
    } = await mutate(
      `
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
    const { errors } = await mutate(
      `
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
    const {
      data: { addCityToCountry: addCityToCountryValidation },
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
            key: 'f',
            name: [{ key: DEFAULT_LANG, value: 'b' }],
          },
        },
      },
    );
    expect(addCityToCountryValidation.success).toBeFalsy();

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

    // Shouldn't update city in country on validation error
    const {
      data: { updateCityInCountry: updateCityInCountryValidationError },
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
            key: 'f',
            name: [{ key: DEFAULT_LANG, value: 'f' }],
          },
        },
      },
    );
    expect(updateCityInCountryValidationError.success).toBeFalsy();

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

    // Shouldn't delete city from country on validation error
    const {
      data: { deleteCityFromCountry: deleteCityFromCountryValidationError },
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
            countryId: '',
            cityId: '',
          },
        },
      },
    );
    expect(deleteCityFromCountryValidationError.success).toBeFalsy();

    // Should delete city from country
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
