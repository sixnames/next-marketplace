import { getTestClientWithUser } from '../../../utils/testUtils/testHelpers';
import {
  SITE_CONFIGS_INITIAL,
  SITE_CONFIGS_LOGO,
  SITE_CONFIGS_LOGO_ICON,
  SITE_CONFIGS_LOGO_NAME,
  SITE_CONFIGS_PREVIEW_IMAGE,
} from '../../../config';

describe('Config', () => {
  it('Should CRUD site config', async () => {
    const { query } = await getTestClientWithUser({});

    const {
      data: { getAllConfigs },
    } = await query(
      `
      query GetAllConfigs {
        getAllConfigs {
          id
          nameString
          value
          slug
        }
      }
      `,
      {
        variables: {
          slug: SITE_CONFIGS_LOGO_NAME.slug,
        },
      },
    );
    expect(getAllConfigs).toHaveLength(
      [
        SITE_CONFIGS_LOGO,
        SITE_CONFIGS_LOGO_ICON,
        SITE_CONFIGS_LOGO_NAME,
        SITE_CONFIGS_PREVIEW_IMAGE,
        ...SITE_CONFIGS_INITIAL,
      ].length,
    );

    const {
      data: { getConfigBySlug },
    } = await query(
      `
      query GetConfigBySlug($slug: String!) {
        getConfigBySlug(slug: $slug) {
          id
          nameString
          value
          slug
        }
      }
      `,
      {
        variables: {
          slug: SITE_CONFIGS_LOGO_NAME.slug,
        },
      },
    );
    expect(getConfigBySlug.nameString).toEqual(SITE_CONFIGS_LOGO_NAME.nameString);

    const {
      data: { getConfigValueBySlug },
    } = await query(
      `
      query GetConfigValueBySlug($slug: String!) {
        getConfigValueBySlug(slug: $slug)
      }
      `,
      {
        variables: {
          slug: SITE_CONFIGS_INITIAL[0].slug,
        },
      },
    );
    expect(getConfigValueBySlug).toEqual(SITE_CONFIGS_INITIAL[0].value);
  });
});
