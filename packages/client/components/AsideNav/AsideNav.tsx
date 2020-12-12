import React from 'react';
import classes from './AsideNav.module.css';
import Link, { LinkInterface } from '../Link/Link';
import CounterSticker, { CounterStickerInterface } from '../CounterSticker/CounterSticker';

interface AsideNavItemInterface extends LinkInterface {
  counter?: Omit<CounterStickerInterface, 'className'>;
  name: string;
}

interface AsideNavGroupInterface {
  name?: string;
  children: AsideNavItemInterface[];
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
    <aside className={`${classes.frame} ${className ? className : ''}`} data-cy={testId}>
      {config.map(({ name, children, testId }, groupIndex) => {
        return (
          <div className={classes.group} key={groupIndex} data-cy={testId}>
            {name ? <div className={classes.groupTitle}>{name}</div> : null}
            <ul>
              {children.map(({ counter, name, ...linkProps }, linkIndex) => {
                return (
                  <li key={linkIndex}>
                    <Link
                      activeClassName={classes.linkActive}
                      className={classes.link}
                      {...linkProps}
                    >
                      {name}
                      {counter ? <CounterSticker className={classes.counter} {...counter} /> : null}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        );
      })}
    </aside>
  );
};

export default AsideNav;
