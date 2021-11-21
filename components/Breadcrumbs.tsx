import { getConstantTranslation } from 'config/constantTranslations';
import { useRouter } from 'next/router';
import * as React from 'react';
import Inner from 'components/Inner';
import Link, { LinkInterface } from 'components/Link/Link';

export interface BreadcrumbsItemInterface extends LinkInterface {
  name: string;
}

export interface BreadcrumbsInterface {
  currentPageName?: string;
  config?: BreadcrumbsItemInterface[];
  noMainPage?: boolean;
  lowTop?: boolean;
  lowBottom?: boolean;
  lowWrapper?: boolean;
  urlPrefix?: string;
  centered?: boolean;
}

const linkClassName =
  'text-primary-text hover:text-primary-text hover:no-underline whitespace-nowrap';

const Breadcrumbs: React.FC<BreadcrumbsInterface> = ({
  currentPageName,
  config = [],
  noMainPage,
  lowBottom,
  lowTop,
  lowWrapper,
  urlPrefix = '',
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
            <li className='inline mr-1'>
              <Link className={linkClassName} href={urlPrefix ? urlPrefix : '/'}>
                <span className='hover:text-theme'>{mainPageName}</span> —
              </Link>
            </li>
          )}
          {(config || []).map((configItem, index) => {
            const isLastItem = index === (config || []).length - 1;

            if (isLastItem && !currentPageName) {
              return (
                <li key={index} className='inline mr-1 text-secondary-text whitespace-nowrap'>
                  {configItem.name}
                </li>
              );
            }

            return (
              <li className='inline mr-1' key={index}>
                <Link className={linkClassName} href={`${urlPrefix}${configItem.href}`}>
                  <span className='hover:text-theme'>{configItem.name}</span> —
                </Link>
              </li>
            );
          })}

          {currentPageName ? (
            <li className='inline mr-1 text-secondary-text'>{currentPageName}</li>
          ) : null}
        </ul>
      </Inner>
    </div>
  );
};

export default Breadcrumbs;
