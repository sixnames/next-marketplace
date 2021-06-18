import { HeadlessMenuItemInterface } from 'components/HeadlessMenuButton';
import * as React from 'react';
import Link from '../Link/Link';
import CounterSticker from '../CounterSticker/CounterSticker';

interface AsideNavGroupInterface {
  name?: string;
  children: HeadlessMenuItemInterface[];
  testId?: string;
}

export type AsideNavConfigType = AsideNavGroupInterface[];

interface AsideNavInterface {
  config: AsideNavConfigType;
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
                {children.map(({ counter, name, ...linkProps }, linkIndex) => {
                  return (
                    <li key={linkIndex}>
                      <Link
                        activeClassName='no-underline text-theme pointer-events-none'
                        className='flex items-center min-h-[2.75rem] lg:text-lg font-medium text-primary-text hover:no-underline hover:text-theme'
                        {...linkProps}
                      >
                        {name}
                        {counter ? <CounterSticker className='' {...counter} /> : null}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          );
        })}
      </div>

      {/*Mobile*/}
      <div className='md:hidden'></div>
    </aside>
  );
};

export default AsideNav;
