import { CurrencyModel } from '../../../../db/dbModels';
import { getObjectId } from 'mongo-seeding';

const currencies: CurrencyModel[] = [
  {
    _id: getObjectId('defaultCurrency'),
    name: 'р.',
  },
];

// @ts-ignore
export = currencies;
