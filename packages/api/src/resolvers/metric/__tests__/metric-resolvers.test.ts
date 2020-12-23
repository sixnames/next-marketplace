import { authenticatedTestClient } from '../../../utils/testUtils/testHelpers';
import { Metric } from '../../../entities/Metric';
import { gql } from 'apollo-server-express';
import createTestData from '../../../utils/testUtils/createTestData';
import clearTestData from '../../../utils/testUtils/clearTestData';
import { DEFAULT_LANG, MOCK_METRICS } from '@yagu/shared';

describe('Metric', () => {
  beforeEach(async () => {
    await createTestData();
  });

  afterEach(async () => {
    await clearTestData();
  });

  it('Should CRUD metric', async () => {
    const { query, mutate } = await authenticatedTestClient();

    // Should return all metrics
    const { data: allMetrics } = await query<any>(gql`
      query {
        getAllMetrics {
          id
          nameString
        }
      }
    `);
    const allMetricsList: Metric[] = allMetrics.getAllMetrics;
    expect(allMetricsList).toHaveLength(MOCK_METRICS.length);

    // Should return current metric
    const currentMetric = allMetricsList[0];
    const {
      data: { getMetric },
    } = await query<any>(
      gql`
        query GetMetric($id: ID!) {
          getMetric(id: $id) {
            id
            nameString
          }
        }
      `,
      {
        variables: {
          id: currentMetric.id,
        },
      },
    );
    expect(getMetric.id).toEqual(currentMetric.id);

    // Shouldn't create metric on validation error
    const { errors: createMetricErrors } = await mutate<any>(
      gql`
        mutation CreateMetric($input: CreateMetricInput!) {
          createMetric(input: $input) {
            success
            message
            metric {
              id
              nameString
            }
          }
        }
      `,
      {
        variables: {
          input: {
            name: [{ key: DEFAULT_LANG, value: '' }],
          },
        },
      },
    );
    expect(createMetricErrors).toBeDefined();

    // Should create metric
    const newMetricName = 'new';
    const {
      data: { createMetric },
    } = await mutate<any>(
      gql`
        mutation CreateMetric($input: CreateMetricInput!) {
          createMetric(input: $input) {
            success
            message
            metric {
              id
              nameString
            }
          }
        }
      `,
      {
        variables: {
          input: {
            name: [{ key: DEFAULT_LANG, value: newMetricName }],
          },
        },
      },
    );
    expect(createMetric.success).toBeTruthy();
    expect(createMetric.metric.nameString).toEqual(newMetricName);

    // Should update metric
    const updatedMetricName = 'newB';
    const {
      data: { updateMetric },
    } = await mutate<any>(
      gql`
        mutation UpdateMetric($input: UpdateMetricInput!) {
          updateMetric(input: $input) {
            success
            message
            metric {
              id
              nameString
            }
          }
        }
      `,
      {
        variables: {
          input: {
            id: createMetric.metric.id,
            name: [{ key: DEFAULT_LANG, value: updatedMetricName }],
          },
        },
      },
    );
    expect(updateMetric.success).toBeTruthy();
    expect(updateMetric.metric.nameString).toEqual(updatedMetricName);

    // Should delete metric
    const {
      data: { deleteMetric },
    } = await mutate<any>(
      gql`
        mutation DeleteMetric($id: ID!) {
          deleteMetric(id: $id) {
            success
            message
          }
        }
      `,
      {
        variables: {
          id: updateMetric.metric.id,
        },
      },
    );
    expect(deleteMetric.success).toBeTruthy();
  });
});
