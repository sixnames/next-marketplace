import { noNaN } from './numbers';

export interface GetCurrencyStringInterface {
  lang: string;
  value?: number | string | null;
}

export const getCurrencyString = ({ lang, value }: GetCurrencyStringInterface) => {
  return new Intl.NumberFormat(lang).format(noNaN(value)).replace(',', ' ');
};
