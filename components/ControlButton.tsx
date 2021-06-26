import * as React from 'react';
import Icon from 'components/Icon';
import Tooltip from 'components/Tooltip';
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
  size?: 'smaller' | 'small' | 'normal' | 'big';
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
  const themeClass =
    theme === 'blank' ? `text-secondary-text` : `text-primary-text bg-secondary-light`;

  const sizeClass =
    size === 'smaller'
      ? 'w-[var(--controlButtonHeightSmaller)] h-[var(--controlButtonHeightSmaller)]'
      : size === 'small'
      ? 'w-[var(--controlButtonHeightSmall)] h-[var(--controlButtonHeightSmall)]'
      : size === 'big'
      ? 'w-[var(--controlButtonHeightBig)] h-[var(--controlButtonHeightBig)]'
      : 'w-[var(--controlButtonHeight)] h-[var(--controlButtonHeight)]';

  const iconSizeClass =
    iconSize === 'smaller'
      ? 'w-3 h-3'
      : iconSize === 'small'
      ? 'w-4 h-4'
      : iconSize === 'mid'
      ? 'w-6 h-6'
      : iconSize === 'big'
      ? 'w-7 h-7'
      : 'w-5 h-5';

  const roundedClass = `${roundedTopLeft ? 'rounded-tl-md rounded-br-md' : ''} ${
    roundedTopRight ? 'rounded-tr-md rounded-bl-md' : ''
  }`;

  const buttonClass = `relative z-30 flex items-center justify-center transition duration-150 hover:text-theme ${
    className ? className : ''
  } ${themeClass} ${roundedClass} ${sizeClass}`;

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
            className={`${iconSizeClass} ${iconClass ? iconClass : ''}`}
          />
        </button>
      </Tooltip>
    </React.Fragment>
  );
};

export default ControlButton;
