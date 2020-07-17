import React, { useEffect, useState } from 'react';
import Inner from '../../../components/Inner/Inner';
import Icon from '../../../components/Icon/Icon';
import classes from './HeaderNav.module.css';
import Backdrop from '../../../components/Backdrop/Backdrop';
import { useSiteContext } from '../../../context/siteContext';
import { SiteRubricFragmentFragment } from '../../../generated/apolloComponents';
import { useRouter } from 'next/router';
import Link from '../../../components/Link/Link';

interface SubRubricInterface extends SiteRubricFragmentFragment {
  children: SiteRubricFragmentFragment[];
}

function HeaderNav() {
  const { getRubricsTree } = useSiteContext();
  const { query } = useRouter();
  const [isRubricsOpen, setIsRubricsOpen] = useState(false);
  const [currentRubric, setCurrentRubric] = useState<string | null>(null);
  const [subRubrics, setSubRubrics] = useState<SubRubricInterface[]>([]);
  const { catalogue } = query;
  const catalogueSlug = catalogue ? catalogue[0] : '';

  function toggleRubricsHandler() {
    setIsRubricsOpen((prevState) => !prevState);
  }

  function hideRubricsHandler() {
    setIsRubricsOpen(false);
  }

  function setCurrentRubricHandler(id: string) {
    setCurrentRubric(id);
  }

  useEffect(() => {
    if (currentRubric) {
      const currentChildren = getRubricsTree.find(({ id }) => id === currentRubric);
      if (currentChildren && currentChildren.children) {
        setSubRubrics(currentChildren.children);
      }
    }
  }, [currentRubric, getRubricsTree]);

  return (
    <Inner lowTop lowBottom>
      <nav className={classes.frame}>
        <div
          onClick={toggleRubricsHandler}
          className={classes.trigger}
          data-cy={'show-all-rubrics'}
        >
          <Icon name={'Menu'} />
          Все разделы
        </div>

        <div
          className={`${classes.rubrics} ${isRubricsOpen ? classes.rubricsActive : ''}`}
          data-cy={'all-rubrics-nav'}
        >
          <div className={classes.rubricsFrame}>
            <ul className={classes.mainRubrics}>
              {getRubricsTree.map(({ name, id, slug }) => {
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
                      testId={`main-rubric-${name}`}
                      onClick={hideRubricsHandler}
                      onMouseEnter={() => setCurrentRubricHandler(id)}
                      className={`${classes.mainRubricsItem} ${isCurrent ? classes.current : ''}`}
                    >
                      {name}
                    </Link>
                  </li>
                );
              })}
            </ul>

            <div className={classes.subRubrics}>
              {subRubrics.map(({ name, id, slug, children = [] }) => (
                <div key={id}>
                  <Link
                    href={{
                      pathname: `/[...catalogue]`,
                    }}
                    as={{
                      pathname: `/${slug}`,
                    }}
                    testId={`second-level-${name}`}
                    onClick={hideRubricsHandler}
                    className={classes.subRubricsTitle}
                  >
                    {name}
                  </Link>

                  {!!children && (
                    <ul>
                      {children.map(({ name, id, slug }) => (
                        <li className={classes.subRubricsItem} key={id}>
                          <Link
                            href={{
                              pathname: `/[...catalogue]`,
                            }}
                            as={{
                              pathname: `/${slug}`,
                            }}
                            testId={`third-level-${name}`}
                            onClick={hideRubricsHandler}
                            className={classes.subRubricsLink}
                          >
                            {name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </div>

          {isRubricsOpen && <Backdrop onClick={hideRubricsHandler} />}
        </div>
      </nav>
    </Inner>
  );
}

export default HeaderNav;
