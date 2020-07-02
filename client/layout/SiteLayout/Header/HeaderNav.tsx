import React, { useEffect, useState } from 'react';
import Inner from '../../../components/Inner/Inner';
import Icon from '../../../components/Icon/Icon';
import Link from 'next/link';
import classes from './HeaderNav.module.css';
import Backdrop from '../../../components/Backdrop/Backdrop';
import { useSiteContext } from '../../../context/siteContext';

function HeaderNav() {
  const { getRubricsTree } = useSiteContext();
  const [isRubricsOpen, setIsRubricsOpen] = useState(false);
  const [currentRubric, setCurrentRubric] = useState<string | null>(null);
  const [subRubrics, setSubRubrics] = useState<any[]>([]);

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
              {getRubricsTree.map(({ name, id, slug }) => {
                const isCurrent = id === currentRubric;
                return (
                  <li key={id}>
                    <Link
                      href={{
                        pathname: `/[catalogue]`,
                        query: { id: `${id}` },
                      }}
                      as={{
                        pathname: `/${slug}`,
                        query: { id: `${id}` },
                      }}
                    >
                      <a
                        onClick={hideRubricsHandler}
                        onMouseEnter={() => setCurrentRubricHandler(id)}
                        className={`${classes.mainRubricsItem} ${isCurrent ? classes.current : ''}`}
                      >
                        {name}
                      </a>
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
                      pathname: `/[catalogue]`,
                      query: { id: `${id}` },
                    }}
                    as={{
                      pathname: `/${slug}`,
                      query: { id: `${id}` },
                    }}
                  >
                    <a onClick={hideRubricsHandler} className={classes.subRubricsTitle}>
                      {name}
                    </a>
                  </Link>

                  {!!children && (
                    <ul>
                      {children.map(
                        ({ name, id, slug }: { name: string; id: string; slug: string }) => (
                          <li className={classes.subRubricsItem} key={id}>
                            <Link
                              href={{
                                pathname: `/[catalogue]`,
                                query: { id: `${id}` },
                              }}
                              as={{
                                pathname: `/${slug}`,
                                query: { id: `${id}` },
                              }}
                            >
                              <a onClick={hideRubricsHandler} className={classes.subRubricsLink}>
                                {name}
                              </a>
                            </Link>
                          </li>
                        ),
                      )}
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
