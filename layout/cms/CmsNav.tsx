import { NavItemModel } from 'db/dbModels';
import { CompanyInterface } from 'db/uiInterfaces';
import * as React from 'react';
import CmsNavItem from 'layout/cms/CmsNavItem';
import { useRouter } from 'next/router';
import { UseCompactReturnInterface } from 'hooks/useCompact';

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
      className={`fixed top-[60px] overflow-y-auto inset-x-0 z-20 w-[250px] h-[calc(100vh-60px)] left-0 shadow-md bg-[#2B3039] ${
        isCompact ? 'hidden lg:block w-[60px]' : 'block'
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
            <div className='px-[20px] pt-8 pb-8 relative'>
              <img
                className='h-[70px] w-full object-contain'
                src={pageCompany.logo.url}
                width='100'
                height='100'
                alt={pageCompany.name}
              />

              <div className='absolute left-[15%] w-[70%] h-[2px] bg-theme rounded bottom-0' />
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
