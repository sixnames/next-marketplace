import Spinner from 'components/Spinner';
import * as React from 'react';
import Icon from 'components/Icon';
import WpTooltip from 'components/WpTooltip';
import { ButtonTheme, ButtonType, SizeType } from 'types/clientTypes';
import { IconType } from 'types/iconTypes';

export interface ButtonPropsInterface {
  theme?: ButtonTheme;
  size?: SizeType;
  className?: string;
  children?: any;
  type?: ButtonType;
  disabled?: boolean;
  circle?: boolean;
  title?: any;
  icon?: IconType;
  onClick?: (e: any) => void;
  testId?: string;
  short?: boolean;
  ariaLabel?: string;
  isLoading?: boolean;
}

const Button: React.FC<ButtonPropsInterface> = ({
  theme = 'primary',
  size = 'normal',
  title = '',
  type = 'button',
  children,
  disabled = false,
  icon,
  circle = false,
  className,
  testId,
  short,
  ariaLabel,
  isLoading,
  ...props
}) => {
  const themeClass =
    theme === 'primary'
      ? 'text-wp-white bg-theme'
      : theme === 'secondary'
      ? 'text-theme bg-secondary-button-background hover:ring-2 hover:ring-theme'
      : theme === 'secondary-b'
      ? 'text-theme bg-secondary-b-button-background hover:ring-2 hover:ring-theme'
      : 'text-wp-mid-gray-100 bg-wp-light-gray-200 dark:text-wp-light-gray-200 dark:bg-wp-dark-gray-100 hover:border-2 hover:border-theme';

  const noChildren = !children;
  const isSmall = size === 'small';
  const sizeClass = isSmall ? 'h-[var(--smallButtonHeight)]' : 'h-[var(--formInputHeight)]';
  const widthClass = short ? '' : 'min-w-[var(--buttonMinWidth)]';
  const childrenClass = noChildren
    ? `rounded-md ${widthClass}`
    : `pl-4 pr-4 rounded-md ${widthClass}`;
  const circleClass = circle
    ? `rounded-full ${isSmall ? 'w-[var(--smallButtonHeight)]' : 'w-[var(--formInputHeight)]'}`
    : childrenClass;
  const additionalClass = className ? className : '';
  const buttonClass = `z-[5] flex items-center justify-center border-1 border-theme font-medium uppercase text-center text-sm transition-all duration-100 cursor-pointer disabled:opacity-50 disabled:pointer-events-none shadow-md hover:shadow-xl ${sizeClass} ${themeClass} ${circleClass} ${additionalClass}`;

  return (
    <div className='relative w-full'>
      <WpTooltip title={!disabled ? title : null}>
        <button
          aria-label={ariaLabel}
          data-cy={testId}
          disabled={disabled}
          className={buttonClass}
          type={type}
          {...props}
        >
          {icon && (
            <Icon
              name={icon}
              className={`relative flex-shrink-0 ${
                isSmall ? 'w-[0.875rem] h-[0.875rem]' : 'w-[1.25rem] h-[1.25rem] top-[1px]'
              } ${noChildren ? '' : 'mr-[5px]'}`}
            />
          )}

          {children}
        </button>
      </WpTooltip>
      {isLoading ? <Spinner isNestedAbsolute isTransparent /> : null}
    </div>
  );
};

export default Button;
