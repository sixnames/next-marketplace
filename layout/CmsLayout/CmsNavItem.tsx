import CounterSticker from 'components/CounterSticker';
import { CMS_ORDERS_NAV_ITEM_SLUG, CONSOLE_ORDERS_NAV_ITEM_SLUG } from 'config/common';
import { NavItemInterface } from 'db/uiInterfaces';
import { useNewOrdersCounter } from 'hooks/useNewOrdersCounter';
import { useRouter } from 'next/router';
import * as React from 'react';
import Icon from 'components/Icon';
import Link from '../../components/Link/Link';
import useCompact from '../../hooks/useCompact';
import Tooltip from 'components/Tooltip';
import { IconType } from 'types/iconTypes';

interface CmsNavItemNameInterface {
  icon?: string | null;
  name?: string | null;
  compact?: boolean;
  counter?: number | null;
}

export const CmsNavItemName: React.FC<CmsNavItemNameInterface> = ({
  icon,
  name,
  counter,
  compact,
}) => {
  const iconType = icon as IconType;
  return (
    <span
      className={`flex items-center gap-[10px] min-h-[44px] ${
        compact ? 'py-[10px] justify-center' : 'px-[20px] py-[10px]'
      }`}
    >
      {icon ? (
        <span>
          <Icon className='w-[18px] h-[18px]' name={iconType} />
        </span>
      ) : null}
      {compact ? null : <span className=''>{name}</span>}

      {counter && counter > 0 ? (
        <CounterSticker
          value={counter}
          className={compact ? 'absolute top-0 right-0' : 'ml-auto'}
          isAbsolute={false}
        />
      ) : null}
    </span>
  );
};

interface AppNavItemInterface {
  item: NavItemInterface;
  isCompact?: boolean;
  pathname: string;
  openNavHandler: () => void;
  closeNavHandler: () => void;
  basePath: string;
  companyId?: string;
}

const itemClassName = 'relative';

const CmsNavItem: React.FC<AppNavItemInterface> = ({
  item,
  basePath,
  isCompact,
  openNavHandler,
  pathname,
  companyId,
}) => {
  const { asPath } = useRouter();
  const [isDropdownActive, setIsDropdownActive] = React.useState(false);
  const {
    isCompact: innerIsCompact,
    setCompactOn,
    toggleCompactHandler,
  } = useCompact(isDropdownActive);
  const { name, icon, path, children, slug } = item;
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
    if (isCompact) {
      openNavHandler();
      setCompactOn();
    } else {
      toggleCompactHandler();
    }
  }

  if (children && children.length) {
    return (
      <li className={itemClassName} data-cy={`app-nav-item-${slug}`}>
        <Tooltip title={isCompact ? name : null}>
          <div onClick={dropdownNavHandler}>
            <CmsNavItemName name={name} compact={isCompact} icon={icon} />
          </div>
        </Tooltip>

        {innerIsCompact || isCompact ? null : (
          <ul className='pb-10px pl-[38px]'>
            {children.map((dropdownItem) => {
              const { name, path } = dropdownItem;
              const isCurrent = checkIsCurrent(`${path}`);

              return (
                <li key={name} data-cy={`app-nav-item-${slug}`}>
                  <Link
                    href={`${basePath}${path}`}
                    className={`block ${
                      isCurrent ? 'bg-theme text-white' : 'text-white hover:text-theme'
                    }`}
                  >
                    <span className='pr-[10px] py-[10px]'>{name}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </li>
    );
  }

  const isCurrent = checkIsCurrent(`${path}`);
  return (
    <li className={itemClassName} data-cy={`app-nav-item-${slug}`}>
      <Tooltip title={isCompact ? name : null}>
        <div>
          <Link
            href={`${basePath}${path}`}
            className={`block hover:no-underline ${
              isCurrent ? 'bg-theme text-white' : 'text-white hover:text-theme'
            }`}
          >
            <CmsNavItemName name={name} compact={isCompact} icon={icon} counter={counter} />
          </Link>
        </div>
      </Tooltip>
    </li>
  );
};

export default CmsNavItem;
