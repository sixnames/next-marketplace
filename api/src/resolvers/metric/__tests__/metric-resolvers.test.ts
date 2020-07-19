import { getTestClientWithUser } from '../../../utils/testUtils/testHelpers';
import { Metric } from '../../../entities/Metric';
import { DEFAULT_LANG, MOCK_METRICS } from '../../../config';

describe('Metric', () => {
  it('Should CRUD metric', async () => {
    const { query, mutate } = await getTestClientWithUser({});

    // Should return all metrics
    const { data: allMetrics } = await query(`
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
    } = await query(
      `
      query GetMetric($id: ID!){
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
    } = await mutate(
      `
      mutation UpdateMetric($input: UpdateMetricInput!){
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
