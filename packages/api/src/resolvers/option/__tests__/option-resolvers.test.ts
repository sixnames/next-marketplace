import { newOption } from '../__fixtures__';
import { authenticatedTestClient } from '../../../utils/testUtils/testHelpers';
import { OptionModel } from '../../../entities/Option';
import getLangField from '../../../utils/translations/getLangField';
import { DEFAULT_LANG } from '@yagu/config';
import { gql } from 'apollo-server-express';
import createTestData from '../../../utils/testUtils/createTestData';
import clearTestData from '../../../utils/testUtils/clearTestData';

describe('Options', () => {
  beforeEach(async () => {
    await createTestData();
  });

  afterEach(async () => {
    await clearTestData();
  });

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
