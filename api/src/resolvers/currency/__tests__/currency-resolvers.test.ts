import { authenticatedTestClient } from '../../../utils/testUtils/testHelpers';
import { MOCK_CURRENCIES } from '../../../config';

describe('Currency', () => {
  it('Should CRUD currency', async () => {
    const { query, mutate } = await authenticatedTestClient();

    // Should return all currencies
    const {
      data: { getAllCurrencies },
    } = await query(`
      query GetAllCurrencies {
        getAllCurrencies {
          id
          nameString
        }
      }
    `);
    const currentCurrency = getAllCurrencies[0];
    expect(getAllCurrencies).toHaveLength(MOCK_CURRENCIES.length);

    const {
      data: { getCurrency },
    } = await query(`
      query GetCurrency {
        getCurrency(id: "${currentCurrency.id}") {
          id
          nameString
        }
      }
    `);
    expect(getCurrency.id).toEqual(currentCurrency.id);
    expect(getCurrency.nameString).toEqual(currentCurrency.nameString);

    // Shouldn't create new currency on validation error
    const { errors: createCurrencyErrors } = await mutate(
      `
      mutation CreateCurrency($input: CreateCurrencyInput!) {
        createCurrency(input: $input) {
          success
          message
          currency {
            id
            nameString
          }
        }
      }
    `,
      {
        variables: {
          input: { nameString: '' },
        },
      },
    );
    expect(createCurrencyErrors).toBeDefined();

    // Shouldn't create new currency on duplicate error
    const {
      data: { createCurrency: createCurrencyError },
    } = await mutate(
      `
      mutation CreateCurrency($input: CreateCurrencyInput!) {
        createCurrency(input: $input) {
          success
          message
          currency {
            id
            nameString
          }
        }
      }
    `,
      {
        variables: {
          input: { nameString: currentCurrency.nameString },
        },
      },
    );
    expect(createCurrencyError.success).toBeFalsy();

    // Should create new currency
    const newCurrencyName = 'cn';
    const {
      data: { createCurrency },
    } = await mutate(
      `
      mutation CreateCurrency($input: CreateCurrencyInput!) {
        createCurrency(input: $input) {
          success
          message
          currency {
            id
            nameString
          }
        }
      }
    `,
      {
        variables: {
          input: { nameString: newCurrencyName },
        },
      },
    );
    expect(createCurrency.success).toBeTruthy();
    expect(createCurrency.currency.nameString).toEqual(newCurrencyName);

    // Should update new currency
    const updatedCurrencyName = 'ch';
    const {
      data: { updateCurrency },
    } = await mutate(
      `
      mutation UpdateCurrency($input: UpdateCurrencyInput!) {
        updateCurrency(input: $input) {
          success
          message
          currency {
            id
            nameString
          }
        }
      }
    `,
      {
        variables: {
          input: {
            id: createCurrency.currency.id,
            nameString: updatedCurrencyName,
          },
        },
      },
    );
    expect(updateCurrency.success).toBeTruthy();
    expect(updateCurrency.currency.nameString).toEqual(updatedCurrencyName);

    // Should delete new currency
    const {
      data: { deleteCurrency },
    } = await mutate(
      `
      mutation DeleteCurrency($id: ID!) {
        deleteCurrency(id: $id) {
          success
          message
        }
      }
    `,
      {
        variables: {
          id: updateCurrency.currency.id,
        },
      },
    );
    expect(deleteCurrency.success).toBeTruthy();
  });
});
