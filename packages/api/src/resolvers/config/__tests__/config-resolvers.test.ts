import { mutateWithImages, authenticatedTestClient } from '../../../utils/testUtils/testHelpers';
import { Upload } from '../../../types/upload';
import { gql } from 'apollo-server-express';
import createTestData from '../../../utils/testUtils/createTestData';
import clearTestData from '../../../utils/testUtils/clearTestData';
import {
  DEFAULT_CITY,
  DEFAULT_LANG,
  SECONDARY_CITY,
  SECONDARY_LANG,
  SITE_CONFIGS_All,
  SITE_CONFIGS_INITIAL,
  SITE_CONFIGS_LOGO,
} from '@yagu/shared';

describe('Config', () => {
  beforeEach(async () => {
    await createTestData();
  });

  afterEach(async () => {
    await clearTestData();
  });

  it('Should CRUD site config', async () => {
    const stringConfig = SITE_CONFIGS_INITIAL[0];
    const stringConfigCity = stringConfig.cities[0];
    const { query, mutate } = await authenticatedTestClient();

    // Should return all site configs
    const {
      data: { getAllConfigs },
    } = await query<any>(
      gql`
        query GetAllConfigs {
          getAllConfigs {
            id
            nameString
            value
            slug
          }
        }
      `,
    );
    expect(getAllConfigs).toHaveLength(SITE_CONFIGS_All.length);

    // Should return site config by slug
    const {
      data: { getConfigBySlug },
    } = await query<any>(
      gql`
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
    } = await query<any>(
      gql`
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
    expect(getConfigValueBySlug).toEqual(stringConfigCity.translations[0].value);

    // Should update asset config
    const {
      data: { updateAssetConfig },
    } = await mutateWithImages({
      mutation: gql`
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
      fileNames: ['test-logo.svg'],
    });

    const updatedAssetConfig = updateAssetConfig.configs.find(
      ({ slug }: any) => slug === getConfigBySlug.slug,
    );

    expect(updateAssetConfig.success).toBeTruthy();
    expect(updatedAssetConfig.value).toEqual(['/assets/config/siteLogo/siteLogo-0.svg']);

    // Shouldn't update non asset configs on validation error
    const { errors: updateConfigsValidationError } = await mutate<any>(
      gql`
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
          input: getAllConfigs.map(({ id }: any) => ({
            id,
            cities: [],
          })),
        },
      },
    );
    expect(updateConfigsValidationError).toBeDefined();

    // Should update single non asset config
    const updateConfigPayload = await mutate<any>(
      gql`
        mutation UpdateConfig($input: UpdateConfigInput!) {
          updateConfig(input: $input) {
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
          input: {
            id: getConfigBySlug.id,
            cities: [
              {
                key: DEFAULT_CITY,
                translations: [
                  {
                    key: DEFAULT_LANG,
                    value: [`new translation`],
                  },
                  {
                    key: SECONDARY_LANG,
                    value: [`new translation`],
                  },
                ],
              },
              {
                key: SECONDARY_CITY,
                translations: [
                  {
                    key: DEFAULT_LANG,
                    value: [`new translation`],
                  },
                  {
                    key: SECONDARY_LANG,
                    value: [`new translation`],
                  },
                ],
              },
            ],
          },
        },
      },
    );
    const {
      data: { updateConfig },
    } = updateConfigPayload;
    expect(updateConfig.success).toBeTruthy();

    // Should update non asset configs
    const {
      data: { updateConfigs },
    } = await mutate<any>(
      gql`
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
            cities: [
              {
                key: DEFAULT_CITY,
                translations: [
                  {
                    key: DEFAULT_LANG,
                    value: [`value-${index}`],
                  },
                ],
              },
            ],
          })),
        },
      },
    );
    const updatedConfig = updateConfigs.configs.find(({ slug }: any) => slug === stringConfig.slug);
    expect(updateConfigs.success).toBeTruthy();
    expect(updateConfigs.configs).toHaveLength(SITE_CONFIGS_All.length);
    expect(updatedConfig.value).not.toEqual(stringConfigCity.translations[0].value);
  });
});
