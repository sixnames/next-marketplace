import React, { useEffect, useState } from 'react';
import Inner from '../../../components/Inner/Inner';
import Icon from '../../../components/Icon/Icon';
import Link from 'next/link';
import classes from './HeaderNav.module.css';
import Backdrop from '../../../components/Backdrop/Backdrop';
import { useSiteContext } from '../../../context/siteContext';
import { SiteRubricFragmentFragment } from '../../../generated/apolloComponents';
import { useRouter } from 'next/router';

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
        <div onClick={toggleRubricsHandler} className={classes.trigger}>
          <Icon name={'Menu'} />
          Все разделы
        </div>

        <div className={`${classes.rubrics} ${isRubricsOpen ? classes.rubricsActive : ''}`}>
          <div className={classes.rubricsFrame}>
            <ul className={classes.mainRubrics}>
              {getRubricsTree.map(({ catalogueName, id, slug }) => {
                const isCurrent = slug === catalogue;
                return (
                  <li key={slug}>
                    <Link
                      href={{
                        pathname: `/[...catalogue]`,
                      }}
                      as={{
                        pathname: `/${slug}`,
                      }}
                    >
                      <a
                        onClick={hideRubricsHandler}
                        onMouseEnter={() => setCurrentRubricHandler(id)}
                        className={`${classes.mainRubricsItem} ${isCurrent ? classes.current : ''}`}
                      >
                        {catalogueName}
                      </a>
                    </Link>
                  </li>
                );
              })}
            </ul>

            <div className={classes.subRubrics}>
              {subRubrics.map(({ catalogueName, id, slug, children = [] }) => (
                <div key={id}>
                  <Link
                    href={{
                      pathname: `/[...catalogue]`,
                    }}
                    as={{
                      pathname: `/${slug}`,
                    }}
                  >
                    <a onClick={hideRubricsHandler} className={classes.subRubricsTitle}>
                      {catalogueName}
                    </a>
                  </Link>

                  {!!children && (
                    <ul>
                      {children.map(({ catalogueName, id, slug }) => (
                        <li className={classes.subRubricsItem} key={id}>
                          <Link
                            href={{
                              pathname: `/[...catalogue]`,
                            }}
                            as={{
                              pathname: `/${slug}`,
                            }}
                          >
                            <a onClick={hideRubricsHandler} className={classes.subRubricsLink}>
                              {catalogueName}
                            </a>
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
