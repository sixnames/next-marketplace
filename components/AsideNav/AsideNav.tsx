import * as React from 'react';
import classes from './AsideNav.module.css';
import Link, { LinkInterface } from '../Link/Link';
import CounterSticker, { CounterStickerInterface } from '../CounterSticker/CounterSticker';
import { Menu, MenuButton, MenuItem, MenuList } from '@reach/menu-button';
import { useRouter } from 'next/router';
import { useNotificationsContext } from 'context/notificationsContext';
import Icon from '../Icon/Icon';

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
  const { showErrorNotification } = useNotificationsContext();
  const [buttonText, setButtonText] = React.useState('');
  const router = useRouter();

  React.useEffect(() => {
    config.forEach(({ children }) => {
      children.forEach(({ href, name }) => {
        const itemPathname = typeof href === 'object' ? href.pathname : href;
        const isSelected = router.pathname === itemPathname;
        if (isSelected) {
          setButtonText(name);
        }
      });
    });
  }, [config, router.pathname]);

  return (
    <aside className={`${classes.frame} ${className ? className : ''}`} data-cy={testId}>
      {/*Desktop*/}
      <div className={`${classes.desktopFrame}`}>
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
                        {counter ? (
                          <CounterSticker className={classes.counter} {...counter} />
                        ) : null}
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
      <div className={`${classes.mobileFrame}`}>
        <Menu>
          {() => {
            return (
              <React.Fragment>
                <MenuButton className={`${classes.mobileTrigger}`}>
                  <Icon name={'burger'} className={`${classes.mobileTriggerIcon}`} />
                  {buttonText}
                </MenuButton>

                <MenuList>
                  {config.map(({ name, children, testId }, groupIndex) => {
                    return (
                      <div
                        className={`${classes.group} ${classes.groupMobile}`}
                        key={groupIndex}
                        data-cy={testId}
                      >
                        {name ? (
                          <div className={`${classes.groupTitle} ${classes.groupTitleMobile}`}>
                            {name}
                          </div>
                        ) : null}
                        <ul>
                          {children.map(({ counter, name, href }, linkIndex) => {
                            const itemPathname = typeof href === 'object' ? href.pathname : href;
                            const isSelected = router.pathname === itemPathname;

                            return (
                              <li key={linkIndex}>
                                <MenuItem
                                  key={name}
                                  className={`${isSelected ? 'rui-selected-item' : ''}`}
                                  onSelect={() => {
                                    router.push(href).catch(() => {
                                      showErrorNotification();
                                    });
                                    console.log(name);
                                    // onSelect(menuItem);
                                    // setInternalButtonText(id);
                                  }}
                                >
                                  {name}
                                  {counter ? (
                                    <CounterSticker className={classes.counter} {...counter} />
                                  ) : null}
                                </MenuItem>
                              </li>
                            );
                          })}
                        </ul>
                      </div>
                    );
                  })}
                </MenuList>
              </React.Fragment>
            );
          }}
        </Menu>
      </div>
    </aside>
  );
};

export default AsideNav;
