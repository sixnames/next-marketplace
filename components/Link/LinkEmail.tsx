import * as React from 'react';

interface LinkEmailInterface {
  value?: string | null;
  className?: string;
}

const LinkEmail: React.FC<LinkEmailInterface> = ({ value, className }) => {
  if (!value) {
    return <div className='whitespace-nowrap'>Не указан</div>;
  }

  return (
    <div className='whitespace-nowrap'>
      <a
        className={
          className ||
          'text-primary-text no-underline cursor-default hover:cursor-default hover:no-underline'
        }
        href={`mailto:${value}`}
      >
        {value}
      </a>
    </div>
  );
};

export default LinkEmail;
