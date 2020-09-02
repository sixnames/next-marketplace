import { newOption } from '../__fixtures__';
import { authenticatedTestClient } from '../../../utils/testUtils/testHelpers';
import { OptionModel } from '../../../entities/Option';
import getLangField from '../../../utils/translations/getLangField';
import { DEFAULT_LANG } from '../../../config';
import { gql } from 'apollo-server-express';

describe('Options', () => {
  it('Should return current option', async () => {
    const target = await OptionModel.create(newOption);
    const { query } = await authenticatedTestClient();

    const {
      data: { getOption },
    } = await query<any>(gql`
        query {
          getOption(
            id: "${target.id}"
          ) {
            id
            nameString
          }
        }
      `);

    expect(getOption.nameString).toEqual(getLangField(target.name, DEFAULT_LANG));
  });
});
