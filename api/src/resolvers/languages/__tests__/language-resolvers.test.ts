import { getTestClientWithUser } from '../../../utils/testUtils/testHelpers';
import { ISO_LANGUAGES, MOCK_LANGUAGES } from '../../../config';
import { Language } from '../../../entities/Language';

describe('Language', () => {
  it('Should CRUD language', async () => {
    const { query, mutate } = await getTestClientWithUser({});

    // Should return all languages and languages ISO list
    const {
      data: { getAllLanguages, getISOLanguagesList },
    } = await query(`
      query {
        getAllLanguages {
          id
          key
          name
          isDefault
        }
        getISOLanguagesList {
          id
          nameString
          nativeName
        }
      }
    `);
    expect(getAllLanguages).toHaveLength(MOCK_LANGUAGES.length);
    expect(getISOLanguagesList).toHaveLength(ISO_LANGUAGES.length);

    // Should return current language
    const currentLanguage = getAllLanguages[0];
    const {
      data: { getLanguage },
    } = await query(
      `
      query GetLanguage($id: ID!){
        getLanguage(id: $id) {
          id
          name
        }
      }
    `,
      {
        variables: {
          id: currentLanguage.id,
        },
      },
    );
    expect(getLanguage.id).toEqual(currentLanguage.id);

    // Shouldn't create language on validation error
    const {
      data: { createLanguage: createLanguageWithError },
    } = await mutate(
      `
      mutation CreateLanguage($input: CreateLanguageInput!){
        createLanguage(input: $input) {
          success
          message
          language {
            id
            name
          }
        }
      }
    `,
      {
        variables: {
          input: {
            name: '',
            key: '',
          },
        },
      },
    );
    expect(createLanguageWithError.success).toBeFalsy();

    // Shouldn't create language on duplicate error
    const {
      data: { createLanguage: createLanguageWithDuplicateError },
    } = await mutate(
      `
      mutation CreateLanguage($input: CreateLanguageInput!){
        createLanguage(input: $input) {
          success
          message
          language {
            id
            name
          }
        }
      }
    `,
      {
        variables: {
          input: {
            name: currentLanguage.name,
            key: currentLanguage.key,
          },
        },
      },
    );
    expect(createLanguageWithDuplicateError.success).toBeFalsy();

    // Should create language
    const newLanguageName = ISO_LANGUAGES[0].nameString;
    const newLanguageKey = ISO_LANGUAGES[0].id;
    const {
      data: { createLanguage },
    } = await mutate(
      `
      mutation CreateLanguage($input: CreateLanguageInput!){
        createLanguage(input: $input) {
          success
          message
          language {
            id
            name
            key
            isDefault
          }
        }
      }
    `,
      {
        variables: {
          input: {
            name: newLanguageName,
            key: newLanguageKey,
          },
        },
      },
    );
    expect(createLanguage.success).toBeTruthy();
    expect(createLanguage.language.name).toEqual(newLanguageName);
    expect(createLanguage.language.key).toEqual(newLanguageKey);
    expect(createLanguage.language.isDefault).toBeFalsy();

    // Should set language as default
    const {
      data: { setLanguageAsDefault },
    } = await mutate(
      `
      mutation SetLanguageAsDefault($id: ID!){
        setLanguageAsDefault(id: $id) {
          success
          message
          language {
            id
            name
            key
            isDefault
          }
        }
      }
    `,
      {
        variables: {
          id: createLanguage.language.id,
        },
      },
    );
    const {
      data: { getAllLanguages: updatedAllLanguages },
    } = await query(`
      query {
        getAllLanguages {
          id
          key
          name
          isDefault
        }
      }
    `);
    const oldDefaultLanguage = updatedAllLanguages.find(
      ({ id }: Language) => id === currentLanguage.id,
    );
    const newDefaultLanguage = setLanguageAsDefault.language;
    expect(setLanguageAsDefault.success).toBeTruthy();
    expect(oldDefaultLanguage.isDefault).toBeFalsy();
    expect(newDefaultLanguage.isDefault).toBeTruthy();

    // Should update language
    const languageNewName = 'new';
    const languageNewKey = 'ne';
    const {
      data: { updateLanguage },
    } = await mutate(
      `
      mutation UpdateLanguage($input: UpdateLanguageInput!){
        updateLanguage(input: $input) {
          success
          message
          language {
            id
            name
            key
            isDefault
          }
        }
      }
    `,
      {
        variables: {
          input: {
            id: newDefaultLanguage.id,
            name: languageNewName,
            key: languageNewKey,
          },
        },
      },
    );
    const updatedDefaultLanguage = updateLanguage.language;
    expect(updateLanguage.success).toBeTruthy();
    expect(updatedDefaultLanguage.name).toEqual(languageNewName);
    expect(updatedDefaultLanguage.key).toEqual(languageNewKey);

    // Shouldn't delete default language
    const {
      data: { deleteLanguage: deleteLanguageWithError },
    } = await mutate(
      `
      mutation DeleteLanguage($id: ID!){
        deleteLanguage(id: $id) {
          success
          message
        }
      }
    `,
      {
        variables: {
          id: updatedDefaultLanguage.id,
        },
      },
    );
    expect(deleteLanguageWithError.success).toBeFalsy();

    // Should delete language
    const {
      data: { deleteLanguage },
    } = await mutate(
      `
      mutation DeleteLanguage($id: ID!){
        deleteLanguage(id: $id) {
          success
          message
        }
      }
    `,
      {
        variables: {
          id: oldDefaultLanguage.id,
        },
      },
    );
    expect(deleteLanguage.success).toBeTruthy();
  });
});
