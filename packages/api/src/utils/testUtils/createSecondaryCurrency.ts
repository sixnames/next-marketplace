import { Currency, CurrencyModel } from '../../entities/Currency';
import { MOCK_CURRENCIES } from '@yagu/mocks';

interface CreateSecondaryCurrencyInterface {
  secondaryCurrency: Currency;
}

export const createSecondaryCurrency = async (): Promise<CreateSecondaryCurrencyInterface> => {
  const secondaryCurrency = await CurrencyModel.create(MOCK_CURRENCIES[1]);

  return {
    secondaryCurrency,
  };
};
