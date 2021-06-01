import Link from 'components/Link/Link';
import { useRouter } from 'next/router';
import * as React from 'react';
import Inner from 'components/Inner/Inner';
import { ClientNavItemInterface } from 'types/clientTypes';

interface AppSubNavInterface {
  navConfig: ClientNavItemInterface[];
}

const activeClassName = `text-primary-text border-primary-text`;
const staticClassName = `text-secondary-text border-transparent`;
const disabledClassName = `opacity-50 pointer-events-none cursor-default`;

const AppSubNav: React.FC<AppSubNavInterface> = ({ navConfig }) => {
  const { asPath } = useRouter();

  return (
    <Inner lowTop>
      <div className={'border-b border-[var(--borderColor)] overflow-auto whitespace-nowrap'}>
        <div className={'flex items-baseline'}>
          {navConfig.map(({ path, name, testId, shallow, disabled, exact }) => {
            const asPathArray = asPath.split('?');
            const cleanAasPath = asPathArray[0];
            const hrefArray = `${path}`.split('?');
            const cleanHref = hrefArray[0];
            const reg = RegExp(`${path}`);
            const isCurrent = exact ? cleanHref === cleanAasPath : reg.test(asPath);

            return (
              <Link
                className={`flex pt-4 pb-4 text-lg mr-6 border-b-2 hover:no-underline hover:text-primary-text ${
                  isCurrent ? activeClassName : staticClassName
                } ${disabled ? disabledClassName : ''}`}
                href={`${path}`}
                testId={testId}
                shallow={shallow}
                key={`${path}`}
              >
                {name}
              </Link>
            );
          })}
        </div>
      </div>
    </Inner>
  );
};

export default AppSubNav;
