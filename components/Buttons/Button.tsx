import * as React from 'react';
import Icon from '../Icon/Icon';
import classes from './Button.module.css';
import Tooltip from '../TTip/Tooltip';
import { ButtonTheme, ButtonType, SizeType } from 'types/clientTypes';
import { IconType } from 'types/iconTypes';

export interface ButtonPropsInterface {
  theme?: ButtonTheme;
  size?: SizeType;
  className?: string;
  iconClass?: string;
  children?: any;
  type?: ButtonType;
  disabled?: boolean;
  circle?: boolean;
  title?: string;
  icon?: IconType;
  onClick?: (e: any) => void;
  testId?: string;
  short?: boolean;
}

const Button: React.FC<ButtonPropsInterface> = ({
  theme = 'primary',
  size = 'normal',
  title = '',
  type = 'button',
  children,
  disabled = false,
  icon,
  iconClass,
  circle = false,
  className,
  testId,
  short,
  ...props
}) => {
  const noChildren = !children;
  const sizeClass = classes[size];
  const themeClass = classes[theme];
  const childrenClass = noChildren ? classes.noChildren : '';
  const widthClass = short ? classes.short : '';
  const circleClass = circle ? classes.circle : '';
  const additionalClass = className ? className : '';
  const buttonClass = `${classes.butn} ${sizeClass} ${widthClass} ${themeClass} ${childrenClass} ${circleClass} ${additionalClass}`;

  return (
    <React.Fragment>
      <Tooltip title={!disabled ? title : null}>
        <button data-cy={testId} disabled={disabled} className={buttonClass} type={type} {...props}>
          {icon && (
            <Icon
              name={icon}
              className={`${classes.icon} ${iconClass ? iconClass : ''} ${
                noChildren ? classes.iconNoGap : ''
              }`}
            />
          )}

          {children}
        </button>
      </Tooltip>
    </React.Fragment>
  );
};

export default Button;
