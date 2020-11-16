import React from 'react';
import classes from './LinkPhone.module.css';
import { FormattedPhone } from '../../generated/apolloComponents';

interface PhoneLinkInterface {
  value?: FormattedPhone | null;
}

const LinkPhone: React.FC<PhoneLinkInterface> = ({ value }) => {
  if (!value) {
    return <div className={classes.frame}>Не указан</div>;
  }

  return (
    <div className={classes.frame}>
      <a href={`tel:${value.raw}`}>{value.readable}</a>
    </div>
  );
};

export default LinkPhone;
