import React, { useState } from 'react';
import classes from './StickyNav.module.css';
import Inner from '../../../components/Inner/Inner';
import { useSiteContext } from '../../../context/siteContext';
import { useRouter } from 'next/router';
import Link from '../../../components/Link/Link';
import { InitialSiteQueryQuery } from '../../../generated/apolloComponents';
import OutsideClickHandler from 'react-outside-click-handler';

interface StickyNavItemInterface {
  rubric: InitialSiteQueryQuery['getRubricsTree'][number];
}

const StickyNavItem: React.FC<StickyNavItemInterface> = ({ rubric }) => {
  const { query, asPath } = useRouter();
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const { catalogue = [] } = query;
  const catalogueSlug = catalogue[0];
  const { nameString, slug, filterAttributes } = rubric;
  const isCurrent = slug === catalogueSlug;

  function showDropdownHandler() {
    setIsDropdownOpen(true);
  }

  function hideDropdownHandler() {
    setIsDropdownOpen(false);
  }

  return (
    <li
      className={classes.navItem}
      onMouseEnter={showDropdownHandler}
      onMouseLeave={hideDropdownHandler}
    >
      <Link
        href={{
          pathname: `/[...catalogue]`,
        }}
        as={{
          pathname: `/${slug}`,
        }}
        onClick={hideDropdownHandler}
        testId={`main-rubric-${nameString}`}
        className={`${classes.rubric} ${isCurrent ? classes.currentRubric : ''}`}
      >
        {nameString}
      </Link>
      <OutsideClickHandler disabled={!isDropdownOpen} onOutsideClick={hideDropdownHandler}>
        <div className={`${classes.dropdown} ${isDropdownOpen ? classes.dropdownOpen : ''}`}>
          <Inner className={classes.dropdownInner}>
            <div className={classes.dropdownList}>
              {filterAttributes.map(({ id, node: attribute, options }) => {
                return (
                  <div key={id}>
                    <div className={`${classes.dropdownAttributeName}`}>{attribute.nameString}</div>
                    <ul>
                      {options.map((option) => {
                        const optionPath = `/${slug}/${attribute.slug}-${option.slug}`;
                        const isCurrent = asPath === optionPath;
                        return (
                          <li key={option.id}>
                            <Link
                              href={{
                                pathname: `/[...catalogue]`,
                              }}
                              as={{
                                pathname: `/${slug}/${attribute.slug}-${option.slug}`,
                              }}
                              onClick={hideDropdownHandler}
                              className={`${classes.dropdownAttributeOption} ${
                                isCurrent ? classes.currentOption : ''
                              }`}
                            >
                              {option.filterNameString}
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                );
              })}
            </div>
            <div />
          </Inner>
        </div>
      </OutsideClickHandler>
    </li>
  );
};

const StickyNav: React.FC = () => {
  const { getRubricsTree } = useSiteContext();

  return (
    <nav className={classes.nav}>
      <Inner lowBottom lowTop>
        <ul className={classes.navList}>
          {getRubricsTree.map((rubric) => {
            return <StickyNavItem rubric={rubric} key={rubric.id} />;
          })}
        </ul>
      </Inner>
    </nav>
  );
};

export default StickyNav;
