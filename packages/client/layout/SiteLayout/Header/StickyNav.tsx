import React, { useEffect, useState } from 'react';
import classes from './StickyNav.module.css';
import Inner from '../../../components/Inner/Inner';
import {
  RubricType,
  StickyNavAttributeInterface,
  useSiteContext,
} from '../../../context/siteContext';
import { useRouter } from 'next/router';
import Link from '../../../components/Link/Link';
import OutsideClickHandler from 'react-outside-click-handler';
import { useConfigContext } from '../../../context/configContext';

const StickyNavAttribute: React.FC<StickyNavAttributeInterface> = ({
  attribute,
  hideDropdownHandler,
  rubricSlug,
  isDropdownOpen,
}) => {
  const { asPath } = useRouter();
  const { getSiteConfigSingleValue } = useConfigContext();
  const { id, node, options } = attribute;
  const [isOptionsOpen, setIsOptionsOpen] = useState<boolean>(false);
  const maxVisibleOptionsString = getSiteConfigSingleValue('stickyNavVisibleOptionsCount');
  const maxVisibleOptions = parseInt(maxVisibleOptionsString, 10);

  const visibleOptions = options.slice(0, maxVisibleOptions);
  const hiddenOptions = options.slice(+maxVisibleOptions);
  const moreTriggerText = isOptionsOpen ? 'Скрыть' : 'Показать еще';

  useEffect(() => {
    if (!isDropdownOpen) {
      setIsOptionsOpen(false);
    }
  }, [isDropdownOpen]);

  return (
    <div key={id}>
      <div className={`${classes.dropdownAttributeName}`}>{node.nameString}</div>
      <ul>
        {visibleOptions.map((option) => {
          const optionPath = `/${rubricSlug}/${node.slug}-${option.slug}`;
          const isCurrent = asPath === optionPath;
          return (
            <li key={option.id}>
              <Link
                href={{
                  pathname: `/[...catalogue]`,
                }}
                as={{
                  pathname: optionPath,
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
        {isOptionsOpen
          ? hiddenOptions.map((option) => {
              const optionPath = `/${rubricSlug}/${node.slug}-${option.slug}`;
              const isCurrent = asPath === optionPath;
              return (
                <li key={option.id}>
                  <Link
                    href={{
                      pathname: `/[...catalogue]`,
                    }}
                    as={{
                      pathname: `/${rubricSlug}/${node.slug}-${option.slug}`,
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
  rubric: RubricType;
}

const StickyNavItem: React.FC<StickyNavItemInterface> = ({ rubric }) => {
  const { query } = useRouter();
  const { hideBurgerDropdown } = useSiteContext();
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const { catalogue = [] } = query;
  const catalogueSlug = catalogue[0];
  const { nameString, slug, filterAttributes } = rubric;
  const isCurrent = slug === catalogueSlug;

  function showDropdownHandler() {
    hideBurgerDropdown();
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
      data-cy={`main-rubric-list-item-${nameString}`}
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
              {filterAttributes.map((attribute) => {
                return (
                  <StickyNavAttribute
                    key={attribute.id}
                    attribute={attribute}
                    isDropdownOpen={isDropdownOpen}
                    hideDropdownHandler={hideDropdownHandler}
                    rubricSlug={slug}
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
  const { isBurgerDropdownOpen } = useSiteContext();
  const { getRubricsTree } = useSiteContext();

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