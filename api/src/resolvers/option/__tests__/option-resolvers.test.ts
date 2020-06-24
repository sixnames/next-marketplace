import { newOption } from '../__fixtures__';
import { getTestClientWithAuthenticatedUser } from '../../../utils/testUtils/testHelpers';
import { OptionModel } from '../../../entities/Option';
import getLangField from '../../../utils/getLangField';
import { DEFAULT_LANG } from '../../../config';

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
            id
            nameString
          }
        }
      `,
    );

    expect(getOption.nameString).toEqual(getLangField(target.name, DEFAULT_LANG));
  });
});
