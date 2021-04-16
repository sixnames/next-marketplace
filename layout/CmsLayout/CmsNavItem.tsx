import { NavItemModel } from 'db/dbModels';
import { useRouter } from 'next/router';
import * as React from 'react';
import Icon from '../../components/Icon/Icon';
import Link from '../../components/Link/Link';
import classes from 'layout/CmsLayout/CmsNavItem.module.css';
import useCompact from '../../hooks/useCompact';
import Tooltip from '../../components/TTip/Tooltip';
import { IconType } from 'types/iconTypes';

interface AppNavItemInterface {
  item: NavItemModel;
  compact?: boolean;
  pathname: string;
  openNavHandler: () => void;
  closeNavHandler: () => void;
}

const CmsNavItem: React.FC<AppNavItemInterface> = ({ item, compact, openNavHandler, pathname }) => {
  const { asPath } = useRouter();
  const [isDropdownActive, setIsDropdownActive] = React.useState(false);
  const { isCompact, setCompactOn, toggleCompactHandler } = useCompact(isDropdownActive);
  const { name, icon, path, children, _id } = item;
  const iconType = icon as IconType;

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
      <li className={classes.item} data-cy={`app-nav-item-${_id}`}>
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
            const { name, path, _id } = dropdownItem;
            const isCurrent = checkIsCurrent(`${path}`);

            return (
              <li className={classes.item} key={name} data-cy={`app-nav-item-${_id}`}>
                <Link
                  href={`${path}`}
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
    <li className={classes.item} data-cy={`app-nav-item-${name}`}>
      <Tooltip title={compact ? name : ''}>
        <div>
          <Link
            href={`${path}`}
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
          </Link>
        </div>
      </Tooltip>
    </li>
  );
};

export default CmsNavItem;
