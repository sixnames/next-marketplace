import * as React from 'react';
import HeadlessMenuButton, {
  HeadlessMenuItemInterface,
  MenuButtonInterface,
} from 'components/HeadlessMenuButton';
import Icon from 'components/Icon';
import { IconType } from 'types/iconTypes';

export interface MenuButtonWithNameInterface extends Omit<MenuButtonInterface, 'buttonText'> {
  iconPosition?: 'left' | 'right';
  frameClassName?: string;
  isOpenIcon?: IconType;
  isClosedIcon?: IconType;
  style?: React.CSSProperties;
  showNameAsButtonText?: boolean;
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
  style,
  showNameAsButtonText,
  ...props
}) => {
  return (
    <div className={`text-primary ${frameClassName ? frameClassName : ''}`}>
      <HeadlessMenuButton
        config={config}
        className={className}
        initialValue={initialValue}
        buttonText={({ internalButtonText, isOpen }) => {
          let buttonText = internalButtonText;
          if (showNameAsButtonText) {
            const allNavItems = config.reduce((acc: HeadlessMenuItemInterface[], group) => {
              return [...acc, ...group.children];
            }, []);
            const currentNavItem = allNavItems.find(({ _id }) => {
              return _id === internalButtonText;
            });

            buttonText = `${currentNavItem?.name}`;
          }

          return (
            <span
              className={`flex items-center ${buttonClassName ? buttonClassName : ''}`}
              style={style}
            >
              {iconPosition === 'left' ? (
                <Icon
                  className={`${iconClassName} mr-2`}
                  name={isOpen ? isOpenIcon : isClosedIcon}
                />
              ) : null}

              <div>{buttonText}</div>

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
