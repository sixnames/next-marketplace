import { testClientWithContext } from '../../../utils/testUtils/testHelpers';
import {
  ATTRIBUTE_POSITION_IN_TITLE_ENUMS,
  ATTRIBUTE_VARIANTS_LIST,
  ATTRIBUTE_VIEW_VARIANTS_ENUMS,
  GENDER_ENUMS,
  iconTypesList,
} from '@yagu/config';
import { ISO_LANGUAGES } from '@yagu/mocks';
import { gql } from 'apollo-server-express';

describe('Select options', () => {
  it('Should return select options', async () => {
    const { query } = await testClientWithContext();

    // Should return icons options
    const {
      data: { getIconsList },
    } = await query<any>(gql`
      query GetGenderOptions {
        getIconsList {
          id
          nameString
        }
      }
    `);
    expect(getIconsList).toHaveLength(iconTypesList.length);

    // Should return attribute view variants options
    const {
      data: { getAttributeViewVariantsList },
    } = await query<any>(gql`
      query GetGenderOptions {
        getAttributeViewVariantsList {
          id
          nameString
        }
      }
    `);
    expect(getAttributeViewVariantsList).toHaveLength(ATTRIBUTE_VIEW_VARIANTS_ENUMS.length);

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
      data: { getAttributeVariants },
    } = await query<any>(gql`
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
      data: { getISOLanguagesList },
    } = await query<any>(gql`
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
