import * as React from 'react';
import Icon from '../Icon/Icon';
import classes from './Notification.module.css';
import ButtonCross from '../Buttons/ButtonCross';
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
      className={`${classes.frame} ${className ? className : ''}`}
      data-cy={testId}
    >
      <Icon name={icon} className={classes.icon} style={{ fill: variantColor }} />

      <div className={classes.content}>
        {title ? <div className={classes.title}>{title}</div> : null}
        {message ? <div className={classes.message}>{message}</div> : null}
      </div>

      {closeHandler ? (
        <ButtonCross
          className={classes.close}
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
