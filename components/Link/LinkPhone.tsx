import * as React from 'react';
import { FormattedPhoneModel } from '../../db/dbModels';

interface PhoneLinkInterface {
  value?: FormattedPhoneModel | null;
  className?: string;
  style?: React.CSSProperties;
}

const LinkPhone: React.FC<PhoneLinkInterface> = ({ value, style, className }) => {
  if (!value) {
    return <div className='whitespace-nowrap'>Не указан</div>;
  }

  return (
    <div className='whitespace-nowrap'>
      <a
        style={style}
        className={
          className ||
          'cursor-default text-primary-text no-underline hover:cursor-default hover:no-underline'
        }
        href={`tel:${value.raw}`}
      >
        {value.readable}
      </a>
    </div>
  );
};

export default LinkPhone;
