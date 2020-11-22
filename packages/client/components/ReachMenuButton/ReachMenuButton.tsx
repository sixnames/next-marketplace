import React, { Fragment, useState } from 'react';
import classes from './ReachMenuButton.module.css';
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
  buttonText?: (props: ButtonTextPropsInterface) => any;
  config: ReachMenuItemConfig[];
}

const ReachMenuButton: React.FC<MenuButtonInterface> = ({ className, buttonText, config }) => {
  const [internalButtonText, setInternalButtonText] = useState<string>(() => config[0].id);

  return (
    <div className={`${classes.frame} ${className ? className : ''}`}>
      <Menu>
        {({ isOpen }) => {
          return (
            <Fragment>
              <MenuButton>
                {buttonText ? buttonText({ internalButtonText, isOpen }) : internalButtonText}
              </MenuButton>

              <MenuList portal={false}>
                {config.map((menuItem) => {
                  const { nameString, id, onSelect } = menuItem;
                  const isSelected = id === internalButtonText;

                  return (
                    <MenuItem
                      key={id}
                      className={`${isSelected ? classes.selectedItem : ''}`}
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
