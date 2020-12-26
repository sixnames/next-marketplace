import React from 'react';
import classes from './Currency.module.css';
import { useLanguageContext } from '../../context/languageContext';
import { getCurrencyString } from '../../utils/intl';

interface CurrencyInterface {
  value?: string | number | null;
  className?: string;
  valueClassName?: string;
  testId?: string;
}

const Currency: React.FC<CurrencyInterface> = ({ value, className, valueClassName, testId }) => {
  const { currency, lang } = useLanguageContext();
  const finalValue =
    typeof value === 'number'
      ? getCurrencyString({
          lang,
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
