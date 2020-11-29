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
  iconSize?: 'small' | 'normal' | 'mid' | 'big';
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
  iconSize = 'normal',
}) => {
  const themeClass = classes[theme];
  const iconSizeClass = `${iconSize === 'small' ? classes.smallIcon : ''} ${
    iconSize === 'mid' ? classes.midIcon : ''
  } ${iconSize === 'big' ? classes.bigIcon : ''}`;
  const roundedClass = `${roundedTopLeft ? classes.roundedTopLeft : ''} ${
    roundedTopRight ? classes.roundedTopRight : ''
  }`;
  const buttonClass = `${classes.frame} ${
    className ? className : ''
  } ${themeClass} ${roundedClass} ${iconSizeClass}`;

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
