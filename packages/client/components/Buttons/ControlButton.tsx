import React, { Fragment } from 'react';
import classes from './ControlButton.module.css';
import Icon from '../Icon/Icon';
import { ButtonType } from '../../types';
import { IconType } from '@yagu/config';
import Tooltip from '../TTip/Tooltip';
import { noNaN } from '@yagu/shared';

export interface ControlButtonInterface {
  className?: string;
  iconClass?: string;
  children?: any;
  type?: ButtonType;
  disabled?: boolean;
  title?: string;
  icon: IconType;
  iconPositionTop?: number;
  iconPositionLeft?: number;
  onClick?: (e: any) => void;
  testId?: string;
  roundedTopLeft?: boolean;
  roundedTopRight?: boolean;
  iconSize?: 'smaller' | 'small' | 'normal' | 'mid' | 'big';
  size?: 'smaller' | 'small' | 'normal';
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
  size = 'normal',
  iconPositionLeft,
  iconPositionTop,
}) => {
  const themeClass = classes[theme];
  const sizeClass = classes[size];
  const iconSizeClass = `${iconSize === 'smaller' ? classes.smallerIcon : ''} ${
    iconSize === 'small' ? classes.smallIcon : ''
  } ${iconSize === 'mid' ? classes.midIcon : ''} ${iconSize === 'big' ? classes.bigIcon : ''}`;
  const roundedClass = `${roundedTopLeft ? classes.roundedTopLeft : ''} ${
    roundedTopRight ? classes.roundedTopRight : ''
  }`;
  const buttonClass = `${classes.butn} ${
    className ? className : ''
  } ${themeClass} ${roundedClass} ${iconSizeClass} ${sizeClass}`;

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
          <Icon
            style={{
              top: noNaN(iconPositionTop),
              left: noNaN(iconPositionLeft),
            }}
            name={icon}
            className={`${iconClass ? iconClass : ''}`}
          />
        </button>
      </Tooltip>
    </Fragment>
  );
};

export default ControlButton;
