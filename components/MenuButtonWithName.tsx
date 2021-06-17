import * as React from 'react';
import HeadlessMenuButton, { MenuButtonInterface } from 'components/HeadlessMenuButton';
import Icon from 'components/Icon/Icon';

export interface MenuButtonWithNameInterface extends Omit<MenuButtonInterface, 'buttonText'> {
  iconPosition?: 'left' | 'right';
  frameClassName?: string;
}

const iconClassName = 'w-3 h-3';

const MenuButtonWithName: React.FC<MenuButtonWithNameInterface> = ({
  className,
  iconPosition = 'left',
  config,
  frameClassName,
  initialValue,
}) => {
  return (
    <div className={`text-primary ${frameClassName ? frameClassName : ''}`}>
      <HeadlessMenuButton
        config={config}
        className={className}
        initialValue={initialValue}
        buttonText={({ internalButtonText, isOpen }) => (
          <span className='uppercase text-primary-text flex items-center'>
            {iconPosition === 'left' ? (
              <Icon
                className={`${iconClassName} mr-2`}
                name={isOpen ? 'chevron-up' : 'chevron-down'}
              />
            ) : null}
            {internalButtonText}
            {iconPosition === 'right' ? (
              <Icon
                className={`${iconClassName} ml-2`}
                name={isOpen ? 'chevron-up' : 'chevron-down'}
              />
            ) : null}
          </span>
        )}
      />
    </div>
  );
};

export default MenuButtonWithName;
