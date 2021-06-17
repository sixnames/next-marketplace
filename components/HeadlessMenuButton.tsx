import { Menu, Transition } from '@headlessui/react';
import * as React from 'react';

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
                  {config.map((menuItem) => {
                    const { name, _id, onSelect, hidden } = menuItem;
                    const isSelected = _id === internalButtonText;

                    if (hidden) {
                      return null;
                    }

                    return (
                      <div className='px-1 py-2' key={_id}>
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
