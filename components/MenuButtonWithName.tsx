import * as React from 'react';
import HeadlessMenuButton, { MenuButtonInterface } from 'components/HeadlessMenuButton';
import Icon from 'components/Icon/Icon';
import { IconType } from 'types/iconTypes';

export interface MenuButtonWithNameInterface extends Omit<MenuButtonInterface, 'buttonText'> {
  iconPosition?: 'left' | 'right';
  frameClassName?: string;
  isOpenIcon?: IconType;
  isClosedIcon?: IconType;
}

const iconClassName = 'w-3 h-3';

const MenuButtonWithName: React.FC<MenuButtonWithNameInterface> = ({
  className,
  iconPosition = 'left',
  config,
  frameClassName,
  initialValue,
  isOpenIcon = 'chevron-up',
  isClosedIcon = 'chevron-down',
  buttonClassName,
  ...props
}) => {
  return (
    <div className={`text-primary ${frameClassName ? frameClassName : ''}`}>
      <HeadlessMenuButton
        config={config}
        className={className}
        initialValue={initialValue}
        buttonText={({ internalButtonText, isOpen }) => {
          return (
            <span
              className={`uppercase flex items-center ${buttonClassName ? buttonClassName : ''}`}
            >
              {iconPosition === 'left' ? (
                <Icon
                  className={`${iconClassName} mr-2`}
                  name={isOpen ? isOpenIcon : isClosedIcon}
                />
              ) : null}
              {internalButtonText}
              {iconPosition === 'right' ? (
                <Icon
                  className={`${iconClassName} ml-2`}
                  name={isOpen ? isOpenIcon : isClosedIcon}
                />
              ) : null}
            </span>
          );
        }}
        {...props}
      />
    </div>
  );
};

export default MenuButtonWithName;
