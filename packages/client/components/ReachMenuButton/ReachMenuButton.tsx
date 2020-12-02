import React, { Fragment, useState } from 'react';
import '@reach/menu-button/styles.css';
import { Menu, MenuButton, MenuItem, MenuList } from '@reach/menu-button';

export interface ReachMenuItemConfig {
  id: string;
  nameString: any;
  onSelect: (menuItem: ReachMenuItemConfig) => void;
}

interface ButtonTextPropsInterface {
  internalButtonText: any;
  isOpen: boolean;
}

export interface MenuButtonInterface {
  className?: string;
  buttonClassName?: string;
  buttonText?: (props: ButtonTextPropsInterface) => any;
  config: ReachMenuItemConfig[];
  initialValue?: string;
}

const ReachMenuButton: React.FC<MenuButtonInterface> = ({
  className,
  buttonClassName,
  buttonText,
  config,
  initialValue,
}) => {
  const [internalButtonText, setInternalButtonText] = useState<string>(() => {
    const initialValueItem = config.find(({ id }) => {
      return id === initialValue;
    });
    return initialValueItem?.id || config[0].id;
  });

  return (
    <div className={`${className ? className : ''}`}>
      <Menu>
        {({ isOpen }) => {
          return (
            <Fragment>
              <MenuButton className={`${buttonClassName ? buttonClassName : ''}`}>
                {buttonText ? buttonText({ internalButtonText, isOpen }) : internalButtonText}
              </MenuButton>

              <MenuList>
                {config.map((menuItem) => {
                  const { nameString, id, onSelect } = menuItem;
                  const isSelected = id === internalButtonText;

                  return (
                    <MenuItem
                      key={id}
                      className={`${isSelected ? 'rui-selected-item' : ''}`}
                      onSelect={() => {
                        onSelect(menuItem);
                        setInternalButtonText(id);
                      }}
                    >
                      <div>{nameString}</div>
                    </MenuItem>
                  );
                })}
              </MenuList>
            </Fragment>
          );
        }}
      </Menu>
    </div>
  );
};

export default ReachMenuButton;
