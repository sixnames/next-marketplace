import { Menu } from '@headlessui/react';
import * as React from 'react';
import { IconType } from '../types/iconTypes';
import { CounterStickerInterface } from './CounterSticker';
import WpIcon from './WpIcon';

type CurrentAction = (menuItem: HeadlessMenuItemInterface) => boolean;

export interface HeadlessMenuItemInterface {
  _id: string | null;
  name: any;
  onSelect: (menuItem: HeadlessMenuItemInterface) => void;
  current?: boolean | CurrentAction;
  hidden?: boolean;
  counter?: Omit<CounterStickerInterface, 'className'>;
  testId?: string;
  icon?: IconType;
}

export interface HeadlessMenuGroupInterface {
  name?: string;
  children: HeadlessMenuItemInterface[];
  testId?: string;
}

interface ButtonTextPropsInterface {
  internalButtonText: any;
  isOpen: boolean;
}

export interface MenuButtonInterface {
  className?: string;
  buttonClassName?: string;
  buttonText?: (props: ButtonTextPropsInterface) => any;
  config: HeadlessMenuGroupInterface[];
  initialValue?: string;
  buttonAs?: any;
  itemAs?: any;
  testId?: string;
  menuPosition?: 'right' | 'left';
}

const HeadlessMenuButton: React.FC<MenuButtonInterface> = ({
  className,
  buttonClassName,
  buttonText,
  config,
  initialValue,
  buttonAs,
  testId,
  menuPosition = 'right',
  itemAs,
}) => {
  const [internalButtonText, setInternalButtonText] = React.useState<string | null>(() => {
    return `${config[0]?.children[0]?._id}`;
  });

  React.useEffect(() => {
    const allMenuItems = config.reduce((acc: HeadlessMenuItemInterface[], { children }) => {
      return [...acc, ...children];
    }, []);
    const currentConfigItem = allMenuItems.find((menuItem) => {
      const { current } = menuItem;
      if (typeof current === 'function') {
        return current(menuItem);
      }
      return current;
    });
    if (currentConfigItem) {
      setInternalButtonText(currentConfigItem._id);
      return;
    }

    const initialValueItem = allMenuItems.find(({ _id }) => {
      return _id === initialValue;
    });
    const updatedInitialValue = initialValueItem?._id || `${allMenuItems[0]?._id}`;
    setInternalButtonText(updatedInitialValue);
  }, [config, initialValue]);

  return (
    <div className={`headless-menu relative z-30 ${className ? className : ''}`}>
      <Menu as='div' className='relative'>
        {({ open }) => {
          return (
            <React.Fragment>
              <Menu.Button
                as={buttonAs}
                data-cy={testId}
                className={`cursor-pointer rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-theme focus-visible:ring-opacity-75 ${
                  buttonClassName ? buttonClassName : ''
                }`}
              >
                {buttonText ? buttonText({ internalButtonText, isOpen: open }) : internalButtonText}
              </Menu.Button>
              <Menu.Items
                className={`absolute ${
                  menuPosition === 'right' ? 'right-0' : 'left-0'
                } mt-2 max-h-[300px] min-w-[200px] origin-top-right cursor-pointer overflow-y-auto overflow-x-hidden rounded-md bg-secondary shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none`}
              >
                {config.map((group, groupIndex) => {
                  return (
                    <div
                      className={`divide-y divide-border-300 ${config.length > 1 ? 'mb-12' : ''}`}
                      key={groupIndex}
                      data-cy={group.testId}
                    >
                      {group.name ? (
                        <div className='px-4 py-2 text-secondary-text'>{group.name}</div>
                      ) : null}

                      {group.children.map((menuItem) => {
                        const { name, _id, onSelect, hidden, testId, icon } = menuItem;
                        const isSelected = _id === internalButtonText;

                        if (hidden) {
                          return null;
                        }

                        return (
                          <div key={_id} className='whitespace-nowrap'>
                            <Menu.Item as={itemAs}>
                              {() => {
                                return (
                                  <span
                                    data-cy={testId || name}
                                    onClick={() => {
                                      onSelect(menuItem);
                                    }}
                                    className={`${
                                      isSelected
                                        ? 'text-theme'
                                        : 'text-primary-text hover:text-theme'
                                    } group flex w-full cursor-pointer items-center gap-4 rounded-md px-4 py-2`}
                                  >
                                    {icon ? <WpIcon name={icon} className='h-4 w-4' /> : null}
                                    {name}
                                  </span>
                                );
                              }}
                            </Menu.Item>
                          </div>
                        );
                      })}
                    </div>
                  );
                })}
              </Menu.Items>
            </React.Fragment>
          );
        }}
      </Menu>
    </div>
  );
};

export default HeadlessMenuButton;
