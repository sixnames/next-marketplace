import { testClientWithContext } from '../../../utils/testUtils/testHelpers';
import { DEFAULT_LANG } from '../../../config';
import { gql } from 'apollo-server-express';

describe('Language', () => {
  it('Should CRUD language', async () => {
    const { query } = await testClientWithContext();
    const keys = ['validation.string.min', 'validation.string.max'];

    // Should return message list
    const {
      data: { getMessagesByKeys },
    } = await query<any>(
      gql`
        query GetMessagesByKeys($keys: [String!]!) {
          getMessagesByKeys(keys: $keys) {
            key
          }
        }
      `,
      {
        variables: {
          keys,
        },
      },
    );
    expect(getMessagesByKeys).toHaveLength(keys.length);

    // Should return current message
    const {
      data: { getMessage },
    } = await query<any>(
      gql`
        query GetMessage($key: String!) {
          getMessage(key: $key) {
            key
            message {
              key
              value
            }
          }
        }
      `,
      {
        variables: {
          key: 'validation.email',
        },
      },
    );
    const defaultLangMassage = getMessage.message.find(({ key }: any) => key === DEFAULT_LANG);
    expect(defaultLangMassage.value).toEqual('Не валидный формат Email адреса.');

    // Should return validation messages
    const {
      data: { getValidationMessages },
    } = await query<any>(gql`
      query GetValidationMessages {
        getValidationMessages {
          key
          message {
            key
            value
          }
        }
      }
    `);
    expect(getValidationMessages).toBeDefined();
  });
});
