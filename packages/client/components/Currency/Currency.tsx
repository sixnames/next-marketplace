import React from 'react';
import classes from './Currency.module.css';
import { useLanguageContext } from '../../context/languageContext';

interface CurrencyInterface {
  value?: string | null;
  className?: string;
}

const Currency: React.FC<CurrencyInterface> = ({ value, className }) => {
  const { currency } = useLanguageContext();

  return (
    <span className={`${classes.frame} ${className ? className : ''}`}>
      <span>{value || 0}</span>
      {currency}
    </span>
  );
};

export default Currency;
