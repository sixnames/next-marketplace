import React, { useEffect, useState } from 'react';
import useSound from 'use-sound';
import Icon from '../Icon/Icon';
import { NotificationVariant } from '../../types';
import classes from './Notification.module.css';
import { IconType } from '@yagu/config';
import ButtonCross from '../Buttons/ButtonCross';

export interface NotificationInterface {
  variant: NotificationVariant;
  title?: string;
  message?: string;
  icon?: IconType;
  playSound?: boolean;
  testId?: string;
  className?: string;
  closeHandler?: () => void;
}

const Notification: React.FC<NotificationInterface> = ({
  variant = 'success',
  title = '',
  message = '',
  icon = 'exclamation',
  playSound = false,
  testId,
  className,
  closeHandler,
}) => {
  const [play] = useSound('/sounds/definite.mp3');
  const [variantColor] = useState(() => {
    if (variant === 'warning') {
      return '#f68620';
    }
    if (variant === 'error') {
      return '#ec482f';
    }
    return '#1fd600';
  });

  useEffect(() => {
    if (playSound) {
      play({ id: 'testId' });
    }
  }, [playSound, play]);

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
