import { getConstantTranslation } from 'config/constantTranslations';
import { useRouter } from 'next/router';
import * as React from 'react';
import Inner from 'components/Inner';
import Link, { LinkInterface } from 'components/Link/Link';

export interface BreadcrumbsItemInterface extends LinkInterface {
  name: string;
}

interface BreadcrumbsInterface {
  currentPageName: string;
  config?: BreadcrumbsItemInterface[];
}

const Breadcrumbs: React.FC<BreadcrumbsInterface> = ({ currentPageName, config = [] }) => {
  const { locale } = useRouter();

  const mainPageName = React.useMemo(() => {
    return getConstantTranslation(`breadcrumbs.main.${locale}`);
  }, [locale]);

  return (
    <div className='mb-10'>
      <Inner>
        <ul className='overflow-hidden whitespace-nowrap overflow-ellipsis'>
          <li className='inline mr-1'>
            <Link
              className='text-primary-text hover:text-primary-text hover:no-underline'
              href={`/`}
            >
              <span className='hover:text-theme'>{mainPageName}</span> —
            </Link>
          </li>
          {config.map((configItem, index) => {
            return (
              <li className='inline mr-1' key={index}>
                <Link
                  className='text-primary-text hover:text-primary-text hover:no-underline'
                  href={configItem.href}
                >
                  <span className='hover:text-theme'>{configItem.name}</span> —
                </Link>
              </li>
            );
          })}
          <li className='inline mr-1 text-secondary-text'>{currentPageName}</li>
        </ul>
      </Inner>
    </div>
  );
};

export default Breadcrumbs;
