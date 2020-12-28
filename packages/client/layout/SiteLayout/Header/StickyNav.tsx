import React, { useEffect, useState } from 'react';
import classes from './StickyNav.module.css';
import Inner from '../../../components/Inner/Inner';
import { useSiteContext } from '../../../context/siteContext';
import { useRouter } from 'next/router';
import Link from '../../../components/Link/Link';
import OutsideClickHandler from 'react-outside-click-handler';
import { alwaysArray } from '../../../utils/alwaysArray';
import {
  RubricNavItemAttributeFragment,
  SiteRubricFragmentFragment,
} from '../../../generated/apolloComponents';

export interface StickyNavAttributeInterface {
  attribute: RubricNavItemAttributeFragment;
  hideDropdownHandler: () => void;
  isDropdownOpen: boolean;
}

const StickyNavAttribute: React.FC<StickyNavAttributeInterface> = ({
  attribute,
  hideDropdownHandler,
  isDropdownOpen,
}) => {
  const { asPath } = useRouter();
  const { id, isDisabled, hiddenOptions, visibleOptions, nameString } = attribute;
  const [isOptionsOpen, setIsOptionsOpen] = useState<boolean>(false);
  const moreTriggerText = isOptionsOpen ? 'Скрыть' : 'Показать еще';

  useEffect(() => {
    if (!isDropdownOpen) {
      setIsOptionsOpen(false);
    }
  }, [isDropdownOpen]);

  if (isDisabled) {
    return null;
  }

  return (
    <div key={id}>
      <div className={`${classes.dropdownAttributeName}`}>{nameString}</div>
      <ul>
        {visibleOptions.map((option) => {
          const isCurrent = asPath === option.slug;

          return (
            <li key={option.id}>
              <Link
                href={option.slug}
                onClick={hideDropdownHandler}
                className={`${classes.dropdownAttributeOption} ${
                  isCurrent ? classes.currentOption : ''
                }`}
              >
                {option.nameString}
              </Link>
            </li>
          );
        })}
        {isOptionsOpen
          ? hiddenOptions.map((option) => {
              const isCurrent = asPath === option.slug;

              return (
                <li key={option.id}>
                  <Link
                    href={option.slug}
                    onClick={hideDropdownHandler}
                    className={`${classes.dropdownAttributeOption} ${
                      isCurrent ? classes.currentOption : ''
                    }`}
                  >
                    {option.nameString}
                  </Link>
                </li>
              );
            })
          : null}
      </ul>

      {hiddenOptions.length > 0 ? (
        <div
          className={classes.optionsTrigger}
          onClick={() => setIsOptionsOpen((prevState) => !prevState)}
        >
          {moreTriggerText}
        </div>
      ) : null}
    </div>
  );
};

interface StickyNavItemInterface {
  rubric: SiteRubricFragmentFragment;
}

const StickyNavItem: React.FC<StickyNavItemInterface> = ({ rubric }) => {
  const { query } = useRouter();
  const { hideBurgerDropdown } = useSiteContext();
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const { catalogue = [], card = [] } = query;
  const realCatalogueQuery = alwaysArray(catalogue);
  const catalogueSlug = realCatalogueQuery[0];
  const { nameString, slug, navItems } = rubric;
  const { isDisabled } = navItems;

  // Get rubric slug from product card path
  const cardSlugs: string[] = alwaysArray(card).slice(0, card.length - 1);
  const cardSlugsParts = cardSlugs.map((slug) => {
    return slug.split('-');
  });
  const rubricSlugArr = cardSlugsParts.find((part) => part[0] === 'rubric');
  const rubricSlug = rubricSlugArr ? rubricSlugArr[1] : '';
  const isCurrent = slug === catalogueSlug || rubricSlug === rubric.slug;

  function showDropdownHandler() {
    if (!isDisabled) {
      hideBurgerDropdown();
      setIsDropdownOpen(true);
    }
  }

  function hideDropdownHandler() {
    setIsDropdownOpen(false);
  }

  if (isDisabled) {
    return null;
  }

  return (
    <li
      className={classes.navItem}
      onMouseEnter={showDropdownHandler}
      onMouseLeave={hideDropdownHandler}
      data-cy={`main-rubric-list-item-${nameString}`}
    >
      <Link
        href={`/${slug}`}
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
              {navItems.attributes.map((attribute) => {
                return (
                  <StickyNavAttribute
                    key={attribute.id}
                    attribute={attribute}
                    isDropdownOpen={isDropdownOpen}
                    hideDropdownHandler={hideDropdownHandler}
                  />
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
  const { isBurgerDropdownOpen, getRubricsTree } = useSiteContext();
  console.log(getRubricsTree);
  return (
    <nav className={classes.nav}>
      <Inner lowBottom lowTop>
        {isBurgerDropdownOpen ? (
          <div className={classes.navCover}>
            <Inner className={classes.navCoverInner} lowBottom lowTop>
              <div className={classes.navCoverContent} />
            </Inner>
          </div>
        ) : null}
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
