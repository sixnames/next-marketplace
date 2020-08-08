import { testClientWithContext } from '../../../utils/testUtils/testHelpers';
import { DEFAULT_LANG } from '../../../config';

describe('Language', () => {
  it('Should CRUD language', async () => {
    const { query } = await testClientWithContext();
    const keys = ['validation.string.min', 'validation.string.max'];

    // Should return message list
    const {
      data: { getMessagesByKeys },
    } = await query(
      `
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
    } = await query(
      `
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
  });
});
