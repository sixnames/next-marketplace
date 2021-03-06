import CounterSticker from 'components/CounterSticker';
import WpLink from 'components/Link/WpLink';
import WpIcon from 'components/WpIcon';
import WpTooltip from 'components/WpTooltip';
import { NavItemInterface } from 'db/uiInterfaces';
import useCompact from 'hooks/useCompact';
import { useNewOrdersCounter } from 'hooks/useNewOrdersCounter';
import { CMS_ORDERS_NAV_ITEM_SLUG, CONSOLE_ORDERS_NAV_ITEM_SLUG } from 'lib/config/common';
import { useRouter } from 'next/router';
import * as React from 'react';
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
      className={`flex min-h-[44px] items-center gap-[10px] ${
        compact ? 'justify-center py-[10px]' : 'px-[20px] py-[10px]'
      }`}
    >
      {icon ? (
        <span>
          <WpIcon className='h-[18px] w-[18px]' name={iconType} />
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
      const reg = RegExp(`${basePath}${path}`);
      return reg.test(asPath);
    },
    [asPath, basePath],
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
        <WpTooltip title={isCompact ? `${name}` : ''}>
          <div onClick={dropdownNavHandler}>
            <CmsNavItemName name={name} compact={isCompact} icon={icon} />
          </div>
        </WpTooltip>

        {innerIsCompact || isCompact ? null : (
          <ul className='pb-10px pl-[38px]'>
            {children.map((dropdownItem) => {
              const { name, path } = dropdownItem;
              const isCurrent = checkIsCurrent(`${path}`);

              return (
                <li key={name} data-cy={`app-nav-item-${slug}`}>
                  <WpLink
                    href={`${basePath}${path}`}
                    className={`block ${
                      isCurrent ? 'bg-theme text-white' : 'text-white hover:text-theme'
                    }`}
                  >
                    <span className='py-[10px] pr-[10px]'>{name}</span>
                  </WpLink>
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
      <WpTooltip title={isCompact ? `${name}` : ''}>
        <div>
          <WpLink
            href={`${basePath}${path}`}
            className={`block hover:no-underline ${
              isCurrent ? 'bg-theme text-white' : 'text-white hover:text-theme'
            }`}
          >
            <CmsNavItemName name={name} compact={isCompact} icon={icon} counter={counter} />
          </WpLink>
        </div>
      </WpTooltip>
    </li>
  );
};

export default CmsNavItem;
