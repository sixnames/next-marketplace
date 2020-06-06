import React, { useEffect } from 'react';
import useSound from 'use-sound';
import Icon, { IconType } from '../Icon/Icon';
// TODO [Slava] Link
// import Link from '../Link/Link';
import ButtonCross from '../Buttons/ButtonCross';
import { NotificationType } from '../../types';
import classes from './Notification.module.css';

interface NotificationInterface {
  type: NotificationType;
  title?: string;
  message?: string;
  path?: string;
  icon?: IconType;
  playSound?: boolean;
  closeHandler: () => void;
  testId?: string;
}

const Notification: React.FC<NotificationInterface> = ({
  type = 'success',
  title = '',
  message = '',
  path = '',
  icon = 'Error',
  playSound = false,
  testId,
  closeHandler,
}) => {
  const [play] = useSound('/sounds/definite.mp3');
  let typeColor;

  useEffect(() => {
    if (playSound) {
      play({ id: 'testId' });
    }
  }, [playSound, play]);

  switch (type) {
    case 'warning': {
      typeColor = '#f68620';
      break;
    }

    case 'error': {
      typeColor = '#ec482f';
      break;
    }

    default:
      typeColor = '#1fd600';
  }

  return (
    <div style={{ borderColor: typeColor }} className={classes.frame} data-cy={testId}>
      <Icon name={icon} className={classes.icon} style={{ fill: typeColor }} />

      <div className={classes.content}>
        <div className={classes.title}>{title}</div>
        {path ? (
          <a href={`${path}`} className={classes.message} onClick={closeHandler}>
            {message}
          </a>
        ) : (
          <div>{message}</div>
        )}
      </div>

      <ButtonCross className={classes.close} onClick={closeHandler} testId={'close-notification'} />
    </div>
  );
};

export default Notification;
