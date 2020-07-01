import React, { Fragment } from 'react';
import Icon, { IconType } from '../Icon/Icon';
import Tooltip from '@material-ui/core/Tooltip';
import { withStyles } from '@material-ui/core';
import { StyledComponentProps } from '@material-ui/styles/withStyles/withStyles';
import { ButtonTheme, ButtonType, SizeType, TooltipPlacement } from '../../types';
import classes from './Button.module.css';

export interface ButtonPropsInterface extends StyledComponentProps {
  theme?: ButtonTheme;
  size?: SizeType;
  className?: string;
  iconClass?: string;
  children?: any;
  type?: ButtonType;
  disabled?: boolean;
  circle?: boolean;
  title?: string;
  tooltipPlacement?: TooltipPlacement;
  icon?: IconType;
  onClick?: (e: any) => void;
  testId?: string;
  classes?: any;
}

const custom = {
  popper: {
    opacity: 1,
  },
  tooltip: {
    fontSize: '0.8em',
    color: 'white',
    backgroundColor: '#5c626e',
    boxShadow: `0 1px 10px -1px rgba(0, 0, 0, 0.4)`,
  },
};

const Button: React.FC<ButtonPropsInterface> = ({
  theme = 'primary',
  size = 'normal',
  title = '',
  tooltipPlacement = 'top',
  type = 'button',
  children,
  disabled = false,
  icon,
  iconClass,
  circle = false,
  classes: tooltipClasses,
  className,
  testId,
  ...props
}) => {
  const noChildren = !children;
  const sizeClass = classes[size];
  const themeClass = classes[theme];
  const childrenClass = noChildren ? classes.noChildren : '';
  const circleClass = circle ? classes.circle : '';
  const additionalClass = className ? className : '';
  const buttonClass = `${classes.butn} ${sizeClass} ${themeClass} ${childrenClass} ${circleClass} ${additionalClass}`;

  return (
    <Fragment>
      <Tooltip
        classes={{
          popper: tooltipClasses ? tooltipClasses.popper : '',
          tooltip: tooltipClasses ? tooltipClasses.tooltip : '',
        }}
        title={!disabled ? title : ''}
        placement={tooltipPlacement}
      >
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
    </Fragment>
  );
};

export default withStyles(custom)(Button);
