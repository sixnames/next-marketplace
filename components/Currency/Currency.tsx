import * as React from 'react';
import classes from './Currency.module.css';
import { useLocaleContext } from 'context/localeContext';
import { getCurrencyString } from 'lib/i18n';

interface CurrencyInterface {
  value?: string | number | null;
  className?: string;
  valueClassName?: string;
  testId?: string;
}

const Currency: React.FC<CurrencyInterface> = ({ value, className, valueClassName, testId }) => {
  const { currency, locale } = useLocaleContext();
  const finalValue =
    typeof value === 'number'
      ? getCurrencyString({
          locale,
          value,
        })
      : value;

  return (
    <span className={`${classes.frame} ${className ? className : ''}`}>
      <span
        data-cy={testId}
        data-price-value={value}
        className={`${valueClassName ? valueClassName : ''}`}
      >
        {finalValue || 0}
      </span>
      {currency}
    </span>
  );
};

export default Currency;
