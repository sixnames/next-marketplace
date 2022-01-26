import * as React from 'react';
import { useRouter } from 'next/router';
import { NavItemModel } from '../../db/dbModels';
import { CompanyInterface } from '../../db/uiInterfaces';
import { UseCompactReturnInterface } from '../../hooks/useCompact';
import CmsNavItem from './CmsNavItem';

interface AppNavInterface {
  compact: UseCompactReturnInterface;
  navItems: NavItemModel[];
  basePath: string;
  pageCompany?: CompanyInterface | null;
  isMobile: boolean;
}

const CmsNav: React.FC<AppNavInterface> = ({
  compact,
  isMobile,
  basePath,
  pageCompany,
  navItems,
}) => {
  const { pathname } = useRouter();
  const { isCompact, setCompactOff, setCompactOn } = compact;

  return (
    <nav
      className={`fixed inset-x-0 top-[60px] left-0 z-20 h-[calc(100vh-60px)] w-[250px] overflow-y-auto bg-[#2B3039] shadow-md ${
        isCompact ? 'hidden w-[60px] lg:block' : 'block'
      }`}
      onClick={() => {
        if (isMobile) {
          setCompactOn();
        }
      }}
    >
      {/*company logo*/}
      {pageCompany ? (
        <div>
          {pageCompany.logo ? (
            <div className='relative px-[20px] pt-8 pb-8'>
              <img
                className='h-[70px] w-full object-contain'
                src={pageCompany.logo}
                width='100'
                height='100'
                alt={pageCompany.name}
              />

              <div className='absolute left-[15%] bottom-0 h-[2px] w-[70%] rounded bg-theme' />
            </div>
          ) : (
            <div>{pageCompany.name}</div>
          )}
        </div>
      ) : null}

      <ul className='pb-20 pt-8'>
        {navItems.map((item) => {
          return (
            <CmsNavItem
              companyId={pageCompany ? `${pageCompany._id}` : undefined}
              basePath={basePath}
              isCompact={isCompact}
              key={`${item._id}`}
              item={item}
              pathname={pathname}
              openNavHandler={setCompactOff}
              closeNavHandler={setCompactOn}
            />
          );
        })}
      </ul>
    </nav>
  );
};

export default CmsNav;
