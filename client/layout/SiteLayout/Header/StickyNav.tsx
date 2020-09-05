import React from 'react';
import classes from './StickyNav.module.css';
import Inner from '../../../components/Inner/Inner';
import { useSiteContext } from '../../../context/siteContext';
import { useRouter } from 'next/router';
import Link from '../../../components/Link/Link';

const StickyNav: React.FC = () => {
  const { getRubricsTree } = useSiteContext();
  const { query, asPath } = useRouter();
  const { catalogue = [] } = query;
  const catalogueSlug = catalogue[0];

  return (
    <nav className={classes.nav}>
      <Inner lowBottom lowTop>
        <ul className={classes.navList}>
          {getRubricsTree.map(({ nameString, slug, filterAttributes }) => {
            const isCurrent = slug === catalogueSlug;

            return (
              <li key={slug} className={classes.navItem}>
                <Link
                  href={{
                    pathname: `/[...catalogue]`,
                  }}
                  as={{
                    pathname: `/${slug}`,
                  }}
                  testId={`main-rubric-${nameString}`}
                  className={`${classes.rubric} ${isCurrent ? classes.currentRubric : ''}`}
                >
                  {nameString}
                </Link>
                <div className={classes.dropdown}>
                  <Inner className={classes.dropdownInner}>
                    <div className={classes.dropdownList}>
                      {filterAttributes.map(({ id, node: attribute, options }) => {
                        return (
                          <div key={id}>
                            <div className={`${classes.dropdownAttributeName}`}>
                              {attribute.nameString}
                            </div>
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
              </li>
            );
          })}
        </ul>
      </Inner>
    </nav>
  );
};

export default StickyNav;
