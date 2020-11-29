import React from 'react';
import classes from './Currency.module.css';
import { useUserContext } from '../../context/userContext';
import { noNaN } from '@yagu/shared';

interface CurrencyInterface {
  value?: string | null;
  className?: string;
}

const Currency: React.FC<CurrencyInterface> = ({ value, className }) => {
  const { currency } = useUserContext();

  return (
    <span className={`${classes.frame} ${className ? className : ''}`}>
      <span>{noNaN(value)}</span>
      {currency}
    </span>
  );
};

export default Currency;
