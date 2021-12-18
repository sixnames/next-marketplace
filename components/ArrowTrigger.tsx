import * as React from 'react';
import WpIcon from 'components/WpIcon';

interface ArrowTriggerInterface {
  name: string;
  arrowPosition?: 'left' | 'right';
  onClick: () => void;
}

const ArrowTrigger: React.FC<ArrowTriggerInterface> = ({
  name,
  onClick,
  arrowPosition = 'right',
}) => {
  const iconClassName = 'w-5 h-5';

  return (
    <div
      className='flex items-center whitespace-nowrap text-theme cursor-pointer'
      onClick={onClick}
    >
      {arrowPosition === 'left' ? (
        <WpIcon className={`${iconClassName} mr-4`} name={'arrow-left'} />
      ) : null}
      {name}
      {arrowPosition === 'right' ? (
        <WpIcon className={`${iconClassName} ml-4`} name={'arrow-right'} />
      ) : null}
    </div>
  );
};

export default ArrowTrigger;
