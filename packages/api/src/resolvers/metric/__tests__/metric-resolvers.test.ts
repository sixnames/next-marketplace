import { getTestClientWithUser } from '../../../utils/test-data/testHelpers';
import { MOCK_METRICS } from '@rg/config';
import { Metric } from '../../../entities/Metric';

describe('Metric', () => {
  it('Should CRUD metric', async () => {
    const { query, mutate } = await getTestClientWithUser();

    // Should return all metrics
    const { data: allMetrics } = await query(`
      query {
        getAllMetrics {
          id
          name
        }
      }
    `);
    const allMetricsList: Metric[] = allMetrics.getAllMetrics;
    expect(allMetricsList).toHaveLength(MOCK_METRICS.length);

    // Should return current metric
    const currentMetric = allMetricsList[0];
    const {
      data: { getMetric },
    } = await query(
      `
      query GetMetric($id: ID!){
        getMetric(id: $id) {
          id
          name
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
    const {
      data: { createMetric: createMetricWithError },
    } = await mutate(
      `
      mutation CreateMetric($input: CreateMetricInput!){
        createMetric(input: $input) {
          success
          message
          metric {
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
          },
        },
      },
    );
    expect(createMetricWithError.success).toBeFalsy();

    // Should create metric
    const newMetricName = 'new';
    const {
      data: { createMetric },
    } = await mutate(
      `
      mutation CreateMetric($input: CreateMetricInput!){
        createMetric(input: $input) {
          success
          message
          metric {
            id
            name
          }
        }
      }
    `,
      {
        variables: {
          input: {
            name: newMetricName,
          },
        },
      },
    );
    expect(createMetric.success).toBeTruthy();
    expect(createMetric.metric.name).toEqual(newMetricName);

    // Should update metric
    const updatedMetricName = 'new';
    const {
      data: { updateMetric },
    } = await mutate(
      `
      mutation UpdateMetric($input: UpdateMetricInput!){
        updateMetric(input: $input) {
          success
          message
          metric {
            id
            name
          }
        }
      }
    `,
      {
        variables: {
          input: {
            id: createMetric.metric.id,
            name: updatedMetricName,
          },
        },
      },
    );
    expect(updateMetric.success).toBeTruthy();
    expect(updateMetric.metric.name).toEqual(updatedMetricName);

    // Should delete metric
    const {
      data: { deleteMetric },
    } = await mutate(
      `
      mutation DeleteMetric($id: ID!){
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
