import * as React from 'react';
import WpIcon from 'components/WpIcon';
import ButtonCross from 'components/button/ButtonCross';
import { IconType } from 'types/iconTypes';
import { NotificationVariant } from 'types/clientTypes';

export interface NotificationInterface {
  variant: NotificationVariant;
  title?: string;
  message?: string;
  icon?: IconType;
  testId?: string;
  className?: string;
  closeHandler?: () => void;
}

const Notification: React.FC<NotificationInterface> = ({
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
      className={`'relative flex py-4 pr-[var(--controlButtonHeightSmall)] pl-3 min-w-[15rem] shadow-lg rounded-lg border-l-4 bg-primary dark:bg-secondary ${
        className ? className : ''
      }`}
      data-cy={testId}
    >
      <WpIcon
        name={icon}
        className='w-4 h-4 mt-[1px] mr-[10px] flex-shrink-0'
        style={{ fill: variantColor }}
      />

      <div className='flex-grow grid gap-2'>
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

export default Notification;
