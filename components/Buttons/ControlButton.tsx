import * as React from 'react';
import classes from './ControlButton.module.css';
import Icon from '../Icon/Icon';
import Tooltip from '../TTip/Tooltip';
import { noNaN } from 'lib/numbers';
import { ButtonType } from 'types/clientTypes';
import { IconType } from 'types/iconTypes';

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
  ariaLabel?: string;
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
  ariaLabel,
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
    <React.Fragment>
      <Tooltip title={!disabled ? title : null}>
        <button
          aria-label={ariaLabel}
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
    </React.Fragment>
  );
};

export default ControlButton;
