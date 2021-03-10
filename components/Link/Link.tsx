import * as React from 'react';
import NextLink, { LinkProps } from 'next/link';
import { useRouter } from 'next/router';
import qs from 'qs';

export interface LinkInterface
  extends Omit<LinkProps, 'as' | 'href'>,
    React.PropsWithChildren<any> {
  className?: string;
  activeClassName?: string;
  testId?: string;
  exact?: boolean;
  isTab?: boolean;
  onClick?: () => void;
  href: string;
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
  ...props
}) => {
  const { query, asPath } = useRouter() || { pathname: '', query: '' };
  const asPathArray = asPath.split('?');
  const cleanAasPath = asPathArray[0];
  const hrefArray = href.split('?');
  const hrefQuery = `?${hrefArray[1]}`;
  const parsedHrefQuery = qs.parse(hrefQuery);
  const cleanHref = hrefArray[0];

  let isCurrent = cleanHref === cleanAasPath;

  if (exact) {
    isCurrent = href === asPath;
  }

  if (isTab) {
    isCurrent = cleanHref === cleanAasPath && query.tab === parsedHrefQuery.tab;
  }

  return (
    <NextLink href={href} replace={replace}>
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
