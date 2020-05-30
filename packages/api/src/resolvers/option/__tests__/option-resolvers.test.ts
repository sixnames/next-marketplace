import { newOption } from '../__fixtures__';
import { getTestClientWithAuthenticatedUser } from '../../../utils/test-data/testHelpers';
import { OptionModel } from '../../../entities/Option';

describe('Options', () => {
  it('Should return current option', async () => {
    const target = await OptionModel.create(newOption);
    const { query } = await getTestClientWithAuthenticatedUser();

    const {
      data: { getOption },
    } = await query(
      `
        query {
          getOption(
            id: "${target.id}"
          ) {
            name
          }
        }
      `,
    );

    expect(getOption.name).toEqual(target.name);
  });
});
