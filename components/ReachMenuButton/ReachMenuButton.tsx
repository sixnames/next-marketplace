import * as React from 'react';
import '@reach/menu-button/styles.css';
import { Menu, MenuButton, MenuItem, MenuList } from '@reach/menu-button';

type CurrentAction = () => boolean;

export interface ReachMenuItemConfig {
  _id: string;
  name: any;
  slug?: string;
  onSelect: (menuItem: ReachMenuItemConfig) => void;
  current?: boolean | CurrentAction;
  hidden?: boolean;
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
  // buttonAs?: keyof JSX.IntrinsicElements | React.ComponentType;
  buttonAs?: any;
  testId?: string;
}

const ReachMenuButton: React.FC<MenuButtonInterface> = ({
  className,
  buttonClassName,
  buttonText,
  config,
  initialValue,
  buttonAs,
  testId,
}) => {
  const [internalButtonText, setInternalButtonText] = React.useState<string>(() => {
    return `${config[0]?._id}`;
  });

  React.useEffect(() => {
    const currentConfigItem = config.find(({ current }) => {
      if (typeof current === 'function') {
        return current();
      }
      return current;
    });
    if (currentConfigItem) {
      setInternalButtonText(currentConfigItem._id);
      return;
    }

    const initialValueItem = config.find(({ _id }) => {
      return _id === initialValue;
    });
    const updatedInitialValue = initialValueItem?._id || `${config[0]?._id}`;
    setInternalButtonText(updatedInitialValue);
  }, [config, initialValue]);

  return (
    <div className={`${className ? className : ''}`}>
      <Menu>
        {({ isOpen }) => {
          return (
            <React.Fragment>
              <MenuButton
                as={buttonAs}
                className={`${buttonClassName ? buttonClassName : ''}`}
                data-cy={testId}
              >
                {buttonText ? buttonText({ internalButtonText, isOpen }) : internalButtonText}
              </MenuButton>

              <MenuList>
                {config.map((menuItem) => {
                  const { name, _id, onSelect, hidden } = menuItem;
                  const isSelected = _id === internalButtonText;

                  if (hidden) {
                    return null;
                  }

                  return (
                    <MenuItem
                      key={_id}
                      className={`${isSelected ? 'rui-selected-item' : ''}`}
                      onSelect={() => {
                        onSelect(menuItem);
                      }}
                    >
                      <div>{name}</div>
                    </MenuItem>
                  );
                })}
              </MenuList>
            </React.Fragment>
          );
        }}
      </Menu>
    </div>
  );
};

export default ReachMenuButton;
