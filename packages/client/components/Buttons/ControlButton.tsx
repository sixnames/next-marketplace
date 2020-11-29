import React, { Fragment } from 'react';
import classes from './ControlButton.module.css';
import Icon from '../Icon/Icon';
import { ButtonType } from '../../types';
import { IconType } from '@yagu/config';
import Tooltip from '../TTip/Tooltip';

export interface ControlButtonInterface {
  className?: string;
  iconClass?: string;
  children?: any;
  type?: ButtonType;
  disabled?: boolean;
  title?: string;
  icon: IconType;
  onClick?: (e: any) => void;
  testId?: string;
  roundedTopLeft?: boolean;
  roundedTopRight?: boolean;
  theme?: 'blank' | 'accent';
}

const ControlButton: React.FC<ControlButtonInterface> = ({
  title = '',
  type = 'button',
  disabled = false,
  icon,
  iconClass,
  className,
  testId,
  roundedTopLeft,
  roundedTopRight,
  theme = 'blank',
  onClick,
}) => {
  const themeClass = classes[theme];
  const roundedClass = `${roundedTopLeft ? classes.roundedTopLeft : ''} ${
    roundedTopRight ? classes.roundedTopRight : ''
  }`;
  const buttonClass = `${classes.frame} ${
    className ? className : ''
  } ${themeClass} ${roundedClass}`;

  return (
    <Fragment>
      <Tooltip title={!disabled ? title : null}>
        <button
          onClick={onClick}
          data-cy={testId}
          disabled={disabled}
          type={type}
          className={buttonClass}
        >
          <Icon name={icon} className={`${iconClass ? iconClass : ''}`} />
        </button>
      </Tooltip>
    </Fragment>
  );
};

export default ControlButton;
