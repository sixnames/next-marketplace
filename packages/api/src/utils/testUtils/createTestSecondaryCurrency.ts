import { Currency, CurrencyModel } from '../../entities/Currency';
import { MOCK_CURRENCIES } from '@yagu/mocks';

export interface CreateSecondaryCurrencyInterface {
  secondaryCurrency: Currency;
}

export const createTestSecondaryCurrency = async (): Promise<CreateSecondaryCurrencyInterface> => {
  const secondaryCurrency = await CurrencyModel.create(MOCK_CURRENCIES[1]);

  return {
    secondaryCurrency,
  };
};
