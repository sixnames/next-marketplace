import React from 'react';
import classes from './Currency.module.css';
import { useUserContext } from '../../context/userContext';

interface CurrencyInterface {
  value?: string | null;
  className?: string;
}

const Currency: React.FC<CurrencyInterface> = ({ value, className }) => {
  const { currency } = useUserContext();

  return (
    <span className={`${classes.frame} ${className ? className : ''}`}>
      <span>{value || 0}</span>
      {currency}
    </span>
  );
};

export default Currency;
