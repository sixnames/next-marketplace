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
  company?: CompanyInterface;
  isMobile: boolean;
}

const CmsNav: React.FC<AppNavInterface> = ({ compact, isMobile, basePath, company, navItems }) => {
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
      {company ? (
        <div>
          {company.logo ? (
            <div className='px-[20px] pt-8'>
              <img
                className='h-[70px] w-full object-contain'
                src={company.logo.url}
                width='100'
                height='100'
                alt={company.name}
              />
            </div>
          ) : (
            <div>{company.name}</div>
          )}
        </div>
      ) : null}

      <ul className='pb-20 pt-8'>
        {navItems.map((item) => {
          return (
            <CmsNavItem
              companyId={company ? `${company._id}` : undefined}
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
