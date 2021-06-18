import { Menu, Transition } from '@headlessui/react';
import { CounterStickerInterface } from 'components/CounterSticker/CounterSticker';
import * as React from 'react';

type CurrentAction = (menuItem: HeadlessMenuItemInterface) => boolean;

export interface HeadlessMenuItemInterface {
  _id: string;
  name: any;
  onSelect: (menuItem: HeadlessMenuItemInterface) => void;
  current?: boolean | CurrentAction;
  hidden?: boolean;
  counter?: Omit<CounterStickerInterface, 'className'>;
  testId?: string;
}

interface HeadlessMenuGroupInterface {
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
  testId?: string;
}

const HeadlessMenuButton: React.FC<MenuButtonInterface> = ({
  className,
  buttonClassName,
  buttonText,
  config,
  initialValue,
  buttonAs,
  testId,
}) => {
  const [internalButtonText, setInternalButtonText] = React.useState<string>(() => {
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
    <div className={`relative z-30 ${className ? className : ''}`}>
      <Menu as='div' className='relative'>
        {({ open }) => {
          return (
            <React.Fragment>
              <Menu.Button
                as={buttonAs}
                data-cy={testId}
                className={`focus:outline-none focus-visible:ring-2 focus-visible:ring-theme rounded-lg focus-visible:ring-opacity-75 ${
                  buttonClassName ? buttonClassName : ''
                }`}
              >
                {buttonText ? buttonText({ internalButtonText, isOpen: open }) : internalButtonText}
              </Menu.Button>
              <Transition
                as={React.Fragment}
                enter='transition ease-out duration-100'
                enterFrom='transform opacity-0 scale-95'
                enterTo='transform opacity-100 scale-100'
                leave='transition ease-in duration-75'
                leaveFrom='transform opacity-100 scale-100'
                leaveTo='transform opacity-0 scale-95'
              >
                <Menu.Items className='absolute right-0 w-56 mt-2 origin-top-right bg-secondary divide-y divide-border-color rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none'>
                  {config.map((group, groupIndex) => {
                    return (
                      <div
                        className={config.length > 1 ? 'mb-12' : ''}
                        key={groupIndex}
                        data-cy={group.testId}
                      >
                        {group.name ? (
                          <div className='text-secondary-text mb-2'>{group.name}</div>
                        ) : null}

                        {group.children.map((menuItem) => {
                          const { name, _id, onSelect, hidden, testId } = menuItem;
                          const isSelected = _id === internalButtonText;

                          if (hidden) {
                            return null;
                          }

                          return (
                            <div className='px-1 py-2' key={_id} data-cy={testId}>
                              <Menu.Item>
                                {() => (
                                  <button
                                    onClick={() => {
                                      onSelect(menuItem);
                                    }}
                                    className={`${
                                      isSelected ? 'text-theme' : 'text-primary-text'
                                    } group flex rounded-md items-center w-full px-4 py-2`}
                                  >
                                    {name}
                                  </button>
                                )}
                              </Menu.Item>
                            </div>
                          );
                        })}
                      </div>
                    );
                  })}
                </Menu.Items>
              </Transition>
            </React.Fragment>
          );
        }}
      </Menu>
    </div>
  );
};

export default HeadlessMenuButton;
