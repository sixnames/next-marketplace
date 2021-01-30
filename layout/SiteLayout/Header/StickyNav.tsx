import * as React from 'react';
import classes from './StickyNav.module.css';
import Inner from '../../../components/Inner/Inner';
import { useSiteContext } from 'context/siteContext';
import { useRouter } from 'next/router';
import Link from '../../../components/Link/Link';
import OutsideClickHandler from 'react-outside-click-handler';
import {
  RubricNavItemAttributeFragment,
  CatalogueNavRubricFragment,
} from 'generated/apolloComponents';
import { alwaysArray } from 'lib/arrayUtils';

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
  const { _id, isDisabled, hiddenOptions, visibleOptions, name } = attribute;
  const [isOptionsOpen, setIsOptionsOpen] = React.useState<boolean>(false);
  const moreTriggerText = isOptionsOpen ? 'Скрыть' : 'Показать еще';

  React.useEffect(() => {
    if (!isDropdownOpen) {
      setIsOptionsOpen(false);
    }
  }, [isDropdownOpen]);

  if (isDisabled) {
    return null;
  }

  return (
    <div key={_id}>
      <div className={`${classes.dropdownAttributeName}`}>{name}</div>
      <ul>
        {visibleOptions.map((option) => {
          const isCurrent = asPath === option.slug;

          return (
            <li key={option._id}>
              <Link
                href={option.slug}
                onClick={hideDropdownHandler}
                className={`${classes.dropdownAttributeOption} ${
                  isCurrent ? classes.currentOption : ''
                }`}
              >
                {option.name}
              </Link>
            </li>
          );
        })}
        {isOptionsOpen
          ? hiddenOptions.map((option) => {
              const isCurrent = asPath === option.slug;

              return (
                <li key={option._id}>
                  <Link
                    href={option.slug}
                    onClick={hideDropdownHandler}
                    className={`${classes.dropdownAttributeOption} ${
                      isCurrent ? classes.currentOption : ''
                    }`}
                  >
                    {option.name}
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
  rubric: CatalogueNavRubricFragment;
}

const StickyNavItem: React.FC<StickyNavItemInterface> = ({ rubric }) => {
  const { query } = useRouter();
  const { hideBurgerDropdown } = useSiteContext();
  const [isDropdownOpen, setIsDropdownOpen] = React.useState<boolean>(false);
  const { catalogue = [], card = [] } = query;
  const realCatalogueQuery = alwaysArray(catalogue);
  const catalogueSlug = realCatalogueQuery[0];
  const { name, slug, navItems } = rubric;
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
      data-cy={`main-rubric-list-item-${rubric._id}`}
    >
      <Link
        href={`/${slug}`}
        onClick={hideDropdownHandler}
        testId={`main-rubric-${name}`}
        className={`${classes.rubric} ${isCurrent ? classes.currentRubric : ''}`}
      >
        {name}
      </Link>
      <OutsideClickHandler disabled={!isDropdownOpen} onOutsideClick={hideDropdownHandler}>
        <div className={`${classes.dropdown} ${isDropdownOpen ? classes.dropdownOpen : ''}`}>
          <Inner className={classes.dropdownInner}>
            <div className={classes.dropdownList}>
              {navItems.attributes.map((attribute) => {
                return (
                  <StickyNavAttribute
                    key={attribute._id}
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
  const { isBurgerDropdownOpen, catalogueNavRubrics } = useSiteContext();

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
          {catalogueNavRubrics.map((rubric) => {
            return <StickyNavItem rubric={rubric} key={rubric._id} />;
          })}
        </ul>
      </Inner>
    </nav>
  );
};

export default StickyNav;
