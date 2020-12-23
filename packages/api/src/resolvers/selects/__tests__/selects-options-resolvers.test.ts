import { testClientWithContext } from '../../../utils/testUtils/testHelpers';
import { gql } from 'apollo-server-express';
import createTestData from '../../../utils/testUtils/createTestData';
import clearTestData from '../../../utils/testUtils/clearTestData';
import {
  ATTRIBUTE_POSITION_IN_TITLE_ENUMS,
  ATTRIBUTE_VARIANTS_LIST,
  ATTRIBUTE_VIEW_VARIANTS_ENUMS,
  GENDER_ENUMS,
  iconTypesList,
  ISO_LANGUAGES,
} from '@yagu/shared';

describe('Select options', () => {
  beforeEach(async () => {
    await createTestData();
  });

  afterEach(async () => {
    await clearTestData();
  });

  it('Should return select options', async () => {
    const { query } = await testClientWithContext();

    // Should return icons options
    const {
      data: { getIconsOptions },
    } = await query<any>(gql`
      query GetGenderOptions {
        getIconsOptions {
          id
          nameString
        }
      }
    `);
    expect(getIconsOptions).toHaveLength(iconTypesList.length);

    // Should return attribute view variants options
    const {
      data: { getAttributeViewVariantsOptions },
    } = await query<any>(gql`
      query GetGenderOptions {
        getAttributeViewVariantsOptions {
          id
          nameString
        }
      }
    `);
    expect(getAttributeViewVariantsOptions).toHaveLength(ATTRIBUTE_VIEW_VARIANTS_ENUMS.length);

    // Should return gender options
    const {
      data: { getGenderOptions },
    } = await query<any>(gql`
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
      data: { getAttributeVariantsOptions },
    } = await query<any>(gql`
      query GetAttributeVariants {
        getAttributeVariantsOptions {
          id
          nameString
        }
      }
    `);
    expect(getAttributeVariantsOptions).toHaveLength(ATTRIBUTE_VARIANTS_LIST.length);

    // Should return attribute positioning options
    const {
      data: { getAttributePositioningOptions },
    } = await query<any>(gql`
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
      data: { getISOLanguagesOptions },
    } = await query<any>(gql`
      query GetISOLanguagesList {
        getISOLanguagesOptions {
          id
          nameString
        }
      }
    `);
    expect(getISOLanguagesOptions).toHaveLength(ISO_LANGUAGES.length);
  });
});
