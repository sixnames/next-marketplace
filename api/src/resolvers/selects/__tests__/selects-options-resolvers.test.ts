import { testClientWithContext } from '../../../utils/testUtils/testHelpers';
import {
  ATTRIBUTE_POSITION_IN_TITLE_ENUMS,
  ATTRIBUTE_VARIANTS_LIST,
  GENDER_ENUMS,
  ISO_LANGUAGES,
} from '../../../config';

describe('Select options', () => {
  it('Should return select options', async () => {
    const { query } = await testClientWithContext({});

    // Should return gender options
    const {
      data: { getGenderOptions },
    } = await query(`
      query GetGenderOptions {
        getGenderOptions {
          id
          nameString
        }
      }
    `);
    expect(getGenderOptions).toHaveLength(GENDER_ENUMS.length);

    // Should return attribute variant options
    const {
      data: { getAttributeVariants },
    } = await query(`
      query GetAttributeVariants {
        getAttributeVariants {
          id
          nameString
        }
      }
    `);
    expect(getAttributeVariants).toHaveLength(ATTRIBUTE_VARIANTS_LIST.length);

    // Should return attribute positioning options
    const {
      data: { getAttributePositioningOptions },
    } = await query(`
      query GetAttributePositioningOptions {
        getAttributePositioningOptions {
          id
          nameString
        }
      }
    `);
    expect(getAttributePositioningOptions).toHaveLength(ATTRIBUTE_POSITION_IN_TITLE_ENUMS.length);

    // Should return ISO language options
    const {
      data: { getISOLanguagesList },
    } = await query(`
      query GetISOLanguagesList {
        getISOLanguagesList {
          id
          nameString
        }
      }
    `);
    expect(getISOLanguagesList).toHaveLength(ISO_LANGUAGES.length);
  });
});
