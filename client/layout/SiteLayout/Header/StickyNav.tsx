import React from 'react';
import classes from './StickyNav.module.css';
import Inner from '../../../components/Inner/Inner';
import { useSiteContext } from '../../../context/siteContext';
import { useRouter } from 'next/router';
import Link from '../../../components/Link/Link';

const StickyNav: React.FC = () => {
  const { getRubricsTree } = useSiteContext();
  const { query } = useRouter();
  const { catalogue = [] } = query;
  const catalogueSlug = catalogue[0];

  return (
    <nav className={classes.nav}>
      <Inner lowBottom lowTop>
        <ul className={classes.navList}>
          {getRubricsTree.map(({ nameString, slug }) => {
            const isCurrent = slug === catalogueSlug;
            return (
              <li key={slug}>
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
              </li>
            );
          })}
        </ul>
      </Inner>
    </nav>
  );
};

export default StickyNav;
