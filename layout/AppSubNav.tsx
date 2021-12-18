import WpLink from 'components/Link/WpLink';
import { useRouter } from 'next/router';
import * as React from 'react';
import Inner from 'components/Inner';
import { ClientNavItemInterface } from 'types/clientTypes';

interface AppSubNavInterface {
  navConfig: ClientNavItemInterface[];
}

const activeClassName = `text-primary-text border-primary-text`;
const staticClassName = `text-secondary-text border-transparent`;
const disabledClassName = `opacity-50 pointer-events-none cursor-default`;

const AppSubNav: React.FC<AppSubNavInterface> = ({ navConfig }) => {
  const { asPath } = useRouter();
  const [config] = React.useState<ClientNavItemInterface[]>(() => {
    return navConfig.filter(({ hidden }) => !hidden);
  });

  if (config.length < 2) {
    return null;
  }

  return (
    <Inner lowTop>
      <div className={'border-b border-[var(--border-300)] overflow-auto whitespace-nowrap'}>
        <div className={'flex items-baseline'}>
          {config.map(({ path, name, testId, shallow, disabled, hidden, exact }) => {
            if (hidden) {
              return null;
            }

            const asPathArray = asPath.split('?');
            const cleanAasPath = asPathArray[0];
            const hrefArray = `${path}`.split('?');
            const cleanHref = hrefArray[0];
            const reg = RegExp(`${path}`);
            const isCurrent = exact ? cleanHref === cleanAasPath : reg.test(asPath);

            return (
              <WpLink
                className={`flex pt-4 pb-4 text-lg mr-6 border-b-2 hover:no-underline hover:text-primary-text ${
                  isCurrent ? activeClassName : staticClassName
                } ${disabled ? disabledClassName : ''}`}
                href={`${path}`}
                testId={testId}
                shallow={shallow}
                key={`${path}`}
              >
                {name}
              </WpLink>
            );
          })}
        </div>
      </div>
    </Inner>
  );
};

export default AppSubNav;
