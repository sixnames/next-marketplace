import { useRouter } from 'next/router';
import * as React from 'react';
import { getConstantTranslation } from '../config/constantTranslations';
import { BreadcrumbsInterface } from '../db/uiInterfaces';
import Inner from './Inner';
import WpLink from './Link/WpLink';

const linkClassName = 'text-primary-text hover:text-primary-text hover:no-underline';

const WpBreadcrumbs: React.FC<BreadcrumbsInterface> = ({
  currentPageName,
  config = [],
  noMainPage,
  lowBottom,
  lowTop,
  lowWrapper,
  centered,
}) => {
  const { locale } = useRouter();

  const mainPageName = React.useMemo(() => {
    return getConstantTranslation(`breadcrumbs.main.${locale}`);
  }, [locale]);

  return (
    <div className={lowWrapper ? '' : 'mb-4 lg:mb-8'}>
      <Inner lowBottom={lowBottom} lowTop={lowTop}>
        <ul className={centered ? 'text-center' : ''}>
          {noMainPage ? null : (
            <li className='mr-1 inline'>
              <WpLink className={linkClassName} href={'/'}>
                <span className='hover:text-theme'>{mainPageName}</span> —
              </WpLink>
            </li>
          )}
          {(config || []).map((configItem, index) => {
            const isLastItem = index === (config || []).length - 1;

            if (isLastItem && !currentPageName) {
              return (
                <li key={index} className='mr-1 inline text-secondary-text'>
                  {configItem.name}
                </li>
              );
            }

            return (
              <li className='mr-1 inline' key={index}>
                <WpLink className={linkClassName} href={configItem.href}>
                  <span className='hover:text-theme'>{configItem.name}</span> —
                </WpLink>
              </li>
            );
          })}

          {currentPageName ? (
            <li className='mr-1 inline text-secondary-text'>{currentPageName}</li>
          ) : null}
        </ul>
      </Inner>
    </div>
  );
};

export default WpBreadcrumbs;
