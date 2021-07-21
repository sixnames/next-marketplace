import CounterSticker from 'components/CounterSticker';
import { CMS_ORDERS_NAV_ITEM_SLUG, CONSOLE_ORDERS_NAV_ITEM_SLUG } from 'config/common';
import { NavItemInterface } from 'db/uiInterfaces';
import { useNewOrdersCounter } from 'hooks/useNewOrdersCounter';
import { useRouter } from 'next/router';
import * as React from 'react';
import Icon from 'components/Icon';
import Link from '../../components/Link/Link';
import classes from 'layout/CmsLayout/CmsNavItem.module.css';
import useCompact from '../../hooks/useCompact';
import Tooltip from 'components/Tooltip';
import { IconType } from 'types/iconTypes';

interface AppNavItemInterface {
  item: NavItemInterface;
  compact?: boolean;
  pathname: string;
  openNavHandler: () => void;
  closeNavHandler: () => void;
  basePath: string;
  companyId?: string;
}

const CmsNavItem: React.FC<AppNavItemInterface> = ({
  item,
  basePath,
  compact,
  openNavHandler,
  pathname,
  companyId,
}) => {
  const { asPath } = useRouter();
  const [isDropdownActive, setIsDropdownActive] = React.useState(false);
  const { isCompact, setCompactOn, toggleCompactHandler } = useCompact(isDropdownActive);
  const { name, icon, path, children, slug } = item;
  const iconType = icon as IconType;
  const counter = useNewOrdersCounter({
    allowFetch:
      item.slug === CMS_ORDERS_NAV_ITEM_SLUG || item.slug === CONSOLE_ORDERS_NAV_ITEM_SLUG,
    input: {
      companyId,
    },
  });

  React.useEffect(() => {
    if (children) {
      const pathnameArr = pathname.split('/[');
      const realPathname = pathnameArr[0];
      const paths = children.map(({ path }) => path).map((path) => `${path}`.split('?')[0]);
      const current = paths.includes(realPathname);
      if (current) {
        setIsDropdownActive(true);
      }
    }

    return () => {
      setIsDropdownActive(false);
    };
  }, [children, pathname]);

  const checkIsCurrent = React.useCallback(
    (path: string) => {
      const reg = RegExp(`${path}`);
      return reg.test(asPath);
    },
    [asPath],
  );

  function dropdownNavHandler() {
    if (compact) {
      openNavHandler();
      setCompactOn();
    } else {
      toggleCompactHandler();
    }
  }

  if (children && children.length) {
    return (
      <li className={classes.item} data-cy={`app-nav-item-${slug}`}>
        <Tooltip title={compact ? name : null}>
          <div
            className={`${classes.complexItem} ${compact ? classes.complexItemCompact : ''} ${
              isDropdownActive ? classes.complexItemActive : ''
            }`}
            onClick={dropdownNavHandler}
          >
            {icon ? (
              <span className={`${classes.linkIcon}`}>
                <Icon name={iconType} />
              </span>
            ) : null}
            <span className={`${classes.linkText} ${compact ? classes.linkTextCompact : ''}`}>
              {name}
            </span>
          </div>
        </Tooltip>

        <ul
          className={`${classes.dropdown} ${isCompact ? classes.dropdownActive : ''} ${
            compact ? classes.dropdownCompact : ''
          }`}
        >
          {children.map((dropdownItem) => {
            const { name, path } = dropdownItem;
            const isCurrent = checkIsCurrent(`${path}`);

            return (
              <li className={classes.item} key={name} data-cy={`app-nav-item-${slug}`}>
                <Link
                  href={`${basePath}${path}`}
                  className={`${classes.complexLink} ${isCurrent ? classes.linkActive : ''}`}
                >
                  <span className={`${classes.linkText} ${compact ? classes.linkTextCompact : ''}`}>
                    {name}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </li>
    );
  }

  const isCurrent = checkIsCurrent(`${path}`);
  return (
    <li className={classes.item} data-cy={`app-nav-item-${slug}`}>
      <Tooltip title={compact ? name : ''}>
        <div>
          <Link
            href={`${basePath}${path}`}
            className={`${classes.link} ${compact ? classes.linkCompact : ''} ${
              isCurrent ? classes.linkActive : ''
            }`}
          >
            {icon ? (
              <span className={`${classes.linkIcon}`}>
                {icon && (
                  <span className={`${classes.linkIcon}`}>
                    <Icon name={iconType} />
                  </span>
                )}
              </span>
            ) : null}
            <span className={`${classes.linkText} ${compact ? classes.linkTextCompact : ''}`}>
              {name}
            </span>

            {counter && counter > 0 ? (
              <CounterSticker
                value={counter}
                className={compact ? 'absolute top-0 right-0' : 'ml-auto'}
                isAbsolute={false}
              />
            ) : null}
          </Link>
        </div>
      </Tooltip>
    </li>
  );
};

export default CmsNavItem;
