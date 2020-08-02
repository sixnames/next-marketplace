import { getTestClientWithUser, mutateWithImages } from '../../../utils/testUtils/testHelpers';
import {
  SITE_CONFIGS_All,
  SITE_CONFIGS_INITIAL,
  SITE_CONFIGS_LOGO,
  SITE_CONFIGS_LOGO_NAME,
} from '../../../config';
import { Upload } from '../../../types/upload';

describe('Config', () => {
  it('Should CRUD site config', async () => {
    const stringConfig = SITE_CONFIGS_INITIAL[0];
    const { query, mutate } = await getTestClientWithUser({});

    // Should return all site configs
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
    expect(getAllConfigs).toHaveLength(SITE_CONFIGS_All.length);

    // Should return site config by slug
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
          slug: SITE_CONFIGS_LOGO.slug,
        },
      },
    );
    expect(getConfigBySlug.nameString).toEqual(SITE_CONFIGS_LOGO.nameString);

    // Should return site config value by slug
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
          slug: stringConfig.slug,
        },
      },
    );
    expect(getConfigValueBySlug).toEqual(stringConfig.value);

    // Should update asset config
    const {
      data: { updateAssetConfig },
    } = await mutateWithImages({
      mutation: `
      mutation UpdateAssetConfig($input: UpdateAssetConfigInput!) {
        updateAssetConfig(input: $input) {
          success
          message
          configs {
            id
            nameString
            value
            slug
          }
        }
      }
      `,
      input: (images: Promise<Upload>[]) => {
        return {
          id: getConfigBySlug.id,
          value: images,
        };
      },
      fileNames: ['test-logo.svg', 'test-logo-icon.svg'],
    });

    const updatedAssetConfig = updateAssetConfig.configs.find(
      ({ slug }: any) => slug === getConfigBySlug.slug,
    );
    expect(updateAssetConfig.success).toBeTruthy();
    expect(updatedAssetConfig.value).toEqual([
      '/assets/config/siteLogo/siteLogo-0.svg',
      '/assets/config/siteLogo/siteLogo-1.svg',
    ]);

    // Should update non asset configs
    const {
      data: { updateConfigs },
    } = await mutate(
      `
      mutation UpdateConfigs($input: [UpdateConfigInput!]!) {
        updateConfigs(input: $input) {
          success
          message
          configs {
            id
            nameString
            value
            slug
          }
        }
      }
      `,
      {
        variables: {
          input: getAllConfigs.map(({ id }: any, index: number) => ({
            id,
            value: [`value-${index}`],
          })),
        },
      },
    );
    const updatedConfig = updateConfigs.configs.find(({ slug }: any) => slug === stringConfig.slug);
    expect(updateConfigs.success).toBeTruthy();
    expect(updateConfigs.configs).toHaveLength(SITE_CONFIGS_All.length);
    expect(updatedConfig.value).not.toEqual(stringConfig.value);
  });
});
