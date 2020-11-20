import React from 'react';
import classes from './Currency.module.css';
import { useUserContext } from '../../context/userContext';

interface CurrencyInterface {
  value: string;
  className?: string;
}

const Currency: React.FC<CurrencyInterface> = ({ value, className }) => {
  const { currency } = useUserContext();

  return (
    <span className={`${classes.frame} ${className ? className : ''}`}>
      <span>{value}</span>
      {currency}
    </span>
  );
};

export default Currency;
