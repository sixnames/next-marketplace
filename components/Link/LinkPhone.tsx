import * as React from 'react';
import { FormattedPhone } from 'generated/apolloComponents';

interface PhoneLinkInterface {
  value?: FormattedPhone | null;
}

const LinkPhone: React.FC<PhoneLinkInterface> = ({ value }) => {
  if (!value) {
    return <div className='whitespace-nowrap'>Не указан</div>;
  }

  return (
    <div className='whitespace-nowrap'>
      <a
        className='text-primary-text no-underline cursor-default hover:cursor-default hover:no-underline'
        href={`tel:${value.raw}`}
      >
        {value.readable}
      </a>
    </div>
  );
};

export default LinkPhone;
