import * as React from 'react';
import NextLink, { LinkProps } from 'next/link';
import { useRouter } from 'next/router';
import { isEqual } from 'lodash';

export interface LinkInterface extends LinkProps, React.PropsWithChildren<any> {
  className?: string;
  activeClassName?: string;
  testId?: string;
  exact?: boolean;
  isTab?: boolean;
  onClick?: () => void;
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
  onClick,
  as,
  ...props
}) => {
  const { pathname, query } = useRouter() || { pathname: '', query: '' };
  const pathnameArr = pathname.split('/[');
  const realPathname = pathnameArr[0];
  const currentPath = { pathname: realPathname, query };

  let isCurrent =
    typeof href === 'string' ? realPathname === href.split('?')[0] : href.pathname === realPathname;

  if (exact) {
    isCurrent =
      typeof href === 'string' ? realPathname === href.split('?')[0] : isEqual(currentPath, href);
  }

  if (isTab) {
    if (typeof href === 'string') {
      isCurrent = realPathname === href;
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
        onClick={onClick}
        className={`${className ? className : ''} ${isCurrent ? activeClassName : ''}`}
        data-cy={testId}
        {...props}
      >
        {typeof children === 'function' ? children(isCurrent) : children}
      </a>
    </NextLink>
  );
};

export default Link;
