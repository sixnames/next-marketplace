import React from 'react';
import classes from './Currency.module.css';
import { useLanguageContext } from '../../context/languageContext';

interface CurrencyInterface {
  value?: string | null;
  className?: string;
  valueClassName?: string;
  testId?: string;
}

const Currency: React.FC<CurrencyInterface> = ({ value, className, valueClassName, testId }) => {
  const { currency } = useLanguageContext();

  return (
    <span className={`${classes.frame} ${className ? className : ''}`}>
      <span
        data-cy={testId}
        data-price-value={value}
        className={`${valueClassName ? valueClassName : ''}`}
      >
        {value || 0}
      </span>
      {currency}
    </span>
  );
};

export default Currency;
