import * as React from 'react';
import { NotificationVariant } from '../types/clientTypes';
import { IconType } from '../types/iconTypes';
import ButtonCross from './button/ButtonCross';
import WpIcon from './WpIcon';

export interface NotificationInterface {
  variant: NotificationVariant;
  title?: string;
  message?: string;
  icon?: IconType;
  testId?: string;
  className?: string;
  closeHandler?: () => void;
}

const WpNotification: React.FC<NotificationInterface> = ({
  variant = 'success',
  title = '',
  message = '',
  icon = 'exclamation',
  testId,
  className,
  closeHandler,
}) => {
  const [variantColor] = React.useState(() => {
    if (variant === 'warning') {
      return '#f68620';
    }
    if (variant === 'error') {
      return '#ec482f';
    }
    return '#1fd600';
  });

  return (
    <div
      style={{ borderColor: variantColor }}
      className={`'relative flex min-w-[15rem] rounded-lg border-l-4 bg-primary py-4 pr-[var(--controlButtonHeightSmall)] pl-3 shadow-lg dark:bg-secondary ${
        className ? className : ''
      }`}
      data-cy={testId}
    >
      <WpIcon
        name={icon}
        className='mt-[1px] mr-[10px] h-4 w-4 flex-shrink-0'
        style={{ fill: variantColor }}
      />

      <div className='grid flex-grow gap-2'>
        {title ? <div className='font-medium'>{title}</div> : null}
        {message ? <div>{message}</div> : null}
      </div>

      {closeHandler ? (
        <ButtonCross
          className='absolute top-0 right-0'
          size={'small'}
          iconSize={'smaller'}
          onClick={closeHandler}
          testId={'close-notification'}
        />
      ) : null}
    </div>
  );
};

export default WpNotification;
