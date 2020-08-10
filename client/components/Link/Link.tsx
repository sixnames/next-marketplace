import React, { PropsWithChildren } from 'react';
import NextLink, { LinkProps } from 'next/link';
import { useRouter } from 'next/router';
import { isEqual } from 'lodash';

interface LinkInterface extends LinkProps, PropsWithChildren<any> {
  className?: string;
  activeClassName?: string;
  testId?: string;
  exact?: boolean;
  isTab?: boolean;
}

const Link: React.FC<LinkInterface> = ({
  className = '',
  activeClassName = '',
  href,
  children,
  testId,
  exact = false,
  isTab = false,
  replace,
  as,
  ...props
}) => {
  const { pathname, query } = useRouter() || { pathname: '', query: '' };
  const currentPath = { pathname, query };

  let isCurrent =
    typeof href === 'string' ? pathname === href.split('?')[0] : href.pathname === pathname;

  if (exact) {
    isCurrent =
      typeof href === 'string' ? pathname === href.split('?')[0] : isEqual(currentPath, href);
  }

  if (isTab) {
    if (typeof href === 'string') {
      isCurrent = pathname === href;
    } else if (href.query && typeof href.query !== 'string') {
      isCurrent = href.query.tab === query.tab;

      if (!query.tab && href.query.tab === '0') {
        isCurrent = true;
      }
    }
  }

  return (
    <NextLink href={href} as={as} replace={replace}>
      <a
        className={`${className ? className : ''} ${isCurrent ? activeClassName : ''}`}
        data-cy={testId}
        {...props}
      >
        {children}
      </a>
    </NextLink>
  );
};

export default Link;
