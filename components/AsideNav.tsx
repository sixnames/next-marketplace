import * as React from 'react';
import CounterSticker from './CounterSticker';
import { HeadlessMenuGroupInterface } from './HeadlessMenuButton';
import MenuButtonWithName from './MenuButtonWithName';

interface AsideNavInterface {
  config: HeadlessMenuGroupInterface[];
  className?: string;
  testId?: string;
}

const AsideNav: React.FC<AsideNavInterface> = ({ testId, className, config }) => {
  return (
    <aside className={`mb-4 ${className ? className : ''}`} data-cy={testId}>
      {/*Desktop*/}
      <div className='hidden md:block'>
        {config.map(({ name, children, testId }, groupIndex) => {
          return (
            <div className='mb-12' key={groupIndex} data-cy={testId}>
              {name ? <div className='text-secondary-text mb-2'>{name}</div> : null}
              <ul>
                {children.map((menuItem) => {
                  const { name, _id, onSelect, hidden, testId, current, counter } = menuItem;
                  const isSelected = typeof current === 'function' ? current(menuItem) : current;

                  if (hidden) {
                    return null;
                  }

                  return (
                    <li key={_id}>
                      <button
                        data-cy={testId}
                        onClick={() => {
                          onSelect(menuItem);
                        }}
                        className={`${
                          isSelected ? 'text-theme' : 'text-primary-text'
                        } group flex rounded-md items-center w-full py-2`}
                      >
                        {name}

                        {counter ? <CounterSticker className='' {...counter} /> : null}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          );
        })}
      </div>

      {/*Mobile*/}
      <div className='md:hidden flex'>
        <MenuButtonWithName
          config={config}
          buttonClassName='text-primary-text'
          isOpenIcon={'burger'}
          isClosedIcon={'burger'}
          menuPosition={'left'}
        />
      </div>
    </aside>
  );
};

export default AsideNav;
