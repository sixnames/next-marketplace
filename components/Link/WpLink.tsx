import * as React from 'react';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import qs from 'qs';
import { LinkInterface } from '../../db/uiInterfaces';

const WpLink: React.FC<LinkInterface> = ({
  className = '',
  activeClassName = '',
  href,
  children,
  testId,
  exact = false,
  isTab = false,
  replace,
  onClick,
  prefetch,
  ariaLabel,
  shallow,
  ...props
}) => {
  const { query, asPath } = useRouter() || { pathname: '', query: '' };
  const asPathArray = asPath.split('?');
  const cleanAsPath = asPathArray[0];
  const hrefArray = href.split('?');
  const hrefQuery = hrefArray[1] || '';
  const parsedHrefQuery = qs.parse(hrefQuery);
  const cleanHref = hrefArray[0];

  const reg = RegExp(`${href}`);
  let isCurrent = reg.test(asPath);

  if (exact) {
    isCurrent = href === asPath;
  }

  if (isTab) {
    const currentTab = query.tab || '0';
    isCurrent = cleanHref === cleanAsPath && currentTab === parsedHrefQuery.tab;
  }

  return (
    <NextLink href={href} replace={replace} prefetch={prefetch || false} shallow={shallow}>
      <a
        aria-label={ariaLabel}
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

export default WpLink;
