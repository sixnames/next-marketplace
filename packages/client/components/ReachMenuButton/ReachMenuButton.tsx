import React, { Fragment, useEffect, useState } from 'react';
import '@reach/menu-button/styles.css';
import { Menu, MenuButton, MenuItem, MenuList } from '@reach/menu-button';

type CurrentAction = () => boolean;

export interface ReachMenuItemConfig {
  id: string;
  nameString: any;
  slug?: string;
  onSelect: (menuItem: ReachMenuItemConfig) => void;
  current?: boolean | CurrentAction;
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
  buttonAs?: keyof JSX.IntrinsicElements | React.ComponentType;
}

const ReachMenuButton: React.FC<MenuButtonInterface> = ({
  className,
  buttonClassName,
  buttonText,
  config,
  initialValue,
  buttonAs,
}) => {
  const [internalButtonText, setInternalButtonText] = useState<string>(() => {
    return config[0].id;
  });

  useEffect(() => {
    const currentConfigItem = config.find(({ current }) => {
      if (typeof current === 'function') {
        return current();
      }
      return current;
    });
    if (currentConfigItem) {
      setInternalButtonText(currentConfigItem.id);
      return;
    }

    const initialValueItem = config.find(({ id }) => {
      return id === initialValue;
    });
    const updatedInitialValue = initialValueItem?.id || config[0].id;
    setInternalButtonText(updatedInitialValue);
  }, [config, initialValue]);

  return (
    <div className={`${className ? className : ''}`}>
      <Menu>
        {({ isOpen }) => {
          return (
            <Fragment>
              <MenuButton as={buttonAs} className={`${buttonClassName ? buttonClassName : ''}`}>
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
